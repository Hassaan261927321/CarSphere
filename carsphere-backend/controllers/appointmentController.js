import Appointment from '../models/Appointment.js';

// @desc   Create a new appointment
// @route  POST /api/appointments
// @access Private
export const createAppointment = async (req, res) => {
  try {
    const { vehicle, date, time, type, mechanic } = req.body;
    const appointment = await Appointment.create({
      vehicle,
      customer: req.user._id,
      mechanic: mechanic || null,
      date,
      time,
      type: type || 'test-drive',
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get logged-in user's appointments
// @route  GET /api/appointments
// @access Private
export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ customer: req.user._id })
      .populate('vehicle', 'title images')
      .populate('mechanic', 'fullName')
      .sort('-createdAt');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update appointment status (optional)
// @route  PUT /api/appointments/:id
// @access Private (customer or mechanic)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    // Only allow customer or assigned mechanic to update
    if (appointment.customer.toString() !== req.user._id.toString() && 
        (!appointment.mechanic || appointment.mechanic.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    appointment.status = status;
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  
};

// @desc    Get appointments assigned to the logged-in mechanic
// @route   GET /api/appointments/mechanic
// @access  Private (mechanic only)
export const getMechanicAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ mechanic: req.user._id })
      .populate('vehicle', 'title images')
      .populate('customer', 'fullName email')
      .sort('-createdAt');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark appointment as completed (mechanic only)
// @route   PUT /api/appointments/:id/complete
// @access  Private (mechanic only)
export const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.mechanic.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your appointment' });
    }
    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Appointment already completed' });
    }
    appointment.status = 'completed';
    await appointment.save();

    // Notify customer that appointment is complete (they can now review)
    const io = req.app.get('io');
    io.to(`user_${appointment.customer}`).emit('notification', {
      type: 'appointment_completed',
      message: `Your appointment with ${req.user.fullName} is completed. You can now leave a review.`,
    });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};