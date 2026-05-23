import mongoose from 'mongoose';

const orderItemSchema = mongoose.Schema({
  part: { type: mongoose.Schema.Types.ObjectId, ref: 'SparePart', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  address: { type: String, required: true },
  paymentMethod: { type: String, default: 'Cash on Delivery' }, // or 'JazzCash', 'Stripe'
  orderDate: { type: Date, default: Date.now },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;