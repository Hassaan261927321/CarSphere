// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import connectDB from './config/db.js';
// import authRoutes from './routes/auth.js';
// import vehicleRoutes from './routes/vehicles.js';
// import bidRoutes from './routes/bids.js';
// import appointmentRoutes from './routes/appointments.js';
// import userRoutes from './routes/users.js';
// import { errorHandler } from './middleware/errorMiddleware.js';

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/vehicles', vehicleRoutes);
// app.use('/api/bids', bidRoutes);
// app.use('/api/appointments', appointmentRoutes);
// app.use('/api/users', userRoutes);

// app.get('/', (req, res) => res.send('Carsphere API Running'));

// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// backend/server.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';

import connectDB from './config/db.js';
import { initSocket } from './socket.js';
import { closeExpiredAuctions } from './controllers/auctionEndController.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Import all route files
import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicles.js';
import bidRoutes from './routes/bids.js';
import appointmentRoutes from './routes/appointments.js';
import orderRoutes from './routes/orders.js';
import partRoutes from './routes/parts.js';
import userRoutes from './routes/users.js';
import chatRoutes from './routes/chat.js';
import reviewRoutes from './routes/reviews.js';
import paymentRoutes from './routes/payment.js';
import adminRoutes from './routes/admin.js';
import cartRoutes from './routes/cart.js';
import notificationRoutes from './routes/notification.js';


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io and attach to server
const io = initSocket(server);
app.set('io', io); // make io accessible in route controllers via req.app.get('io')

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/parts', partRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/reviews', reviewRoutes);

app.use('/api/notifications', notificationRoutes);


// Health check
app.get('/api/health', (req, res) => res.status(200).json({ status: 'OK' }));

// Error handling middleware (must be last)
app.use(errorHandler);

// Cron job: check for expired auctions every minute
cron.schedule('* * * * *', () => {
  console.log('[CRON] Checking for expired auctions...');
  closeExpiredAuctions().catch(err => console.error('[CRON] Auction check failed:', err));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io enabled, waiting for connections...`);
});