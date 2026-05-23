import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Appointment from '../models/Appointment.js';
import Review from '../models/Review.js';

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();
    const activeAuctions = await Vehicle.countDocuments({ auctionStatus: 'active' });
    const totalAppointments = await Appointment.countDocuments();
    const pendingMechanics = await User.countDocuments({ role: 'mechanic', isVerified: false });
    const totalReviews = await Review.countDocuments();

    res.json({
      totalUsers,
      totalVehicles,
      activeAuctions,
      totalAppointments,
      pendingMechanics,
      totalReviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingMechanics = async (req, res) => {
  try {
    const mechanics = await User.find({ role: 'mechanic', isVerified: false }).select('-password');
    res.json(mechanics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyMechanic = async (req, res) => {
  try {
    const mechanic = await User.findById(req.params.id);
    if (!mechanic || mechanic.role !== 'mechanic') {
      return res.status(404).json({ message: 'Mechanic not found' });
    }
    mechanic.isVerified = true;
    await mechanic.save();
    res.json({ message: 'Mechanic verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};