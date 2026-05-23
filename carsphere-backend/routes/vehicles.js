import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getVehicles, getVehicleById, createVehicle, getSellerVehicles, updateVehicle, deleteVehicle } from '../controllers/vehicleController.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// 1. Public routes
router.get('/', getVehicles);

// 2. Static routes (must come before /:id)
router.get('/my-listings', protect, allowRoles('seller'), getSellerVehicles);

// 3. Dynamic routes
router.get('/:id', getVehicleById);
router.post('/', protect, allowRoles('seller'), createVehicle);
router.put('/:id', protect, allowRoles('seller'), updateVehicle);
router.delete('/:id', protect, allowRoles('seller'), deleteVehicle);

export default router;