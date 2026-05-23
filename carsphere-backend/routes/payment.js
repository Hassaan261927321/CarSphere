import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { initiatePayment, paymentCallback, getPaymentStatus } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/initiate', protect, initiatePayment);
router.get('/callback', paymentCallback);
router.get('/status/:vehicleId', protect, getPaymentStatus);

export default router;