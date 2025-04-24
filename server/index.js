import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import restaurantRoutes from './routes/restaurants.js';
import orderRoutes from './routes/orders.js';
import reservationRoutes from './routes/reservations.js';
import paymentRoutes from './routes/payments.js'; // Add import for payment routes
import { verifyToken } from './middleware/auth.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Special handling for Stripe webhook
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Regular middleware for other routes
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', verifyToken, orderRoutes);
app.use('/api/reservations', verifyToken, reservationRoutes);
app.use('/api/payments', paymentRoutes); // Add payment routes

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_restaurant', (restaurantId) => {
    socket.join(`restaurant_${restaurantId}`);
  });

  socket.on('new_order', (order) => {
    io.to(`restaurant_${order.restaurantId}`).emit('order_received', order);
  });

  socket.on('order_status_update', (data) => {
    io.to(`restaurant_${data.restaurantId}`).emit('order_updated', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});