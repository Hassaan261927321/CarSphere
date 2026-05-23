import mongoose from 'mongoose';

const cartItemSchema = mongoose.Schema({
  part: { type: mongoose.Schema.Types.ObjectId, ref: 'SparePart', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, // price at time of adding
});

const cartSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now },
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;