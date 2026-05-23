import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const CartPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

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

  const updateQuantity = async (itemId, quantity) => {
    try {
      await api.put(`/cart/${itemId}`, { quantity });
      toast.success('Item added to cart');
      fetchCart();
    } catch (error) {
      toast.error('Failed to update cart');

    }
  };

  const removeItem = async (itemId) => {
    if (window.confirm('Remove item?')) {
      await api.delete(`/cart/${itemId}`);
      fetchCart();
    }
  };

  const totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) return <div className="text-center py-10">Loading cart...</div>;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cart.items.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500">Your cart is empty.</p>
          <button onClick={() => navigate('/spare-parts')} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Continue Shopping</button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.items.map(item => (
              <div key={item._id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center">
                <div className="flex-1">
                  <h3 className="font-semibold">{item.part?.name}</h3>
                  <p className="text-gray-600">₨{item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="px-2 py-1 border rounded"
                  >-</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-2 py-1 border rounded"
                  >+</button>
                  <button onClick={() => removeItem(item._id)} className="text-red-600 ml-2">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t pt-4 text-right">
            <p className="text-xl font-semibold">Total: ₨{totalAmount.toLocaleString()}</p>
            <button
              onClick={() => navigate('/checkout')}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;