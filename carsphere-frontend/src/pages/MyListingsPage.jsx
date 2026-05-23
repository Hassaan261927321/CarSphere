import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

const MyListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data } = await api.get('/vehicles/my-listings');
      setListings(data);
    } catch (error) {
      console.error('Failed to load listings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await api.delete(`/vehicles/${id}`);
        fetchListings();
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Vehicle Listings</h1>
        <button
          onClick={() => navigate('/listings/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add New Listing
        </button>
      </div>
      {listings.length === 0 ? (
        <p className="text-gray-500">You have no listings. Click "Add New Listing" to start.</p>
      ) : (
        <div className="grid gap-4">
          {listings.map((vehicle, idx) => (
            <motion.div
              key={vehicle._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{vehicle.title}</h2>
                  <p className="text-gray-600">{vehicle.year} • {vehicle.mileage.toLocaleString()} km • {vehicle.location}</p>
                  <p className="text-blue-600 font-bold">Buy Now: ₨{vehicle.price.toLocaleString()}</p>
                  <p className="text-green-600">Current Bid: ₨{vehicle.currentBid.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Status: {vehicle.auctionStatus}</p>
                  {vehicle.auctionEndTime && (
                    <p className="text-sm text-gray-500">Ends: {new Date(vehicle.auctionEndTime).toLocaleString()}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/listings/edit/${vehicle._id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(vehicle._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/vehicle/${vehicle._id}`}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    View
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;