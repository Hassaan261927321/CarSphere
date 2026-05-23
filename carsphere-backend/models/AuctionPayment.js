// import mongoose from 'mongoose';

// const auctionPaymentSchema = mongoose.Schema({
//   vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
//   buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   amount: { type: Number, required: true },
//   status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
//   jazzCashOrderId: { type: String },
//   paymentDate: Date,
// }, { timestamps: true });

// const AuctionPayment = mongoose.model('AuctionPayment', auctionPaymentSchema);
// export default AuctionPayment;

import mongoose from 'mongoose';

const auctionPaymentSchema = mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  jazzCashOrderId: { type: String },
  paymentDate: Date,
}, { timestamps: true });

const AuctionPayment = mongoose.model('AuctionPayment', auctionPaymentSchema);
export default AuctionPayment;