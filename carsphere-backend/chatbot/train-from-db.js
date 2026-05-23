import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { NlpManager } from 'node-nlp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Vehicle from '../models/Vehicle.js';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const manager = new NlpManager({ languages: ['en'], forceNER: true });

// Helper to generate all combinations of training sentences
const generateSentences = (makes, models, years, fuelTypes, transmissions, colors, locations) => {
  const sentences = [];

  // Templates for search.cars intent
  const templates = [
    'Show me {make} cars',
    'Find {make} {model}',
    'I want a {make} {model}',
    'List {make} vehicles',
    'Search for {make}',
    'Show me {make} {model} {year}',
    '{make} {model} under {price} lakhs',
    'Cars with {fuel} engine',
    'Looking for {transmission} transmission',
    '{color} cars',
    'Vehicles in {location}',
    'Cars cheaper than {price} lakhs',
  ];

  // For each make
  for (const make of makes) {
    sentences.push(`Show me ${make} cars`);
    sentences.push(`Find ${make} vehicles`);
    sentences.push(`I want a ${make}`);
    sentences.push(`Search for ${make}`);

    // For each model of this make (if we have models grouped by make)
    const makeModels = models.filter(m => m.make === make).map(m => m.model);
    for (const model of makeModels) {
      sentences.push(`Show me ${make} ${model}`);
      sentences.push(`Find ${make} ${model} for sale`);
      sentences.push(`I want a ${make} ${model}`);
      sentences.push(`Looking for ${make} ${model}`);
      // With year
      for (const year of years.slice(0, 5)) { // limit years to avoid explosion
        sentences.push(`${make} ${model} ${year}`);
        sentences.push(`Show me ${make} ${model} ${year}`);
      }
    }
  }

  // Fuel types
  for (const fuel of fuelTypes) {
    sentences.push(`${fuel} cars`);
    sentences.push(`Cars with ${fuel} engine`);
    sentences.push(`Looking for ${fuel} vehicles`);
  }

  // Transmissions
  for (const trans of transmissions) {
    sentences.push(`${trans} transmission cars`);
    sentences.push(`Cars with ${trans} gearbox`);
  }

  // Colors
  for (const color of colors) {
    sentences.push(`${color} cars`);
    sentences.push(`Find ${color} vehicles`);
  }

  // Locations
  for (const loc of locations) {
    sentences.push(`Cars in ${loc}`);
    sentences.push(`Vehicles located in ${loc}`);
  }

  // Price variations (using actual price ranges from DB)
  const priceRanges = [5, 10, 15, 20, 30, 40, 50, 60, 80, 100];
  for (const price of priceRanges) {
    sentences.push(`Cars under ${price} lakhs`);
    sentences.push(`Vehicles cheaper than ${price} lakhs`);
    sentences.push(`Show me cars under ${price} lakhs`);
  }

  // Remove duplicates
  return [...new Set(sentences)];
};

const trainFromDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Fetch distinct values from database
    const makes = await Vehicle.distinct('make');
    const modelsRaw = await Vehicle.find({}, 'make model').lean();
    const models = modelsRaw.map(m => ({ make: m.make, model: m.model }));
    const years = await Vehicle.distinct('year');
    const fuelTypes = await Vehicle.distinct('fuelType');
    const transmissions = await Vehicle.distinct('transmission');
    const colors = await Vehicle.distinct('color');
    const locations = await Vehicle.distinct('location');

    console.log(`Found ${makes.length} makes, ${models.length} models, ${years.length} years, etc.`);

    // Generate training sentences
    const sentences = generateSentences(makes, models, years, fuelTypes, transmissions, colors, locations);
    console.log(`Generated ${sentences.length} training sentences`);

    // Add all sentences to the 'search.cars' intent
    for (const sentence of sentences) {
      manager.addDocument('en', sentence, 'search.cars');
    }

    // Add other intents with minimal examples (they will be supplemented by the existing training)
    manager.addDocument('en', 'Find a mechanic near me', 'find.mechanic');
    manager.addDocument('en', 'I need car service', 'find.mechanic');
    manager.addDocument('en', 'What is the current bid on {model}', 'check.bid');
    manager.addDocument('en', 'How much is the bid for {model}', 'check.bid');
    manager.addDocument('en', 'Need spare parts', 'search.parts');
    manager.addDocument('en', 'Buy brake pads', 'search.parts');
    manager.addDocument('en', 'Hello', 'greeting');
    manager.addDocument('en', 'Thanks', 'thanks');

    // Add entity extraction for make, model, year, price, etc.
    // NLP.js automatically learns entities from the examples, but we can explicitly add lookups
    for (const make of makes) {
      manager.addNamedEntityText('carMake', make, ['en'], [make.toLowerCase()]);
    }
    for (const m of models) {
      manager.addNamedEntityText('carModel', m.model, ['en'], [m.model.toLowerCase()]);
    }
    for (const year of years) {
      manager.addNamedEntityText('year', year.toString(), ['en'], [year.toString()]);
    }
    for (const fuel of fuelTypes) {
      manager.addNamedEntityText('fuelType', fuel, ['en'], [fuel.toLowerCase()]);
    }
    for (const trans of transmissions) {
      manager.addNamedEntityText('transmission', trans, ['en'], [trans.toLowerCase()]);
    }
    for (const color of colors) {
      manager.addNamedEntityText('color', color, ['en'], [color.toLowerCase()]);
    }
    for (const loc of locations) {
      manager.addNamedEntityText('location', loc, ['en'], [loc.toLowerCase()]);
    }

    // Add price entity (range extraction is handled by our custom code, but we add some examples)
    manager.addNamedEntityText('price', 'lakh', ['en'], ['lakh', 'lakhs']);
    manager.addNamedEntityText('price', 'crore', ['en'], ['crore', 'crores']);

    // Train the model
    console.log('Training NLP model...');
    await manager.train();
    console.log('Training complete, saving model...');
    manager.save(path.join(__dirname, 'model.nlp'));
    console.log('✅ Model saved to chatbot/model.nlp');
    process.exit(0);
  } catch (error) {
    console.error('❌ Training error:', error);
    process.exit(1);
  }
};

trainFromDB();