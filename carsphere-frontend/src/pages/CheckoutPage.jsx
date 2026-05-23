import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CheckoutPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await api.get('/cart');
        setCart(data);
      } catch (error) {
        console.error('Failed to load cart', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      alert('Please enter shipping address');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/orders', { address, paymentMethod });
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      alert(error.response?.data?.message || 'Order failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (cart.items.length === 0) {
    return <div className="text-center py-10">Your cart is empty. <button onClick={() => navigate('/spare-parts')} className="text-blue-600">Shop now</button></div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="font-semibold mb-2">Order Summary</h2>
        {cart.items.map(item => (
          <div key={item._id} className="flex justify-between py-1">
            <span>{item.part?.name} x{item.quantity}</span>
            <span>₨{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="border-t pt-2 mt-2 font-bold flex justify-between">
          <span>Total</span>
          <span>₨{totalAmount.toLocaleString()}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Shipping Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows="3"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Payment Method</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-2 border rounded">
            <option>Cash on Delivery</option>
            <option>JazzCash</option>
            <option>Bank Transfer</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;