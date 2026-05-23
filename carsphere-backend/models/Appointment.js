// import mongoose from 'mongoose';

// const appointmentSchema = mongoose.Schema({
//   vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
//   customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // if mechanic
//   date: { type: Date, required: true },
//   time: { type: String, required: true },
//   status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
//   type: { type: String, enum: ['test-drive', 'service'], default: 'test-drive' },
// }, { timestamps: true });

// const Appointment = mongoose.model('Appointment', appointmentSchema);
// export default Appointment;

import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  type: { type: String, enum: ['test-drive', 'service'], default: 'test-drive' },
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;