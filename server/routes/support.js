import express from "express";
import pool from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  console.log("Raised a ticket...");
  const { subject, message, restaurantId } = req.body;
  const userId = req.user.id;

  try {
    await pool.execute(
      "INSERT INTO support_tickets (user_id, restaurant_id, subject, message) VALUES (?, ?, ?, ?)",
      [userId, restaurantId, subject, message]
    );
    res.status(201).json({ message: "Support ticket created" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

router.get("/restaurant", verifyToken, async (req, res) => {
  console.log("get the raised ticket for the selected restaurant");
  const restaurantId = req.user.restaurantId;

  if (!restaurantId) {
    return res.status(403).json({ error: "Access denied: Not a restaurant" });
  }

  try {
    const [tickets] = await pool.execute(
      "SELECT * FROM support_tickets WHERE restaurant_id = ? ORDER BY created_at DESC",
      [restaurantId]
    );
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tickets for restaurant" });
  }
});

export default router;
