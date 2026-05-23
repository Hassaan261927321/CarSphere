import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import api from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredCars, setFeaturedCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/vehicles?limit=4');
        setFeaturedCars(data.slice(0, 4));
      } catch (error) {
        console.error(error);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
  };

  const categories = [
    { name: 'Sedan', icon: '🚗', color: 'bg-blue-100' },
    { name: 'SUV', icon: '🚙', color: 'bg-green-100' },
    { name: 'Hatchback', icon: '🚘', color: 'bg-yellow-100' },
    { name: 'Luxury', icon: '🏎️', color: 'bg-purple-100' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20 rounded-2xl mb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Perfect Car</h1>
          <p className="text-lg md:text-xl mb-8">Thousands of cars, transparent auctions, and AI‑powered assistance.</p>
          <a href="/marketplace" className="inline-block bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">Explore Cars →</a>
        </div>
      </motion.section>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input type="text" placeholder="Search by make, model, city..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 p-3 border rounded-lg" />
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg">Search</button>
        </form>
      </div>

      {/* Featured Cars */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Cars</h2>
          <a href="/marketplace" className="text-blue-600 hover:underline">View All →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCars.map((car, i) => (
            <motion.div key={car._id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card {...car} onClick={() => navigate(`/vehicle/${car._id}`)} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-100 py-12 rounded-2xl mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div><p className="text-3xl font-bold text-blue-600">500+</p><p className="text-gray-600">Cars Listed</p></div>
          <div><p className="text-3xl font-bold text-blue-600">250+</p><p className="text-gray-600">Spare Parts</p></div>
          <div><p className="text-3xl font-bold text-blue-600">50+</p><p className="text-gray-600">Verified Mechanics</p></div>
          <div><p className="text-3xl font-bold text-blue-600">24/7</p><p className="text-gray-600">AI Support</p></div>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05 }} className={`${cat.color} rounded-lg p-6 text-center cursor-pointer`} onClick={() => navigate(`/marketplace?category=${cat.name.toLowerCase()}`)}>
              <div className="text-4xl mb-2">{cat.icon}</div>
              <h3 className="font-semibold text-lg">{cat.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-12 rounded-2xl shadow-sm mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-gray-50 p-4 rounded-lg"><p className="italic">"Sold my car within 3 days through auction! Very transparent process."</p><p className="font-semibold mt-2">— Ali R.</p></div>
          <div className="bg-gray-50 p-4 rounded-lg"><p className="italic">"Found a certified mechanic easily. The review system is trustworthy."</p><p className="font-semibold mt-2">— Sara K.</p></div>
        </div>
      </section>

      {/* CTA */}
      <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800 text-white py-16 rounded-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Sell Your Car?</h2>
        <p className="text-lg mb-8">List your vehicle and reach thousands of buyers.</p>
        <Link to="/dashboard" className="inline-block bg-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">Start Selling</Link>
      </motion.section>
    </div>
  );
};

export default HomePage;