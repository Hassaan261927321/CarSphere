// import mongoose from 'mongoose';

// const notificationSchema = mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   message: { type: String, required: true },
//   type: { type: String, enum: ['outbid', 'won', 'info'], default: 'info' },
//   read: { type: Boolean, default: false },
//   relatedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
// }, { timestamps: true });

// const Notification = mongoose.model('Notification', notificationSchema);
// export default Notification;

import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['outbid', 'won', 'info'], default: 'info' },
  read: { type: Boolean, default: false },
  relatedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;