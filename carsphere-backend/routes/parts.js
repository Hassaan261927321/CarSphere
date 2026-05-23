import express from 'express';
import { getParts, getPartById, createPart, updatePart, deletePart } from '../controllers/partController.js';
import { protect } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getParts)
  .post(protect, allowRoles('admin'), createPart);

router.route('/:id')
  .get(getPartById)
  .put(protect, allowRoles('admin'), updatePart)
  .delete(protect, allowRoles('admin'), deletePart);

export default router;