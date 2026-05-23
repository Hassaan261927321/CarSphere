import express from 'express';
import { 
  createAppointment, 
  getUserAppointments, 
  updateAppointmentStatus,
  getMechanicAppointments,
  completeAppointment
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Customer routes
router.route('/')
  .post(protect, allowRoles('buyer'), createAppointment)
  .get(protect, getUserAppointments);

router.route('/:id')
  .put(protect, updateAppointmentStatus);

// Mechanic routes
router.get('/mechanic', protect, allowRoles('mechanic'), getMechanicAppointments);
router.put('/:id/complete', protect, allowRoles('mechanic'), completeAppointment);

export default router;