import express from "express";
import pool from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  console.log("Support ticket endpoint hit");
  const { subject, message } = req.body;
  const userId = req.user.id;

  try {
    await pool.execute(
      "INSERT INTO support_tickets (user_id, subject, message) VALUES (?, ?, ?)",
      [userId, subject, message]
    );
    res.status(201).json({ message: "Support ticket created" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

router.get("/user", verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const [tickets] = await pool.execute(
      "SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

export default router;
