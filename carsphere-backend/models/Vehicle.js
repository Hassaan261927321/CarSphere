import mongoose from 'mongoose';

const vehicleSchema = mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  currentBid: { type: Number, default: 0 },
  mileage: { type: Number, required: true },
  location: { type: String, required: true },
  transmission: { type: String, default: 'Automatic' },
  fuelType: { type: String, default: 'Petrol' },
  engine: String,
  color: String,
  description: String,
  images: [String],
  auctionStatus: { type: String, enum: ['active', 'closed', 'pending'], default: 'active' },
  auctionEndTime: { type: Date },
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;