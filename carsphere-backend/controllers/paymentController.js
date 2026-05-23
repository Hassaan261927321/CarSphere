// // // import crypto from 'crypto';
// // // import axios from 'axios';
// // // import AuctionPayment from '../models/AuctionPayment.js';
// // // import Vehicle from '../models/Vehicle.js';
// // // import Notification from '../models/Notification.js';
// // // import { getIO } from '../socket.js';

// // // // JazzCash Sandbox credentials (replace with your own from merchant portal)
// // // const JAZZCASH_MERCHANT_ID = process.env.JAZZCASH_MERCHANT_ID || 'MC123456';
// // // const JAZZCASH_PASSWORD = process.env.JAZZCASH_PASSWORD || 'yourpassword';
// // // const JAZZCASH_INTEGRITY_KEY = process.env.JAZZCASH_INTEGRITY_KEY || 'yourintegritykey';
// // // const JAZZCASH_RETURN_URL = process.env.JAZZCASH_RETURN_URL || 'http://localhost:3000/payment-callback';
// // // const JAZZCASH_API_URL = 'https://sandbox.jazzcash.com.pk/JPushAPI/APIPush.aspx';

// // // // Helper to generate JazzCash signature
// // // const generateSignature = (fields) => {
// // //   const sortedKeys = Object.keys(fields).sort();
// // //   const stringToSign = sortedKeys.map(key => fields[key]).join('&');
// // //   const hmac = crypto.createHmac('sha256', JAZZCASH_INTEGRITY_KEY);
// // //   hmac.update(stringToSign);
// // //   return hmac.digest('hex');
// // // };

// // // // @desc    Initiate payment for won auction
// // // // @route   POST /api/payment/initiate
// // // // @access  Private (winner only)
// // // export const initiatePayment = async (req, res) => {
// // //   try {
// // //     const { vehicleId } = req.body;
// // //     const vehicle = await Vehicle.findById(vehicleId).populate('seller');
// // //     if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

// // //     // Check if already paid
// // //     const existingPayment = await AuctionPayment.findOne({ vehicle: vehicleId, buyer: req.user._id, status: 'paid' });
// // //     if (existingPayment) return res.status(400).json({ message: 'Already paid for this auction' });

// // //     // Create payment record
// // //     const payment = await AuctionPayment.create({
// // //       vehicle: vehicleId,
// // //       buyer: req.user._id,
// // //       seller: vehicle.seller._id,
// // //       amount: vehicle.currentBid,
// // //       status: 'pending',
// // //     });

// // //     // Prepare JazzCash payload
// // //     const txDateTime = new Date().toISOString().replace(/[-:.]/g, '');
// // //     const expiry = new Date(Date.now() + 30 * 60 * 1000).toISOString().replace(/[-:.]/g, ''); // 30 min expiry
// // //     const pp_TxnRefNo = `CARSPHERE_${payment._id}_${Date.now()}`;

// // //     const fields = {
// // //       pp_Version: '2.0',
// // //       pp_TxnType: 'MP',
// // //       pp_MerchantID: JAZZCASH_MERCHANT_ID,
// // //       pp_Password: JAZZCASH_PASSWORD,
// // //       pp_ReturnURL: JAZZCASH_RETURN_URL,
// // //       pp_TxnRefNo: pp_TxnRefNo,
// // //       pp_Amount: payment.amount.toString(),
// // //       pp_BillToEmail: req.user.email,
// // //       pp_TxnDateTime: txDateTime,
// // //       pp_ExpiryDateTime: expiry,
// // //       pp_Language: 'EN',
// // //     };

// // //     const pp_SecureHash = generateSignature(fields);
// // //     fields.pp_SecureHash = pp_SecureHash;

// // //     // Store JazzCash order ID in our DB
// // //     payment.jazzCashOrderId = pp_TxnRefNo;
// // //     await payment.save();

// // //     // Call JazzCash API
// // //     const response = await axios.post(JAZZCASH_API_URL, new URLSearchParams(fields), {
// // //       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
// // //     });

// // //     // Parse response (JazzCash returns HTML with redirect URL)
// // //     const redirectUrl = response.data.match(/https:\/\/sandbox\.jazzcash\.com\.pk\/Payment\/Redirect\.aspx\?[^"]+/)?.[0];
// // //     if (redirectUrl) {
// // //       res.json({ redirectUrl });
// // //     } else {
// // //       throw new Error('Failed to get redirect URL');
// // //     }
// // //   } catch (error) {
// // //     console.error('Payment initiation error:', error);
// // //     res.status(500).json({ message: 'Payment initiation failed' });
// // //   }
// // // };

// // // // @desc    JazzCash callback (return URL)
// // // // @route   GET /api/payment/callback
// // // // @access  Public (but signature verified)
// // // export const paymentCallback = async (req, res) => {
// // //   const { pp_TxnRefNo, pp_ResponseCode, pp_SecureHash, ...rest } = req.query;

// // //   // Verify signature (recalculate and compare)
// // //   const receivedHash = pp_SecureHash;
// // //   const fieldsToHash = { ...rest, pp_TxnRefNo, pp_ResponseCode };
// // //   const calculatedHash = generateSignature(fieldsToHash);
// // //   if (calculatedHash !== receivedHash) {
// // //     return res.status(400).send('Invalid signature');
// // //   }

// // //   const payment = await AuctionPayment.findOne({ jazzCashOrderId: pp_TxnRefNo });
// // //   if (!payment) return res.status(404).send('Payment not found');

// // //   if (pp_ResponseCode === '000') {
// // //     // Success
// // //     payment.status = 'paid';
// // //     payment.paymentDate = new Date();
// // //     await payment.save();

// // //     // Notify buyer
// // //     const io = getIO();
// // //     io.to(`user_${payment.buyer}`).emit('notification', {
// // //       type: 'payment_success',
// // //       message: `Payment of ₨${payment.amount.toLocaleString()} for auction completed successfully.`,
// // //     });

// // //     // Notify seller
// // //     io.to(`user_${payment.seller}`).emit('notification', {
// // //       type: 'payment_received',
// // //       message: `You have received ₨${payment.amount.toLocaleString()} for your vehicle auction.`,
// // //     });
// // //     await Notification.create({
// // //       user: payment.seller,
// // //       message: `Payment received for auction of amount ₨${payment.amount.toLocaleString()}.`,
// // //       type: 'info',
// // //     });
// // //   } else {
// // //     payment.status = 'failed';
// // //     await payment.save();
// // //   }

// // //   // Redirect to frontend success/failure page
// // //   const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
// // //   const redirectPath = pp_ResponseCode === '000' ? '/payment-success' : '/payment-failed';
// // //   res.redirect(`${frontendUrl}${redirectPath}?txn=${pp_TxnRefNo}`);
// // // };

// // // // @desc    Check payment status
// // // // @route   GET /api/payment/status/:vehicleId
// // // // @access  Private
// // // export const getPaymentStatus = async (req, res) => {
// // //   const payment = await AuctionPayment.findOne({ vehicle: req.params.vehicleId, buyer: req.user._id });
// // //   if (!payment) return res.json({ status: 'not_initiated' });
// // //   res.json({ status: payment.status, amount: payment.amount, paymentDate: payment.paymentDate });
// // // };

// // import crypto from 'crypto';
// // import axios from 'axios';
// // import AuctionPayment from '../models/AuctionPayment.js';
// // import Vehicle from '../models/Vehicle.js';
// // import Notification from '../models/Notification.js';
// // import { getIO } from '../socket.js';

// // const JAZZCASH_MERCHANT_ID = process.env.JAZZCASH_MERCHANT_ID || 'MC123456';
// // const JAZZCASH_PASSWORD = process.env.JAZZCASH_PASSWORD || 'yourpassword';
// // const JAZZCASH_INTEGRITY_KEY = process.env.JAZZCASH_INTEGRITY_KEY || 'yourintegritykey';
// // const JAZZCASH_RETURN_URL = process.env.JAZZCASH_RETURN_URL || 'http://localhost:3000/payment-callback';
// // const JAZZCASH_API_URL = 'https://sandbox.jazzcash.com.pk/JPushAPI/APIPush.aspx';

// // const generateSignature = (fields) => {
// //   const sortedKeys = Object.keys(fields).sort();
// //   const stringToSign = sortedKeys.map(key => fields[key]).join('&');
// //   const hmac = crypto.createHmac('sha256', JAZZCASH_INTEGRITY_KEY);
// //   hmac.update(stringToSign);
// //   return hmac.digest('hex');
// // };

// // export const initiatePayment = async (req, res) => {
// //   try {
// //     console.log('Initiate payment request received for vehicle:', req.body.vehicleId);
// //     const { vehicleId } = req.body;
// //     const vehicle = await Vehicle.findById(vehicleId).populate('seller');
// //     if (!vehicle) {
// //       return res.status(404).json({ message: 'Vehicle not found' });
// //     }

// //     // Check if already paid
// //     const existingPayment = await AuctionPayment.findOne({ vehicle: vehicleId, buyer: req.user._id, status: 'paid' });
// //     if (existingPayment) {
// //       return res.status(400).json({ message: 'Already paid for this auction' });
// //     }

// //     // Create payment record
// //     let payment = await AuctionPayment.findOne({ vehicle: vehicleId, buyer: req.user._id, status: 'pending' });
// //     if (!payment) {
// //       payment = await AuctionPayment.create({
// //         vehicle: vehicleId,
// //         buyer: req.user._id,
// //         seller: vehicle.seller._id,
// //         amount: vehicle.currentBid,
// //         status: 'pending',
// //       });
// //     }

// //     const txDateTime = new Date().toISOString().replace(/[-:.]/g, '');
// //     const expiry = new Date(Date.now() + 30 * 60 * 1000).toISOString().replace(/[-:.]/g, '');
// //     const pp_TxnRefNo = `CARSPHERE_${payment._id}_${Date.now()}`;

// //     const fields = {
// //       pp_Version: '2.0',
// //       pp_TxnType: 'MP',
// //       pp_MerchantID: JAZZCASH_MERCHANT_ID,
// //       pp_Password: JAZZCASH_PASSWORD,
// //       pp_ReturnURL: JAZZCASH_RETURN_URL,
// //       pp_TxnRefNo: pp_TxnRefNo,
// //       pp_Amount: payment.amount.toString(),
// //       pp_BillToEmail: req.user.email,
// //       pp_TxnDateTime: txDateTime,
// //       pp_ExpiryDateTime: expiry,
// //       pp_Language: 'EN',
// //     };

// //     const pp_SecureHash = generateSignature(fields);
// //     fields.pp_SecureHash = pp_SecureHash;

// //     payment.jazzCashOrderId = pp_TxnRefNo;
// //     await payment.save();

// //     console.log('Sending request to JazzCash:', fields);
// //     const response = await axios.post(JAZZCASH_API_URL, new URLSearchParams(fields), {
// //       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
// //     });

// //     const redirectUrl = response.data.match(/https:\/\/sandbox\.jazzcash\.com\.pk\/Payment\/Redirect\.aspx\?[^"]+/)?.[0];
// //     if (redirectUrl) {
// //       res.json({ redirectUrl });
// //     } else {
// //       console.error('JazzCash response did not contain redirect URL:', response.data);
// //       throw new Error('Failed to get redirect URL from JazzCash');
// //     }
// //   } catch (error) {
// //     console.error('Payment initiation error:', error.message);
// //     res.status(500).json({ message: 'Payment initiation failed: ' + error.message });
// //   }
// // };

// // export const paymentCallback = async (req, res) => {
// //   const { pp_TxnRefNo, pp_ResponseCode, pp_SecureHash, ...rest } = req.query;

// //   const fieldsToHash = { ...rest, pp_TxnRefNo, pp_ResponseCode };
// //   const calculatedHash = generateSignature(fieldsToHash);
// //   if (calculatedHash !== pp_SecureHash) {
// //     return res.status(400).send('Invalid signature');
// //   }

// //   const payment = await AuctionPayment.findOne({ jazzCashOrderId: pp_TxnRefNo });
// //   if (!payment) return res.status(404).send('Payment not found');

// //   if (pp_ResponseCode === '000') {
// //     payment.status = 'paid';
// //     payment.paymentDate = new Date();
// //     await payment.save();

// //     const io = getIO();
// //     io.to(`user_${payment.buyer}`).emit('notification', {
// //       type: 'payment_success',
// //       message: `Payment of ₨${payment.amount.toLocaleString()} completed.`,
// //     });
// //     io.to(`user_${payment.seller}`).emit('notification', {
// //       type: 'payment_received',
// //       message: `You received ₨${payment.amount.toLocaleString()} for your vehicle.`,
// //     });
// //   } else {
// //     payment.status = 'failed';
// //     await payment.save();
// //   }

// //   const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
// //   const redirectPath = pp_ResponseCode === '000' ? '/payment-success' : '/payment-failed';
// //   res.redirect(`${frontendUrl}${redirectPath}?txn=${pp_TxnRefNo}`);
// // };

// // export const getPaymentStatus = async (req, res) => {
// //   try {
// //     const payment = await AuctionPayment.findOne({ vehicle: req.params.vehicleId, buyer: req.user._id });
// //     if (!payment) return res.json({ status: 'not_initiated' });
// //     res.json({ status: payment.status, amount: payment.amount, paymentDate: payment.paymentDate });
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// import AuctionPayment from '../models/AuctionPayment.js';
// import Vehicle from '../models/Vehicle.js';
// import Notification from '../models/Notification.js';
// import { getIO } from '../socket.js';


// // MOCK PAYMENT – always succeeds (for testing)
// export const initiatePayment = async (req, res) => {
//     console.log('🔵 Payment initiate called, user:', req.user?._id);
//   console.log('🔵 Vehicle ID:', req.body.vehicleId);
//   try {
//     const { vehicleId } = req.body;
//     const vehicle = await Vehicle.findById(vehicleId).populate('seller');
//     if (!vehicle) {
//       return res.status(404).json({ message: 'Vehicle not found' });
//     }

//     // Check if already paid
//     const existingPayment = await AuctionPayment.findOne({ vehicle: vehicleId, buyer: req.user._id, status: 'paid' });
//     if (existingPayment) {
//       return res.status(400).json({ message: 'Already paid for this auction' });
//     }

//     // Create or update payment record
//     let payment = await AuctionPayment.findOne({ vehicle: vehicleId, buyer: req.user._id, status: 'pending' });
//     if (!payment) {
//       payment = await AuctionPayment.create({
//         vehicle: vehicleId,
//         buyer: req.user._id,
//         seller: vehicle.seller._id,
//         amount: vehicle.currentBid,
//         status: 'pending',
//       });
//     }

//     // MOCK: simulate successful payment
//     payment.status = 'paid';
//     payment.paymentDate = new Date();
//     payment.jazzCashOrderId = `MOCK_${payment._id}`;
//     await payment.save();

//     // Send notifications
//     const io = getIO();
//     io.to(`user_${payment.buyer}`).emit('notification', {
//       type: 'payment_success',
//       message: `✅ Payment of ₨${payment.amount.toLocaleString()} completed successfully (MOCK).`,
//     });
//     io.to(`user_${payment.seller}`).emit('notification', {
//       type: 'payment_received',
//       message: `💰 You received ₨${payment.amount.toLocaleString()} for your vehicle (MOCK).`,
//     });
//     await Notification.create({
//       user: payment.seller,
//       message: `Payment received for auction of ₨${payment.amount.toLocaleString()}.`,
//       type: 'info',
//     });

//     // Return success (redirect frontend to success page)
//     const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
//     res.json({ redirectUrl: `${frontendUrl}/payment-success?txn=${payment.jazzCashOrderId}` });
//   } catch (error) {
//     console.error('❌ ERROR in initiatePayment:', error);
//     res.status(500).json({ message: 'Payment initiation failed: ' + error.message });
//   }
// };

// export const paymentCallback = async (req, res) => {
//   // For mock, just redirect to success
//   const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
//   res.redirect(`${frontendUrl}/payment-success`);
// };

// export const getPaymentStatus = async (req, res) => {
//   try {
//     const payment = await AuctionPayment.findOne({ vehicle: req.params.vehicleId, buyer: req.user._id });
//     if (!payment) return res.json({ status: 'not_initiated' });
//     res.json({ status: payment.status, amount: payment.amount, paymentDate: payment.paymentDate });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import crypto from 'crypto';
import axios from 'axios';
import AuctionPayment from '../models/AuctionPayment.js';
import Vehicle from '../models/Vehicle.js';
import Notification from '../models/Notification.js';
import { getIO } from '../socket.js';

// Read from environment
const MERCHANT_ID = process.env.JAZZCASH_MERCHANT_ID;
const PASSWORD = process.env.JAZZCASH_PASSWORD;
const INTEGRITY_KEY = process.env.JAZZCASH_INTEGRITY_KEY;
const RETURN_URL = process.env.JAZZCASH_RETURN_URL;
const API_URL = process.env.JAZZCASH_API_URL;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Helper: Generate JazzCash signature
const generateSignature = (fields) => {
  const sortedKeys = Object.keys(fields).sort();
  const stringToSign = sortedKeys.map(key => fields[key]).join('&');
  const hmac = crypto.createHmac('sha256', INTEGRITY_KEY);
  hmac.update(stringToSign);
  return hmac.digest('hex');
};

// Helper: Create transaction datetime format (YYYYMMDDHHMMSS)
const getTransactionDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

// Helper: Expiry datetime (30 minutes from now)
const getExpiryDateTime = () => {
  const expiry = new Date(Date.now() + 30 * 60 * 1000);
  const year = expiry.getFullYear();
  const month = String(expiry.getMonth() + 1).padStart(2, '0');
  const day = String(expiry.getDate()).padStart(2, '0');
  const hours = String(expiry.getHours()).padStart(2, '0');
  const minutes = String(expiry.getMinutes()).padStart(2, '0');
  const seconds = String(expiry.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

// @desc    Initiate JazzCash payment
// @route   POST /api/payment/initiate
// @access  Private (winner only)
export const initiatePayment = async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const vehicle = await Vehicle.findById(vehicleId).populate('seller');
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check if already paid
    const existingPayment = await AuctionPayment.findOne({ vehicle: vehicleId, buyer: req.user._id, status: 'paid' });
    if (existingPayment) {
      return res.status(400).json({ message: 'Already paid for this auction' });
    }

    // Create or get pending payment record
    let payment = await AuctionPayment.findOne({ vehicle: vehicleId, buyer: req.user._id, status: 'pending' });
    if (!payment) {
      payment = await AuctionPayment.create({
        vehicle: vehicleId,
        buyer: req.user._id,
        seller: vehicle.seller._id,
        amount: vehicle.currentBid,
        status: 'pending',
      });
    }

    // Generate unique transaction reference
    const txnRefNo = `CARSPHERE_${payment._id}_${Date.now()}`;
    const txnDateTime = getTransactionDateTime();
    const expiryDateTime = getExpiryDateTime();

    // Build request payload
    const payload = {
      pp_Version: '2.0',
      pp_TxnType: 'MP',
      pp_MerchantID: MERCHANT_ID,
      pp_Password: PASSWORD,
      pp_ReturnURL: RETURN_URL,
      pp_TxnRefNo: txnRefNo,
      pp_Amount: payment.amount.toString(),
      pp_BillToEmail: req.user.email,
      pp_TxnDateTime: txnDateTime,
      pp_ExpiryDateTime: expiryDateTime,
      pp_Language: 'EN',
    };

    // Generate signature and add to payload
    const pp_SecureHash = generateSignature(payload);
    payload.pp_SecureHash = pp_SecureHash;

    // Store JazzCash order ID in our DB
    payment.jazzCashOrderId = txnRefNo;
    await payment.save();

    // Send request to JazzCash
    const response = await axios.post(API_URL, new URLSearchParams(payload), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    // Extract redirect URL from JazzCash response (HTML body)
    const redirectUrlMatch = response.data.match(/https:\/\/sandbox\.jazzcash\.com\.pk\/Payment\/Redirect\.aspx\?[^"'\s]+/);
    if (redirectUrlMatch && redirectUrlMatch[0]) {
      return res.json({ redirectUrl: redirectUrlMatch[0] });
    } else {
      console.error('JazzCash response did not contain redirect URL:', response.data);
      throw new Error('Failed to extract redirect URL from JazzCash');
    }
  } catch (error) {
    console.error('Payment initiation error:', error.message);
    res.status(500).json({ message: 'Payment initiation failed: ' + error.message });
  }
};

// @desc    JazzCash callback (return URL)
// @route   GET /api/payment/callback
// @access  Public
export const paymentCallback = async (req, res) => {
  const { pp_TxnRefNo, pp_ResponseCode, pp_SecureHash, ...rest } = req.query;

  // Verify signature (recalculate and compare)
  const fieldsToHash = { ...rest, pp_TxnRefNo, pp_ResponseCode };
  const calculatedHash = generateSignature(fieldsToHash);
  if (calculatedHash !== pp_SecureHash) {
    console.error('Signature mismatch. Expected:', calculatedHash, 'Received:', pp_SecureHash);
    return res.status(400).send('Invalid signature');
  }

  const payment = await AuctionPayment.findOne({ jazzCashOrderId: pp_TxnRefNo });
  if (!payment) return res.status(404).send('Payment not found');

  if (pp_ResponseCode === '000') {
    payment.status = 'paid';
    payment.paymentDate = new Date();
    await payment.save();

    const io = getIO();
    io.to(`user_${payment.buyer}`).emit('notification', {
      type: 'payment_success',
      message: `✅ Payment of ₨${payment.amount.toLocaleString()} completed.`,
    });
    io.to(`user_${payment.seller}`).emit('notification', {
      type: 'payment_received',
      message: `💰 You received ₨${payment.amount.toLocaleString()} for your vehicle.`,
    });
    await Notification.create({
      user: payment.seller,
      message: `Payment received for auction of ₨${payment.amount.toLocaleString()}.`,
      type: 'info',
    });
  } else {
    payment.status = 'failed';
    await payment.save();
  }

  const redirectPath = pp_ResponseCode === '000' ? '/payment-success' : '/payment-failed';
  res.redirect(`${FRONTEND_URL}${redirectPath}?txn=${pp_TxnRefNo}`);
};

// @desc    Check payment status
// @route   GET /api/payment/status/:vehicleId
// @access  Private
export const getPaymentStatus = async (req, res) => {
  try {
    const payment = await AuctionPayment.findOne({ vehicle: req.params.vehicleId, buyer: req.user._id });
    if (!payment) return res.json({ status: 'not_initiated' });
    res.json({ status: payment.status, amount: payment.amount, paymentDate: payment.paymentDate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};