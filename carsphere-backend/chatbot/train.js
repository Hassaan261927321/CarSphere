import { NlpManager } from 'node-nlp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const manager = new NlpManager({ languages: ['en'], forceNER: true });

// Load training data
const trainingData = JSON.parse(fs.readFileSync(path.join(__dirname, 'training-data.json'), 'utf8'));

// Add intents and examples
for (const intent of trainingData.intents) {
  for (const example of intent.examples) {
    manager.addDocument('en', example, intent.intent);
  }
}

// Add entities
for (const entity of trainingData.entities) {
  for (const example of entity.examples) {
    manager.addNamedEntityText(entity.entity, example, ['en'], [example.toLowerCase()]);
  }
}

// Add answers (fallback if needed)
manager.addAnswer('en', 'search.cars', 'Here are the cars matching your request.');
manager.addAnswer('en', 'find.mechanic', 'Here are verified mechanics near you.');
manager.addAnswer('en', 'check.bid', 'Here is the bid information.');
manager.addAnswer('en', 'search.parts', 'Here are matching spare parts.');
manager.addAnswer('en', 'greeting', 'Hello! I\'m Carsphere AI. How can I help you today?');
manager.addAnswer('en', 'thanks', 'You\'re welcome! Happy to help. 😊');
manager.addAnswer('en', 'none', "I'm not sure I understand. Try asking about cars, mechanics, spare parts, or current bids.");

// Train and save
(async () => {
  console.log('Training chatbot...');
  await manager.train();
  manager.save(path.join(__dirname, 'model.nlp'));
  console.log('Model saved to chatbot/model.nlp');
})();