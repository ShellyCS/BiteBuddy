import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { verifyToken } from "./middleware/auth.js";
import adCampaignRoutes from "./routes/adCampaign.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import reservationRoutes from "./routes/reservations.js";
import restaurantRoutes from "./routes/restaurants.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", verifyToken, orderRoutes);
app.use("/api/reservations", verifyToken, reservationRoutes);
app.use("/api/campaigns", verifyToken, adCampaignRoutes);


// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join_restaurant", (restaurantId) => {
    socket.join(`restaurant_${restaurantId}`);
  });

  socket.on("new_order", (order) => {
    io.to(`restaurant_${order.restaurantId}`).emit("order_received", order);
  });

  socket.on("order_status_update", (data) => {
    io.to(`restaurant_${data.restaurantId}`).emit("order_updated", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
