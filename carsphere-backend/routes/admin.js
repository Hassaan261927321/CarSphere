import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import { getAdminStats, getPendingMechanics, verifyMechanic } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, allowRoles('admin'));

router.get('/stats', getAdminStats);
router.get('/pending-mechanics', getPendingMechanics);
router.put('/verify-mechanic/:id', verifyMechanic);

export default router;