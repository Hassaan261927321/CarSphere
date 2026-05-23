import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Carsphere</h3>
            <p className="text-sm">Pakistan's most trusted automotive platform. Buy, sell, and service with confidence.</p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-white transition">📘</a>
              <a href="#" className="hover:text-white transition">🐦</a>
              <a href="#" className="hover:text-white transition">📸</a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/marketplace" className="hover:text-white transition">Marketplace</Link></li>
              <li><Link to="/spare-parts" className="hover:text-white transition">Spare Parts</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              <li><Link to="/appointments" className="hover:text-white transition">Appointments</Link></li>
            </ul>
          </div>
          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link to="/customer-care" className="hover:text-white transition">Customer Care</Link></li>
              <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📍 Lahore, Pakistan</li>
              <li>📞 +92 300 1234567</li>
              <li>✉️ support@carsphere.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Carsphere – Drive the Future. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;