import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';   

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "How does car auction bidding work?",
      a: "Auctions are live and time-limited. You can place a bid higher than the current bid. The highest bid when the timer ends wins. You'll receive a notification if you win or get outbid.",
    },
    {
      q: "Is there a fee to list a car?",
      a: "Listing your car is free. Carsphere only charges a small success fee when the car sells (5% of final price, capped at PKR 25,000).",
    },
    {
      q: "How do I pay for a won auction?",
      a: "After winning, go to your Dashboard → 'Auctions Won' and click 'Pay Now'. You can pay via JazzCash, bank transfer, or cash on delivery (if arranged with seller).",
    },
    {
      q: "Are the mechanics verified?",
      a: "Yes, every mechanic undergoes CNIC, workshop license, and identity verification by our admin team before appearing on the platform. Ratings and reviews come from real customers.",
    },
    {
      q: "Can I return a spare part?",
      a: "Spare parts can be returned within 7 days if unused and in original packaging. Contact customer care for a return request.",
    },
    {
      q: "How long does auction last?",
      a: "Sellers can set auction duration from 1 to 14 days. Most auctions run for 3‑7 days. You can see the remaining time on each listing.",
    },
    {
      q: "Do I need an account to bid?",
      a: "Yes, you must register and verify your email before placing a bid. This ensures a secure environment for all users.",
    },
    {
      q: "How do I contact the seller?",
      a: "After winning an auction or booking a test drive, you'll receive the seller's contact information via email and dashboard notifications.",
    },
    {
      q: "What if my bid wins and I change my mind?",
      a: "Winning a bid is a binding agreement. Please only bid if you intend to buy. Repeated cancellations may lead to account suspension.",
    },
    {
      q: "Can I sell spare parts as a shop?",
      a: "Yes, business accounts are available. Contact us at partners@carsphere.com to become a verified spare parts vendor.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto py-10 px-4"
    >
      <h1 className="text-4xl font-bold mb-4 text-center">Frequently Asked Questions</h1>
      <p className="text-center text-gray-600 mb-8">
        Find quick answers to common questions about Carsphere.
      </p>
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm"
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full text-left px-5 py-4 font-semibold text-gray-800 hover:bg-gray-50 transition flex justify-between items-center"
            >
              <span>{faq.q}</span>
              <span className="text-xl text-blue-600">{openIndex === idx ? '−' : '+'}</span>
            </button>
            {openIndex === idx && (
              <div className="px-5 pb-4 pt-0 text-gray-600 border-t border-gray-100">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-10 text-center bg-blue-50 p-6 rounded-xl">
        <p className="text-gray-700">Still have questions?</p>
        <Link
          to="/customer-care"
          className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Contact Support
        </Link>
      </div>
    </motion.div>
  );
};

export default FaqPage;