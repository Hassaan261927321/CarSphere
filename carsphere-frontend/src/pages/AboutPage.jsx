import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">About Carsphere</h1>
      <div className="prose prose-lg mx-auto">
        <p className="text-gray-700 leading-relaxed">
          Carsphere is Pakistan's first all-in-one automotive platform, launched in 2025 by a team of passionate engineers and car enthusiasts. We aim to revolutionize how Pakistanis buy, sell, and service vehicles by bringing transparency, trust, and technology together.
        </p>
        <h2 className="text-2xl font-semibold mt-6">Our Mission</h2>
        <p>To empower every Pakistani to find their perfect ride with confidence, fair pricing, and zero hidden surprises.</p>
        <h2 className="text-2xl font-semibold mt-6">What We Offer</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>🚗 <strong>Live Auctions</strong> – Real‑time bidding with countdown timer</li>
          <li>🛠️ <strong>Spare Parts Store</strong> – Genuine parts at competitive prices</li>
          <li>🔧 <strong>Verified Mechanics</strong> – Rated and reviewed service providers</li>
          <li>🤖 <strong>AI Chatbot</strong> – Instant answers about any car</li>
          <li>📅 <strong>Appointment Booking</strong> – Test drives & service scheduling</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-6">Our Address</h2>
        <p>Carsphere HQ<br />123 Tech Valley, Gulberg III, Lahore, Pakistan</p>
      </div>
    </motion.div>
  );
};

export default AboutPage;