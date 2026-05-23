import express from 'express';
import { chatMessage } from '../controllers/chatController.js';

const router = express.Router();

router.post('/message', chatMessage);

export default router;