// import Bid from '../models/Bid.js';
// import Vehicle from '../models/Vehicle.js';

// export const placeBid = async (req, res) => {
//   const { amount } = req.body;
//   const vehicle = await Vehicle.findById(req.params.id);
//   if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
//   if (amount <= vehicle.currentBid) return res.status(400).json({ message: 'Bid must be higher than current bid' });
//   if (amount > vehicle.price) return res.status(400).json({ message: 'Bid cannot exceed buy price' });
//   const bid = await Bid.create({ vehicle: vehicle._id, bidder: req.user._id, amount });
//   vehicle.currentBid = amount;
//   await vehicle.save();
//   res.status(201).json(bid);
// };

// export const getBidsForVehicle = async (req, res) => {
//   const bids = await Bid.find({ vehicle: req.params.id }).populate('bidder', 'fullName email').sort('-amount');
//   res.json(bids);
// };
// // @desc   Get bids placed by logged-in user
// // @route  GET /api/bids/my-bids
// // @access Private
// export const getMyBids = async (req, res) => {
//   const bids = await Bid.find({ bidder: req.user._id })
//     .populate('vehicle', 'title images price')
//     .sort('-createdAt');
//   res.json(bids);
// };


import Bid from '../models/Bid.js';
import Vehicle from '../models/Vehicle.js';
import { getIO } from '../socket.js';
import Notification from '../models/Notification.js';

// @desc    Place a bid on a vehicle
// @route   POST /api/bids/:id
// @access  Private
export const placeBid = async (req, res) => {
  const { amount } = req.body;
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

  // Validation
  if (amount <= vehicle.currentBid) {
    return res.status(400).json({ message: `Bid must be higher than ₨${vehicle.currentBid.toLocaleString()}` });
  }
  if (amount > vehicle.price) {
    return res.status(400).json({ message: 'Bid cannot exceed buy-it-now price' });
  }

  // Get previous highest bidder
  const previousHighestBid = vehicle.currentBid;
  const previousHighestBidder = await Bid.findOne({ vehicle: vehicle._id })
    .sort('-amount')
    .populate('bidder', '_id fullName');

  // Create new bid and update vehicle
  const bid = await Bid.create({
    vehicle: vehicle._id,
    bidder: req.user._id,
    amount,
  });
  vehicle.currentBid = amount;
  await vehicle.save();

  const io = getIO();

  // 1. Notify seller (if seller is not the bidder)
  if (vehicle.seller.toString() !== req.user._id.toString()) {
    const sellerMessage = `New bid of ₨${amount.toLocaleString()} on your "${vehicle.title}"`;
    io.to(`user_${vehicle.seller}`).emit('notification', {
      type: 'new_bid_on_listing',
      message: sellerMessage,
      data: { vehicleId: vehicle._id, bidAmount: amount, bidderName: req.user.fullName },
      createdAt: new Date(),
    });
    await Notification.create({
      user: vehicle.seller,
      message: sellerMessage,
      type: 'info',
      relatedVehicle: vehicle._id,
    });
  }

  // 2. Notify previous highest bidder (outbid)
  if (previousHighestBidder && previousHighestBidder.bidder._id.toString() !== req.user._id.toString()) {
    const outbidMessage = `You were outbid on "${vehicle.title}"! New bid: ₨${amount.toLocaleString()}`;
    io.to(`user_${previousHighestBidder.bidder._id}`).emit('notification', {
      type: 'outbid',
      message: outbidMessage,
      data: { vehicleId: vehicle._id, newBid: amount, previousBid: previousHighestBid },
      createdAt: new Date(),
    });
    await Notification.create({
      user: previousHighestBidder.bidder._id,
      message: outbidMessage,
      type: 'outbid',
      relatedVehicle: vehicle._id,
    });
  }

  // 3. Broadcast bid update to all viewers of this auction (optional)
  io.to(`auction_${vehicle._id}`).emit('bid_update', {
    currentBid: amount,
    lastBidder: req.user.fullName,
  });

  res.status(201).json(bid);
};

// @desc    Get all bids for a specific vehicle
// @route   GET /api/bids/vehicle/:id
// @access  Public
export const getBidsForVehicle = async (req, res) => {
  const bids = await Bid.find({ vehicle: req.params.id })
    .populate('bidder', 'fullName email')
    .sort('-amount');
  res.json(bids);
};

// @desc    Get bids placed by logged-in user
// @route   GET /api/bids/my-bids
// @access  Private
export const getMyBids = async (req, res) => {
  const bids = await Bid.find({ bidder: req.user._id })
    .populate('vehicle', 'title images price currentBid auctionEndTime')
    .sort('-createdAt');
  res.json(bids);
};

// @desc    Get active bids for logged-in user (where auction still active)
// @route   GET /api/bids/my-active-bids
// @access  Private
export const getMyActiveBids = async (req, res) => {
  const now = new Date();
  const bids = await Bid.find({ bidder: req.user._id })
    .populate({
      path: 'vehicle',
      match: { auctionStatus: 'active', auctionEndTime: { $gt: now } },
      select: 'title images price currentBid auctionEndTime'
    })
    .sort('-createdAt');
  // Filter out bids where vehicle is null (auction ended)
  const activeBids = bids.filter(bid => bid.vehicle !== null);
  res.json(activeBids);
};

// @desc    Get auctions won by logged-in user
// @route   GET /api/bids/my-won
// @access  Private
export const getMyWonAuctions = async (req, res) => {
  const now = new Date();
  // Find closed auctions where this user placed the highest bid
  const vehicles = await Vehicle.find({
    auctionStatus: 'closed',
    auctionEndTime: { $lt: now }
  }).populate('seller', 'fullName email');

  const won = [];
  for (const vehicle of vehicles) {
    const highestBid = await Bid.findOne({ vehicle: vehicle._id })
      .sort('-amount')
      .populate('bidder');
    if (highestBid && highestBid.bidder._id.toString() === req.user._id.toString()) {
      won.push({
        vehicle,
        bidAmount: highestBid.amount,
        bidId: highestBid._id,
      });
    }
  }
  res.json(won);
};