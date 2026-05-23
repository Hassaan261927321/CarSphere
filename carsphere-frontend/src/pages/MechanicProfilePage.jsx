import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import StarRating from '../components/common/StarRating';
import MechanicReviews from '../components/mechanic/MechanicReviews';

const MechanicProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mechanic, setMechanic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMechanic = async () => {
      try {
        const { data } = await api.get(`/users/mechanic/${id}`);
        setMechanic(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Mechanic not found');
      } finally {
        setLoading(false);
      }
    };
    fetchMechanic();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading mechanic profile...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button onClick={() => navigate('/marketplace')} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          Back to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32"></div>
        <div className="px-6 pb-6">
          <div className="flex justify-between items-start -mt-12 mb-4">
            <div className="bg-white rounded-full p-2 shadow-md">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl">
                {mechanic.fullName?.charAt(0) || '👤'}
              </div>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              Verified Mechanic
            </span>
          </div>

          <h1 className="text-2xl font-bold">{mechanic.fullName}</h1>
          <div className="flex items-center gap-3 mt-2">
            <StarRating rating={mechanic.rating || 0} readonly size="md" />
            <span className="text-gray-600">({mechanic.rating?.toFixed(1) || 0})</span>
          </div>

          {/* Contact info */}
          <div className="mt-4 space-y-2 text-gray-600">
            <p>📍 {mechanic.workshopAddress || 'Address not provided'}</p>
            <p>📧 {mechanic.email}</p>
            <p>🔧 Skills: {mechanic.skills?.join(', ') || 'Not specified'}</p>
            {mechanic.cnid && <p className="text-sm text-gray-400">CNIC: •••••••••{mechanic.cnid.slice(-5)}</p>}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
        <MechanicReviews mechanicId={mechanic._id} />
      </div>

      {/* Book Appointment Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate(`/book-appointment?mechanic=${mechanic._id}`)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Book Service Appointment
        </button>
      </div>
    </div>
  );
};

export default MechanicProfilePage;