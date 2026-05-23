import { useState, useEffect } from 'react';
import api from '../../services/api';
import StarRating from '../common/StarRating';

const MechanicReviews = ({ mechanicId }) => {
  const [reviews, setReviews] = useState([]);
  const [avgData, setAvgData] = useState({ avg: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsRes, avgRes] = await Promise.all([
          api.get(`/reviews/mechanic/${mechanicId}`),
          api.get(`/reviews/mechanic/${mechanicId}/avg`),
        ]);
        setReviews(reviewsRes.data);
        setAvgData(avgRes.data);
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mechanicId]);

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-3 mb-4">
        <StarRating rating={avgData.avg} readonly size="lg" />
        <span className="text-2xl font-bold">{avgData.avg.toFixed(1)}</span>
        <span className="text-gray-500">({avgData.count} reviews)</span>
      </div>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border-b pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} readonly size="sm" />
                  <span className="font-medium">{review.customer?.fullName}</span>
                </div>
                <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              {review.comment && <p className="text-gray-700 mt-1">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MechanicReviews;