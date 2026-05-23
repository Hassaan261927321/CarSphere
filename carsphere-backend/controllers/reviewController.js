import Review from '../models/Review.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { getIO } from '../socket.js';

// @desc    Create a review for a mechanic (only after completed appointment)
// @route   POST /api/reviews
// @access  Private (customer who booked the appointment)
export const createReview = async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;
    const appointment = await Appointment.findById(appointmentId).populate('mechanic customer');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    // Only the customer who booked can review
    if (appointment.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this appointment' });
    }
    // Only allow review if appointment status is 'completed'
    if (appointment.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review completed appointments' });
    }
    // Check if already reviewed
    const existing = await Review.findOne({ appointment: appointmentId });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this appointment' });
    }
    // Create review
    const review = await Review.create({
      mechanic: appointment.mechanic._id,
      customer: req.user._id,
      appointment: appointmentId,
      rating,
      comment,
    });

    // Update mechanic's average rating
    const allReviews = await Review.find({ mechanic: appointment.mechanic._id });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    await User.findByIdAndUpdate(appointment.mechanic._id, { rating: avgRating });

    // Notify mechanic
    const io = getIO();
    io.to(`user_${appointment.mechanic._id}`).emit('notification', {
      type: 'new_review',
      message: `⭐ ${req.user.fullName} rated you ${rating}/5: "${comment || 'No comment'}"`,
    });
    await Notification.create({
      user: appointment.mechanic._id,
      message: `You received a ${rating}-star review from ${req.user.fullName}.`,
      type: 'info',
    });

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Review already exists for this appointment' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for a mechanic
// @route   GET /api/reviews/mechanic/:mechanicId
// @access  Public
export const getMechanicReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ mechanic: req.params.mechanicId })
      .populate('customer', 'fullName')
      .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get average rating for a mechanic
// @route   GET /api/reviews/mechanic/:mechanicId/avg
// @access  Public
export const getMechanicAvgRating = async (req, res) => {
  try {
    const result = await Review.aggregate([
      { $match: { mechanic: req.params.mechanicId } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    res.json({ avg: result[0]?.avg || 0, count: result[0]?.count || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if user can review a specific appointment
// @route   GET /api/reviews/can-review/:appointmentId
// @access  Private
export const canReview = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) return res.json({ canReview: false, reason: 'Appointment not found' });
    if (appointment.customer.toString() !== req.user._id.toString()) {
      return res.json({ canReview: false, reason: 'Not your appointment' });
    }
    if (appointment.status !== 'completed') {
      return res.json({ canReview: false, reason: 'Appointment not completed yet' });
    }
    const existing = await Review.findOne({ appointment: req.params.appointmentId });
    if (existing) {
      return res.json({ canReview: false, reason: 'Already reviewed', review: existing });
    }
    res.json({ canReview: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};