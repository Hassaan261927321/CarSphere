// import express from 'express';
// import { placeBid, getBidsForVehicle, getMyBids } from '../controllers/bidController.js';
// import { protect } from '../middleware/authMiddleware.js';
// const router = express.Router();

// router.post('/:id', protect, placeBid);
// router.get('/vehicle/:id', getBidsForVehicle);
// router.get('/my-bids', protect, getMyBids);
// export default router;

import express from 'express';
import { placeBid, getBidsForVehicle, getMyBids, getMyActiveBids, getMyWonAuctions } from '../controllers/bidController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:id', protect, placeBid);
router.get('/vehicle/:id', getBidsForVehicle);
router.get('/my-bids', protect, getMyBids);
router.get('/my-active-bids', protect, getMyActiveBids);  // for dashboard
router.get('/my-won', protect, getMyWonAuctions);         // for dashboard

export default router;