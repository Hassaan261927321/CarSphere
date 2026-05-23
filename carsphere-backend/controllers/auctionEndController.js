// // import Vehicle from '../models/Vehicle.js';
// // import Bid from '../models/Bid.js';
// // import Notification from '../models/Notification.js';
// // import { getIO } from '../socket.js';

// // export const closeExpiredAuctions = async () => {
// //   const now = new Date();
// //   const expiredAuctions = await Vehicle.find({
// //     auctionStatus: 'active',
// //     auctionEndTime: { $lte: now },
// //   }).populate('seller');

// //   for (const vehicle of expiredAuctions) {
// //     const highestBid = await Bid.findOne({ vehicle: vehicle._id })
// //       .sort('-amount')
// //       .populate('bidder');

// //     vehicle.auctionStatus = 'closed';
// //     await vehicle.save();

// //     const io = getIO();

// //     if (highestBid) {
// //       // Notify winner
// //       const winMessage = `Congratulations! You won the auction for "${vehicle.title}" with a bid of ₨${highestBid.amount.toLocaleString()}. Contact seller: ${vehicle.seller.email}`;
// //       io.to(`user_${highestBid.bidder._id}`).emit('notification', {
// //         type: 'auction_won',
// //         message: winMessage,
// //         data: { vehicleId: vehicle._id, winningBid: highestBid.amount, sellerEmail: vehicle.seller.email },
// //       });
// //       await Notification.create({
// //         user: highestBid.bidder._id,
// //         message: winMessage,
// //         type: 'won',
// //         relatedVehicle: vehicle._id,
// //       });

// //       // Notify seller
// //       const sellerMessage = `Auction for "${vehicle.title}" ended. Winner: ${highestBid.bidder.fullName} with bid ₨${highestBid.amount.toLocaleString()}.`;
// //       io.to(`user_${vehicle.seller._id}`).emit('notification', {
// //         type: 'auction_ended',
// //         message: sellerMessage,
// //       });
// //       await Notification.create({
// //         user: vehicle.seller._id,
// //         message: sellerMessage,
// //         type: 'info',
// //         relatedVehicle: vehicle._id,
// //       });
// //     } else {
// //       // No bids – notify seller
// //       const noBidMessage = `Your auction for "${vehicle.title}" ended with no bids. You can relist it.`;
// //       io.to(`user_${vehicle.seller._id}`).emit('notification', {
// //         type: 'auction_no_bids',
// //         message: noBidMessage,
// //       });
// //       await Notification.create({
// //         user: vehicle.seller._id,
// //         message: noBidMessage,
// //         type: 'info',
// //         relatedVehicle: vehicle._id,
// //       });
// //     }
// //   }
// // };

// import Vehicle from '../models/Vehicle.js';
// import Bid from '../models/Bid.js';
// import Notification from '../models/Notification.js';
// import { getIO } from '../socket.js';

// export const closeExpiredAuctions = async () => {
//   const now = new Date();
//   const expiredAuctions = await Vehicle.find({
//     auctionStatus: 'active',
//     auctionEndTime: { $lte: now },
//   }).populate('seller');

//   for (const vehicle of expiredAuctions) {
//     const highestBid = await Bid.findOne({ vehicle: vehicle._id })
//       .sort('-amount')
//       .populate('bidder', 'fullName email _id');

//     vehicle.auctionStatus = 'closed';
//     await vehicle.save();

//     const io = getIO();

//     // Broadcast to all clients viewing this auction
//     io.to(`auction_${vehicle._id}`).emit('auction_ended', {
//       auctionId: vehicle._id,
//       auctionStatus: 'closed',
//       winner: highestBid ? highestBid.bidder.fullName : null,
//       winningBid: highestBid ? highestBid.amount : null,
//     });

//     if (highestBid) {
//       // Notify winner
//       const winMessage = `🎉 Congratulations! You won "${vehicle.title}" with ₨${highestBid.amount.toLocaleString()}. Contact seller: ${vehicle.seller.email}`;
//       io.to(`user_${highestBid.bidder._id}`).emit('notification', {
//         type: 'auction_won',
//         message: winMessage,
//         data: { vehicleId: vehicle._id, winningBid: highestBid.amount, sellerEmail: vehicle.seller.email },
//         createdAt: new Date(),
//       });
//       await Notification.create({
//         user: highestBid.bidder._id,
//         message: winMessage,
//         type: 'won',
//         relatedVehicle: vehicle._id,
//       });

//       // Notify seller
//       const sellerMessage = `🏁 Auction ended for "${vehicle.title}". Winner: ${highestBid.bidder.fullName} (₨${highestBid.amount.toLocaleString()}).`;
//       io.to(`user_${vehicle.seller._id}`).emit('notification', {
//         type: 'auction_ended',
//         message: sellerMessage,
//       });
//       await Notification.create({
//         user: vehicle.seller._id,
//         message: sellerMessage,
//         type: 'info',
//         relatedVehicle: vehicle._id,
//       });
//     } else {
//       const noBidMessage = `⚠️ Your auction for "${vehicle.title}" ended with no bids. You can relist it.`;
//       io.to(`user_${vehicle.seller._id}`).emit('notification', {
//         type: 'auction_no_bids',
//         message: noBidMessage,
//       });
//       await Notification.create({
//         user: vehicle.seller._id,
//         message: noBidMessage,
//         type: 'info',
//         relatedVehicle: vehicle._id,
//       });
//     }
//   }
// };

import Vehicle from '../models/Vehicle.js';
import Bid from '../models/Bid.js';
import Notification from '../models/Notification.js';
import { getIO } from '../socket.js';

export const closeExpiredAuctions = async () => {
  const now = new Date();
  const expiredAuctions = await Vehicle.find({
    auctionStatus: 'active',
    auctionEndTime: { $lte: now },
  }).populate('seller');

  for (const vehicle of expiredAuctions) {
    const highestBid = await Bid.findOne({ vehicle: vehicle._id })
      .sort('-amount')
      .populate('bidder', 'fullName email _id');

    vehicle.auctionStatus = 'closed';
    await vehicle.save();

    const io = getIO();

    // Broadcast to all clients viewing this auction
    io.to(`auction_${vehicle._id}`).emit('auction_ended', {
      auctionId: vehicle._id,
      auctionStatus: 'closed',
      winner: highestBid ? highestBid.bidder.fullName : null,
      winningBid: highestBid ? highestBid.amount : null,
    });

    if (highestBid) {
      // Notify winner
      const winMessage = `🎉 Congratulations! You won "${vehicle.title}" with ₨${highestBid.amount.toLocaleString()}. Contact seller: ${vehicle.seller.email}`;
      io.to(`user_${highestBid.bidder._id}`).emit('notification', {
        type: 'auction_won',
        message: winMessage,
        data: { vehicleId: vehicle._id, winningBid: highestBid.amount, sellerEmail: vehicle.seller.email },
        createdAt: new Date(),
      });
      await Notification.create({
        user: highestBid.bidder._id,
        message: winMessage,
        type: 'won',
        relatedVehicle: vehicle._id,
      });

      // Notify seller
      const sellerMessage = `🏁 Auction ended for "${vehicle.title}". Winner: ${highestBid.bidder.fullName} (₨${highestBid.amount.toLocaleString()}).`;
      io.to(`user_${vehicle.seller._id}`).emit('notification', {
        type: 'auction_ended',
        message: sellerMessage,
      });
      await Notification.create({
        user: vehicle.seller._id,
        message: sellerMessage,
        type: 'info',
        relatedVehicle: vehicle._id,
      });
    } else {
      const noBidMessage = `⚠️ Your auction for "${vehicle.title}" ended with no bids. You can relist it.`;
      io.to(`user_${vehicle.seller._id}`).emit('notification', {
        type: 'auction_no_bids',
        message: noBidMessage,
      });
      await Notification.create({
        user: vehicle.seller._id,
        message: noBidMessage,
        type: 'info',
        relatedVehicle: vehicle._id,
      });
    }
  }
};