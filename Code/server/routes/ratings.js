import express from "express";
import pool from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// POST a new rating
router.post("/", verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { restaurantId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!restaurantId || !rating) {
      connection.release();
      return res
        .status(400)
        .json({ message: "restaurantId and rating are required" });
    }

    await connection.execute(
      `INSERT INTO ratings (user_id, restaurant_id, rating, comment)
       VALUES (?, ?, ?, ?)`,
      [userId, restaurantId, rating, comment || ""]
    );

    res.status(201).json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error("Error submitting rating:", error);

    // ✅ Only send response if not already sent
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "Failed to submit rating", error: error.message });
    }
  } finally {
    connection.release(); // ✅ Always release
  }
});

export default router;
