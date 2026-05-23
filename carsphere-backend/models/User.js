import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['buyer', 'seller', 'mechanic', 'admin'], 
    default: 'buyer' 
  },
  profileImage: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  
  // Mechanic specific fields
  cnid: { type: String }, // Computerized National ID Card
  workshopAddress: { type: String },
  skills: [String],
  rating: { type: Number, default: 0 },
  
  // Additional fields for mechanics (optional)
  experience: { type: Number, default: 0 }, // years
  phone: { type: String },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;