import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';

const CustomerCarePage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate sending email (replace with backend API later)
    setTimeout(() => {
      toast.success('Message sent! We will reply within 24 hours.');
      setForm({ name: '', email: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Customer Care</h1>
      <p className="text-center text-gray-600 mb-8">We're here to help. Reach out anytime.</p>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-3">📞 Call Us</h2>
          <p className="mb-1">+92 300 1234567</p>
          <p className="text-sm text-gray-500">Mon–Sat, 10am – 7pm</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">✉️ Email</h2>
          <p>support@carsphere.com</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">📍 Visit Us</h2>
          <p>123 Tech Valley, Gulberg III, Lahore, Pakistan</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Send a Message</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Your Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full p-2 border rounded mb-3" required />
            <input type="email" placeholder="Your Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full p-2 border rounded mb-3" required />
            <textarea rows="4" placeholder="Message" value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="w-full p-2 border rounded mb-3" required></textarea>
            <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:opacity-50">
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerCarePage;