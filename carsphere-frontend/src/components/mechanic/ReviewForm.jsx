import { useState, useEffect } from 'react';
import api from '../../services/api';
import StarRating from '../common/StarRating';

const ReviewForm = ({ appointmentId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [canReview, setCanReview] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const { data } = await api.get(`/reviews/can-review/${appointmentId}`);
        if (data.canReview) {
          setCanReview(true);
        } else {
          setReason(data.reason);
          if (data.review) setExistingReview(data.review);
        }
      } catch (error) {
        console.error('Error checking review eligibility:', error);
      }
    };
    checkEligibility();
  }, [appointmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    setLoading(true);
    try {
      await api.post('/reviews', { appointmentId, rating, comment });
      setSubmitted(true);
      onReviewSubmitted && onReviewSubmitted();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded p-3 text-green-700">
        ✅ Thank you for your review!
      </div>
    );
  }

  if (existingReview) {
    return (
      <div className="bg-gray-50 border rounded p-3">
        <p className="font-semibold">Your review:</p>
        <div className="flex items-center gap-2 mt-1">
          <StarRating rating={existingReview.rating} readonly size="sm" />
          <span className="text-gray-600">{existingReview.comment}</span>
        </div>
      </div>
    );
  }

  if (!canReview) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-yellow-700">
        {reason === 'Appointment not completed yet' && '🔧 You can review after the appointment is marked as completed.'}
        {reason === 'Already reviewed' && '⭐ You have already reviewed this appointment.'}
        {reason === 'Not your appointment' && '⚠️ You cannot review this appointment.'}
        {!reason && 'Review not available at this time.'}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-4 shadow-sm">
      <h4 className="font-semibold mb-3">Rate your experience</h4>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Rating</label>
        <StarRating rating={rating} onRate={setRating} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Comment (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="3"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Share your experience with this mechanic..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;