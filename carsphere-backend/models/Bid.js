import mongoose from 'mongoose';

const bidSchema = mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
}, { timestamps: true });

const Bid = mongoose.model('Bid', bidSchema);
export default Bid;