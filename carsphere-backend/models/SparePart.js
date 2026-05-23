import mongoose from 'mongoose';

const sparePartSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: 'https://via.placeholder.com/200?text=Part' },
  category: { type: String, enum: ['Engine', 'Brakes', 'Suspension', 'Electrical', 'Accessories'], required: true },
  stock: { type: Number, default: 0 },
  description: { type: String },
}, { timestamps: true });

const SparePart = mongoose.model('SparePart', sparePartSchema);
export default SparePart;