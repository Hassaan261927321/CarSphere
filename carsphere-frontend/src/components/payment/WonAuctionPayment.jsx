import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const WonAuctionPayment = ({ vehicle }) => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (vehicle && user) {
      checkPaymentStatus();
    }
  }, [vehicle, user]);

  const checkPaymentStatus = async () => {
    try {
      const { data } = await api.get(`/payment/status/${vehicle._id}`);
      setPaymentStatus(data.status);
    } catch (error) {
      console.error('Payment status check failed', error);
    }
  };

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/payment/initiate', { vehicleId: vehicle._id });
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl; // redirect to JazzCash
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  if (paymentStatus === 'paid') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-700 font-semibold">✅ Payment completed on {new Date().toLocaleDateString()}</p>
        <p className="text-sm text-gray-600 mt-1">Seller has been notified. You can now contact the seller.</p>
      </div>
    );
  }

  if (paymentStatus === 'pending') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-700">Payment pending. Click below to complete payment.</p>
        <button
          onClick={handlePayNow}
          disabled={loading}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Redirecting...' : 'Pay Now via JazzCash'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border rounded-lg p-4">
      <p className="font-semibold">You won this auction for ₨{vehicle.currentBid.toLocaleString()}!</p>
      <button
        onClick={handlePayNow}
        disabled={loading}
        className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Processing...' : 'Pay Now via JazzCash'}
      </button>
    </div>
  );
};

export default WonAuctionPayment;