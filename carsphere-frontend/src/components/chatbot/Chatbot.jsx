import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      text: "Hi! I'm Carsphere AI. I can help you find cars by make, model, year, price, fuel, transmission, color, mileage, and location.\n\nTry asking:\n• 'Show me white automatic Honda Civic under 30 lakhs with less than 50000 km'\n• 'Find diesel SUVs in Lahore between 40 and 60 lakhs'\n• 'What's the bid on Toyota Corolla?'",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const { data } = await axios.post(`${API_BASE}/chat/message`, { message: text });

      const botReply = data.reply || "I'm not sure how to respond to that.";

      const botMsg = {
        id: Date.now(),
        text: botReply,
        sender: 'bot',
        timestamp: new Date(),
        cars: data.cars || [],
        alternatives: data.alternatives || [],
        mechanics: data.mechanics || [],
        parts: data.parts || [],
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: 'Sorry, I encountered an error. Please try again.',
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage(inputValue);
  };

  const quickReplies = [
    { text: 'Show me Honda cars under 30 lakhs', query: 'Show me Honda cars under 30 lakhs' },
    { text: 'Find a mechanic', query: 'Find a mechanic near me' },
    { text: "What's the bid on Corolla?", query: "What's the current bid on Toyota Corolla?" },
    { text: 'White automatic SUV', query: 'Show me white automatic SUVs under 50 lakhs' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute bottom-20 right-0 w-[90vw] sm:w-[28rem] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
            style={{ maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="font-semibold">Carsphere AI</h3>
              </div>
              <button onClick={toggleChat} className="text-white hover:text-gray-200 transition">
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm sm:text-base">{msg.text}</div>

                    {/* Cars results */}
                    {msg.cars && msg.cars.length > 0 && (
                      <div className="mt-3 space-y-2 border-t pt-2 border-gray-100">
                        {msg.cars.map((car) => (
                          <a
                            key={car._id}
                            href={`/vehicle/${car._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-blue-600 hover:underline"
                          >
                            🚗 {car.title} ({car.year}) – ₨{car.price?.toLocaleString()}
                            {car.mileage && ` | ${car.mileage.toLocaleString()} km`}
                            {car.fuelType && ` | ${car.fuelType}`}
                            {car.transmission && ` | ${car.transmission}`}
                            {car.location && ` | ${car.location}`}
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Alternative recommendations */}
                    {msg.alternatives && msg.alternatives.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-orange-200 pt-2">
                        <p className="text-xs text-orange-600 font-semibold">💡 Recommendations for you</p>
                        {msg.alternatives.map((car) => (
                          <a
                            key={car._id}
                            href={`/vehicle/${car._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-blue-600 hover:underline"
                          >
                            🚗 {car.title} ({car.year}) – ₨{car.price?.toLocaleString()}
                            {car.mileage && ` | ${car.mileage.toLocaleString()} km`}
                            {car.fuelType && ` | ${car.fuelType}`}
                            {car.transmission && ` | ${car.transmission}`}
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Mechanics results */}
                    {msg.mechanics && msg.mechanics.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-gray-100 pt-2">
                        {msg.mechanics.map((m) => (
                          <div key={m._id} className="text-sm text-gray-700">
                            🔧 {m.fullName} – {m.workshopAddress}
                            {m.rating && ` ⭐ ${m.rating.toFixed(1)}`}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Spare parts results */}
                    {msg.parts && msg.parts.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-gray-100 pt-2">
                        {msg.parts.map((p) => (
                          <div key={p._id} className="text-sm text-gray-700">
                            🔩 {p.name} – ₨{p.price?.toLocaleString()} (Stock: {p.stock})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {messages.length < 3 && (
              <div className="px-3 py-2 border-t border-gray-100 bg-gray-50 flex flex-wrap gap-2">
                {quickReplies.map((qr, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(qr.query)}
                    className="text-xs bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 transition"
                  >
                    {qr.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(inputValue);
              }}
              className="p-3 border-t border-gray-200 bg-white"
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about cars..."
                  className="flex-1 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl hover:shadow-md transition"
                >
                  Send
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;