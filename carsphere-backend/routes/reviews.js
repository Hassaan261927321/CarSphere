import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createReview,
  getMechanicReviews,
  getMechanicAvgRating,
  canReview,
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/mechanic/:mechanicId', getMechanicReviews);
router.get('/mechanic/:mechanicId/avg', getMechanicAvgRating);
router.get('/can-review/:appointmentId', protect, canReview);

export default router;