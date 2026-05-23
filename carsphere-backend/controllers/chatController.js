// import { NlpManager } from 'node-nlp';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import Vehicle from '../models/Vehicle.js';
// import User from '../models/User.js';
// import SparePart from '../models/SparePart.js';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const manager = new NlpManager({ languages: ['en'] });
// try {
//   await manager.load(path.join(__dirname, '../chatbot/model.nlp'));
//   console.log('✅ NLP model loaded');
// } catch (err) {
//   console.error('❌ Failed to load NLP model:', err.message);
// }

// // --------------------------------------------------------------
// // Vulgar words
// // --------------------------------------------------------------
// const VULGAR_WORDS = ['fuck', 'shit', 'asshole', 'bitch', 'damn', 'crap', 'stupid', 'idiot', 'bastard', 'whore', 'slut', 'dick', 'pussy', 'cock', 'cunt', 'motherfucker', 'retard', 'moron', 'dumb', 'hate', 'kill', 'die', 'ugly', 'garbage'];
// const isVulgar = (text) => VULGAR_WORDS.some(word => text.toLowerCase().includes(word));

// // --------------------------------------------------------------
// // Improved gibberish detection: allow short greetings with common words
// // --------------------------------------------------------------
// const isGibberish = (text) => {
//   const lower = text.toLowerCase();
//   if (lower.length < 2) return true;
//   // Allow common greetings, even short ones
//   const greetings = ['hi', 'hey', 'hello', 'hiii', 'heyy', 'yo', 'sup', 'hola', 'hi me', 'hello me', 'hey there'];
//   if (greetings.some(g => lower.includes(g))) return false;
//   // If more than 70% are non-letters, treat as gibberish
//   const letters = text.replace(/[^a-zA-Z]/g, '').length;
//   if (letters < 2) return true;
//   return false;
// };

// // --------------------------------------------------------------
// // Helper: Price extraction
// // --------------------------------------------------------------
// const extractPrice = (text) => {
//   const str = text.toLowerCase();
//   let match = str.match(/(?:under|below|less than)\s*(\d+(?:\.\d+)?)\s*(lakh|crore)?/i);
//   if (match) {
//     let num = parseFloat(match[1]);
//     if (match[2] === 'crore') return { max: num * 10000000 };
//     return { max: num * 100000 };
//   }
//   match = str.match(/(\d+(?:\.\d+)?)\s*lakh/i);
//   if (match) return { max: parseFloat(match[1]) * 100000 };
//   let plain = str.match(/\b(\d{1,3}(?:,\d{3})*|\d{4,})\b/);
//   if (plain) {
//     let num = parseInt(plain[1].replace(/,/g, ''));
//     if (num >= 1 && num <= 100) return { max: num * 100000 };
//     if (num > 100) return { max: num };
//   }
//   return null;
// };

// // --------------------------------------------------------------
// // Helper: Year
// // --------------------------------------------------------------
// const extractYear = (text) => {
//   const years = text.match(/\b(19|20)\d{2}\b/g);
//   if (!years) return null;
//   if (years.length === 1) return parseInt(years[0]);
//   if (years.length >= 2) return { min: parseInt(years[0]), max: parseInt(years[1]) };
//   return null;
// };

// // --------------------------------------------------------------
// // Helper: Mileage
// // --------------------------------------------------------------
// const extractMileage = (text) => {
//   const match = text.match(/(?:under|below|less than)\s*(\d+(?:,\d+)?)\s*(?:km|kilometers?)/i);
//   if (match) return { max: parseInt(match[1].replace(/,/g, '')) };
//   const plain = text.match(/(\d+(?:,\d+)?)\s*(?:km|kilometers?)/i);
//   if (plain) return { max: parseInt(plain[1].replace(/,/g, '')) };
//   return null;
// };

// // --------------------------------------------------------------
// // Make extraction (robust to punctuation)
// // --------------------------------------------------------------
// const ALL_MAKES = ['toyota', 'honda', 'suzuki', 'kia', 'hyundai', 'audi', 'bmw', 'mercedes', 'ford'];
// const extractMake = (text) => {
//   // Remove punctuation and split
//   const clean = text.toLowerCase().replace(/[^\w\s]/g, ' ');
//   const words = clean.split(/\s+/);
//   for (let make of ALL_MAKES) {
//     if (words.includes(make)) return make;
//     if (clean.includes(make)) return make; // fallback substring
//   }
//   return null;
// };

// // --------------------------------------------------------------
// // Model extraction
// // --------------------------------------------------------------
// const ALL_MODELS = ['corolla', 'civic', 'swift', 'sportage', 'yaris', 'city', 'elantra', 'a4', 'c class', '3 series'];
// const extractModel = (text) => {
//   const clean = text.toLowerCase().replace(/[^\w\s]/g, ' ');
//   const words = clean.split(/\s+/);
//   for (let model of ALL_MODELS) {
//     if (words.includes(model)) return model;
//     if (clean.includes(model)) return model;
//   }
//   return null;
// };

// // --------------------------------------------------------------
// // Fuel, transmission, color, location (simple substring)
// // --------------------------------------------------------------
// const extractFuel = (text) => {
//   const fuels = ['petrol', 'diesel', 'hybrid', 'electric', 'cng'];
//   const lower = text.toLowerCase();
//   for (let f of fuels) if (lower.includes(f)) return f;
//   return null;
// };
// const extractTransmission = (text) => {
//   const lower = text.toLowerCase();
//   if (lower.includes('automatic') || lower.includes('auto')) return 'automatic';
//   if (lower.includes('manual')) return 'manual';
//   return null;
// };
// const extractColor = (text) => {
//   const colors = ['white', 'black', 'silver', 'red', 'blue', 'grey', 'gray', 'green'];
//   const lower = text.toLowerCase();
//   for (let c of colors) if (lower.includes(c)) return c;
//   return null;
// };
// const extractLocation = (text) => {
//   const cities = ['karachi', 'lahore', 'islamabad', 'rawalpindi', 'peshawar', 'quetta', 'multan'];
//   const lower = text.toLowerCase();
//   for (let city of cities) if (lower.includes(city)) return city;
//   return null;
// };

// // --------------------------------------------------------------
// // Main endpoint
// // --------------------------------------------------------------
// export const chatMessage = async (req, res) => {
//   const { message } = req.body;
//   if (!message) return res.status(400).json({ error: 'Message required' });

//   console.log('\n📩 User message:', message);

//   // 1. Vulgar filter
//   if (isVulgar(message)) {
//     return res.json({ reply: "⚠️ Please keep the conversation respectful. I'm here to help with car-related questions only.", cars: [], alternatives: [], mechanics: [], parts: [] });
//   }
//   // 2. Gibberish / nonsense
//   if (isGibberish(message)) {
//     return res.json({ reply: "I didn't understand that. Please ask something about cars, e.g., 'Show me Honda cars under 20 lakhs'.", cars: [], alternatives: [], mechanics: [], parts: [] });
//   }

//   // 3. Detect intent (simple keyword first)
//   const lowerMsg = message.toLowerCase();
//   let intent = 'search.cars';
//   if (lowerMsg.match(/mechanic|service|repair/)) intent = 'find.mechanic';
//   else if (lowerMsg.match(/bid|current bid|highest bid/)) intent = 'check.bid';
//   else if (lowerMsg.match(/part|accessory|spare/)) intent = 'search.parts';
//   else if (lowerMsg.match(/hello|hi|hey|good morning/)) intent = 'greeting';
//   else if (lowerMsg.match(/thank|thanks/)) intent = 'thanks';
//   else {
//     try {
//       const result = await manager.process('en', message);
//       if (result.intent && result.intent !== 'None') intent = result.intent;
//     } catch (e) {}
//   }
//   console.log('🧠 Intent:', intent);

//   // 4. Extract filters
//   const make = extractMake(message);
//   const model = extractModel(message);
//   const fuel = extractFuel(message);
//   const transmission = extractTransmission(message);
//   const color = extractColor(message);
//   const location = extractLocation(message);
//   const priceInfo = extractPrice(message);
//   const yearInfo = extractYear(message);
//   const mileageInfo = extractMileage(message);
//   const hasFilters = make || model || fuel || transmission || color || location || priceInfo || yearInfo || mileageInfo;

//   console.log('📌 Extracted filters:', { make, model, fuel, transmission, color, location, priceInfo, yearInfo, mileageInfo });

//   // 5. If no intent (except greeting/thanks) and no filters, show help (not all cars)
//   if (intent === 'search.cars' && !hasFilters) {
//     return res.json({
//       reply: "Please be more specific. Try saying something like:\n- 'Show me Honda cars under 30 lakhs'\n- 'Find a mechanic'\n- 'What's the bid on Corolla?'",
//       cars: [], alternatives: [], mechanics: [], parts: []
//     });
//   }

//   // 6. Build DB filter
//   let filter = { auctionStatus: 'active' };
//   if (make) filter.make = { $regex: make, $options: 'i' };
//   if (model) filter.model = { $regex: model, $options: 'i' };
//   if (fuel) filter.fuelType = { $regex: fuel, $options: 'i' };
//   if (transmission) filter.transmission = { $regex: transmission, $options: 'i' };
//   if (color) filter.color = { $regex: color, $options: 'i' };
//   if (location) filter.location = { $regex: location, $options: 'i' };
//   if (priceInfo) {
//     if (priceInfo.max) filter.price = { $lte: priceInfo.max };
//     if (priceInfo.min) filter.price = { ...filter.price, $gte: priceInfo.min };
//   }
//   if (yearInfo) {
//     if (typeof yearInfo === 'number') filter.year = yearInfo;
//     else filter.year = { $gte: yearInfo.min, $lte: yearInfo.max };
//   }
//   if (mileageInfo?.max) filter.mileage = { $lte: mileageInfo.max };

//   console.log('🔧 Final filter:', JSON.stringify(filter, null, 2));

//   let reply = '';
//   let cars = [];
//   let alternatives = [];
//   let mechanics = [];
//   let parts = [];

//   // 7. Intent responses
//   if (intent === 'greeting') {
//     reply = "Hello! I'm Carsphere AI. Ask me about cars, mechanics, spare parts, or current bids!";
//   }
//   else if (intent === 'thanks') {
//     reply = "You're welcome! Happy to help. 😊";
//   }
//   else if (intent === 'find.mechanic') {
//     mechanics = await User.find({ role: 'mechanic', isVerified: true }).limit(5).select('fullName workshopAddress rating');
//     reply = mechanics.length ? `Here are ${mechanics.length} verified mechanics:` : 'No verified mechanics available.';
//   }
//   else if (intent === 'check.bid') {
//     const vehicle = await Vehicle.findOne(filter);
//     if (vehicle) {
//       reply = `💰 The current highest bid for ${vehicle.title} is ₨${vehicle.currentBid.toLocaleString()}. Buy it now: ₨${vehicle.price.toLocaleString()}.`;
//     } else {
//       reply = "I couldn't find an active auction for that car.";
//     }
//   }
//   else if (intent === 'search.parts') {
//     const keyword = message.replace(/part|accessory|spare/i, '').trim();
//     parts = await SparePart.find({ name: { $regex: keyword, $options: 'i' } }).limit(5);
//     reply = parts.length ? `Found ${parts.length} part(s):` : 'No matching spare parts found.';
//   }
//   else { // search.cars (with at least one filter)
//     cars = await Vehicle.find(filter).limit(5).select('title price images _id currentBid year mileage fuelType transmission color location');
//     if (cars.length === 0) {
//       let broadFilter = { auctionStatus: 'active' };
//       if (make) broadFilter.make = { $regex: make, $options: 'i' };
//       if (model) broadFilter.model = { $regex: model, $options: 'i' };
//       if (priceInfo?.max) broadFilter.price = { $lte: priceInfo.max * 1.2 };
//       alternatives = await Vehicle.find(broadFilter).limit(4);
//       if (alternatives.length > 0) {
//         reply = `No exact matches found. Here are similar cars:\n` +
//                 alternatives.map(c => `• ${c.title} (${c.year}) - ₨${c.price.toLocaleString()} | ${c.mileage?.toLocaleString()} km`).join('\n');
//       } else {
//         reply = "No cars match your criteria. Try removing some filters or ask for a different make/model.";
//       }
//     } else {
//       reply = `Found ${cars.length} car(s) matching your request:`;
//     }
//   }

//   res.json({ reply, cars, alternatives, mechanics, parts, intent });
// };

import { NlpManager } from 'node-nlp';
import path from 'path';
import { fileURLToPath } from 'url';
import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';
import SparePart from '../models/SparePart.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manager = new NlpManager({ languages: ['en'] });
try {
  await manager.load(path.join(__dirname, '../chatbot/model.nlp'));
  console.log('✅ NLP model loaded');
} catch (err) {
  console.error('❌ Failed to load NLP model:', err.message);
}

// --------------------------------------------------------------
// Vulgar words and gibberish (same as before)
// --------------------------------------------------------------
const VULGAR_WORDS = ['fuck', 'shit', 'asshole', 'bitch', 'damn', 'crap', 'stupid', 'idiot', 'bastard', 'whore', 'slut', 'dick', 'pussy', 'cock', 'cunt', 'motherfucker', 'retard', 'moron', 'dumb', 'hate', 'kill', 'die', 'ugly', 'garbage'];
const isVulgar = (text) => VULGAR_WORDS.some(word => text.toLowerCase().includes(word));

const isGibberish = (text) => {
  const lower = text.toLowerCase();
  if (lower.length < 2) return true;
  const greetings = ['hi', 'hey', 'hello', 'hiii', 'heyy', 'yo', 'sup', 'hola', 'hi me', 'hello me', 'hey there'];
  if (greetings.some(g => lower.includes(g))) return false;
  const letters = text.replace(/[^a-zA-Z]/g, '').length;
  if (letters < 2) return true;
  return false;
};

// --------------------------------------------------------------
// Helper: Price extraction (unchanged)
// --------------------------------------------------------------
const extractPrice = (text) => {
  const str = text.toLowerCase();
  let match = str.match(/(?:under|below|less than)\s*(\d+(?:\.\d+)?)\s*(lakh|crore)?/i);
  if (match) {
    let num = parseFloat(match[1]);
    if (match[2] === 'crore') return { max: num * 10000000 };
    return { max: num * 100000 };
  }
  match = str.match(/(\d+(?:\.\d+)?)\s*lakh/i);
  if (match) return { max: parseFloat(match[1]) * 100000 };
  let plain = str.match(/\b(\d{1,3}(?:,\d{3})*|\d{4,})\b/);
  if (plain) {
    let num = parseInt(plain[1].replace(/,/g, ''));
    if (num >= 1 && num <= 100) return { max: num * 100000 };
    if (num > 100) return { max: num };
  }
  return null;
};

const extractYear = (text) => {
  const years = text.match(/\b(19|20)\d{2}\b/g);
  if (!years) return null;
  if (years.length === 1) return parseInt(years[0]);
  if (years.length >= 2) return { min: parseInt(years[0]), max: parseInt(years[1]) };
  return null;
};

const extractMileage = (text) => {
  const match = text.match(/(?:under|below|less than)\s*(\d+(?:,\d+)?)\s*(?:km|kilometers?)/i);
  if (match) return { max: parseInt(match[1].replace(/,/g, '')) };
  const plain = text.match(/(\d+(?:,\d+)?)\s*(?:km|kilometers?)/i);
  if (plain) return { max: parseInt(plain[1].replace(/,/g, '')) };
  return null;
};

// --------------------------------------------------------------
// Expanded make and model lists (including multi-word models)
// --------------------------------------------------------------
const ALL_MAKES = ['toyota', 'honda', 'suzuki', 'kia', 'hyundai', 'audi', 'bmw', 'mercedes', 'ford'];
const ALL_MODELS = [
  'corolla', 'civic', 'swift', 'sportage', 'yaris', 'city', 'elantra', 'a4', 'c class', '3 series',
  'land cruiser', 'prado', 'fortuner', 'hilux', 'camry', 'accord', 'odyssey', 'fit', 'jazz', 'alto',
  'mehran', 'cultus', 'wagon r', 'crown', 'passo', 'vitz', 'premio', 'allion', 'axio', 'belta'
];

const extractMake = (text) => {
  const clean = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  const words = clean.split(/\s+/);
  for (let make of ALL_MAKES) {
    if (words.includes(make)) return make;
    if (clean.includes(make)) return make;
  }
  return null;
};

const extractModel = (text) => {
  const clean = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  // first try exact multi-word match
  for (let model of ALL_MODELS) {
    if (clean.includes(model)) return model;
  }
  // fallback: split words
  const words = clean.split(/\s+/);
  for (let model of ALL_MODELS) {
    if (words.includes(model)) return model;
  }
  return null;
};

const extractFuel = (text) => {
  const fuels = ['petrol', 'diesel', 'hybrid', 'electric', 'cng'];
  const lower = text.toLowerCase();
  for (let f of fuels) if (lower.includes(f)) return f;
  return null;
};
const extractTransmission = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes('automatic') || lower.includes('auto')) return 'automatic';
  if (lower.includes('manual')) return 'manual';
  return null;
};
const extractColor = (text) => {
  const colors = ['white', 'black', 'silver', 'red', 'blue', 'grey', 'gray', 'green'];
  const lower = text.toLowerCase();
  for (let c of colors) if (lower.includes(c)) return c;
  return null;
};
const extractLocation = (text) => {
  const cities = ['karachi', 'lahore', 'islamabad', 'rawalpindi', 'peshawar', 'quetta', 'multan'];
  const lower = text.toLowerCase();
  for (let city of cities) if (lower.includes(city)) return city;
  return null;
};

// --------------------------------------------------------------
// Intent detection (enhanced for car info questions)
// --------------------------------------------------------------
const detectIntent = (text) => {
  const lower = text.toLowerCase();
  if (lower.match(/mechanic|service|repair/)) return 'find.mechanic';
  if (lower.match(/bid|current bid|highest bid/)) return 'check.bid';
  if (lower.match(/part|accessory|spare/)) return 'search.parts';
  if (lower.match(/hello|hi|hey|good morning/)) return 'greeting';
  if (lower.match(/thank|thanks/)) return 'thanks';
  // Car info: range, mileage, fuel economy, tank capacity, how far
  if (lower.match(/range|fuel economy|mileage per|km per litre|tank capacity|how far|driving range/)) return 'ask.car.info';
  return 'search.cars';
};

// --------------------------------------------------------------
// Answer car info questions (generic but helpful)
// --------------------------------------------------------------
const answerCarInfo = (model, year) => {
  // Generic default values (can be improved with a database of specs)
  const defaultInfo = {
    'corolla': { tank: '50L', avgMileage: '12-15 km/l', range: '600-750 km' },
    'civic': { tank: '47L', avgMileage: '13-16 km/l', range: '610-750 km' },
    'swift': { tank: '42L', avgMileage: '14-17 km/l', range: '588-714 km' },
    'sportage': { tank: '62L', avgMileage: '10-12 km/l', range: '620-744 km' },
    'yaris': { tank: '42L', avgMileage: '13-15 km/l', range: '546-630 km' },
  };
  const info = defaultInfo[model?.toLowerCase()] || { tank: 'unknown', avgMileage: 'unknown', range: 'unknown' };
  return `For ${model ? model.toUpperCase() : 'this car'}${year ? ` (${year} model)` : ''}, fuel tank capacity is approximately ${info.tank}, average mileage is about ${info.avgMileage}, giving a driving range of roughly ${info.range} on a full tank. (These are typical values; actual range depends on driving conditions.)`;
};

// --------------------------------------------------------------
// Main endpoint
// --------------------------------------------------------------
export const chatMessage = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  console.log('\n📩 User message:', message);

  // Vulgar / gibberish
  if (isVulgar(message)) {
    return res.json({ reply: "⚠️ Please keep the conversation respectful. I'm here to help with car-related questions only.", cars: [], alternatives: [], mechanics: [], parts: [] });
  }
  if (isGibberish(message)) {
    return res.json({ reply: "I didn't understand that. Please ask something about cars, e.g., 'Show me Honda cars under 20 lakhs'.", cars: [], alternatives: [], mechanics: [], parts: [] });
  }

  // Detect intent (overriding NLP for simplicity)
  let intent = detectIntent(message);
  // Use NLP only if we got 'search.cars' (to catch more refined intents)
  if (intent === 'search.cars') {
    try {
      const result = await manager.process('en', message);
      if (result.intent && result.intent !== 'None' && result.intent !== 'search.cars') {
        intent = result.intent;
      }
    } catch (e) {}
  }
  console.log('🧠 Intent:', intent);

  // Extract entities
  const make = extractMake(message);
  const model = extractModel(message);
  const fuel = extractFuel(message);
  const transmission = extractTransmission(message);
  const color = extractColor(message);
  const location = extractLocation(message);
  const priceInfo = extractPrice(message);
  const yearInfo = extractYear(message);
  const mileageInfo = extractMileage(message);
  const hasFilters = make || model || fuel || transmission || color || location || priceInfo || yearInfo || mileageInfo;

  console.log('📌 Extracted:', { make, model, fuel, transmission, color, location, priceInfo, yearInfo, mileageInfo });

  // Special handling for 'ask.car.info' intent
  if (intent === 'ask.car.info') {
    const extractedModel = model || extractModel(message);
    const extractedYear = yearInfo && typeof yearInfo === 'number' ? yearInfo : null;
    const reply = answerCarInfo(extractedModel, extractedYear);
    return res.json({ reply, cars: [], alternatives: [], mechanics: [], parts: [] });
  }

  // For search.cars, if no filters, ask for details
  if (intent === 'search.cars' && !hasFilters) {
    return res.json({
      reply: "Please be more specific. Try saying something like:\n- 'Show me Honda cars under 30 lakhs'\n- 'Find a mechanic'\n- 'What's the bid on Corolla?'",
      cars: [], alternatives: [], mechanics: [], parts: []
    });
  }

  // Build MongoDB filter
  let filter = { auctionStatus: 'active' };
  if (make) filter.make = { $regex: make, $options: 'i' };
  if (model) filter.model = { $regex: model, $options: 'i' };
  if (fuel) filter.fuelType = { $regex: fuel, $options: 'i' };
  if (transmission) filter.transmission = { $regex: transmission, $options: 'i' };
  if (color) filter.color = { $regex: color, $options: 'i' };
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (priceInfo) {
    if (priceInfo.max) filter.price = { $lte: priceInfo.max };
    if (priceInfo.min) filter.price = { ...filter.price, $gte: priceInfo.min };
  }
  if (yearInfo) {
    if (typeof yearInfo === 'number') filter.year = yearInfo;
    else filter.year = { $gte: yearInfo.min, $lte: yearInfo.max };
  }
  if (mileageInfo?.max) filter.mileage = { $lte: mileageInfo.max };

  console.log('🔧 Filter:', JSON.stringify(filter, null, 2));

  let reply = '';
  let cars = [];
  let alternatives = [];
  let mechanics = [];
  let parts = [];

  switch (intent) {
    case 'greeting':
      reply = "Hello! I'm Carsphere AI. Ask me about cars, mechanics, spare parts, or current bids!";
      break;
    case 'thanks':
      reply = "You're welcome! Happy to help. 😊";
      break;
    case 'find.mechanic':
      mechanics = await User.find({ role: 'mechanic', isVerified: true }).limit(5).select('fullName workshopAddress rating');
      reply = mechanics.length ? `Here are ${mechanics.length} verified mechanics:` : 'No verified mechanics available.';
      break;
    case 'check.bid':
      const vehicle = await Vehicle.findOne(filter);
      if (vehicle) {
        reply = `💰 The current highest bid for ${vehicle.title} is ₨${vehicle.currentBid.toLocaleString()}. Buy it now: ₨${vehicle.price.toLocaleString()}.`;
      } else {
        reply = "I couldn't find an active auction for that car.";
      }
      break;
    case 'search.parts':
      const keyword = message.replace(/part|accessory|spare/i, '').trim();
      parts = await SparePart.find({ name: { $regex: keyword, $options: 'i' } }).limit(5);
      reply = parts.length ? `Found ${parts.length} part(s):` : 'No matching spare parts found.';
      break;
    default: // 'search.cars'
      cars = await Vehicle.find(filter).limit(5).select('title price images _id currentBid year mileage fuelType transmission color location');
      if (cars.length === 0) {
        let broadFilter = { auctionStatus: 'active' };
        if (make) broadFilter.make = { $regex: make, $options: 'i' };
        if (model) broadFilter.model = { $regex: model, $options: 'i' };
        if (priceInfo?.max) broadFilter.price = { $lte: priceInfo.max * 1.2 };
        alternatives = await Vehicle.find(broadFilter).limit(4);
        if (alternatives.length > 0) {
          reply = `No exact matches found. Here are similar cars:\n` +
                  alternatives.map(c => `• ${c.title} (${c.year}) - ₨${c.price.toLocaleString()} | ${c.mileage?.toLocaleString()} km`).join('\n');
        } else {
          reply = "No cars match your criteria. Try removing some filters or ask for a different make/model.";
        }
      } else {
        reply = `Found ${cars.length} car(s) matching your request:`;
      }
  }

  res.json({ reply, cars, alternatives, mechanics, parts, intent });
};