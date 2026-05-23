import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSkeleton from '../components/common/LoadingSkeleton';


const SparePartsPage = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParts = async () => {
      const { data } = await api.get('/parts');
      setParts(data);
      setLoading(false);
    };
    fetchParts();
  }, []);

  const addToCart = async (partId, quantity = 1) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post('/cart', { partId, quantity });
      alert('Added to cart');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) return <LoadingSkeleton type="card" count={6} />;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Spare Parts</h1>
        <button
          onClick={() => navigate('/cart')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🛒 View Cart
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {parts.map(part => (
          <div key={part._id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <img src={part.image} alt={part.name} className="w-full h-40 object-cover mb-2 rounded" />
            <h3 className="text-lg font-semibold">{part.name}</h3>
            <p className="text-gray-600">₨{part.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Stock: {part.stock}</p>
            <button
              onClick={() => addToCart(part._id)}
              disabled={part.stock === 0}
              className={`mt-2 w-full py-2 rounded ${part.stock > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SparePartsPage;