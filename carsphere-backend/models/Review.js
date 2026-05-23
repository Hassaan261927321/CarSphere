import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
  mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true, unique: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 500 },
}, { timestamps: true });

// Prevent duplicate reviews for same appointment
reviewSchema.index({ appointment: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;