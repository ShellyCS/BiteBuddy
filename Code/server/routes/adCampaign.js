import express from "express";
import pool from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/restaurant/:id", verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const restaurantId = req.params.id;

    const [campaigns] = await connection.execute(
      `SELECT id, name, objective, budget, status, impressions, clicks
       FROM campaigns
       WHERE restaurant_id = ?
       ORDER BY id DESC`,
      [restaurantId]
    );

    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch campaigns", error: error.message });
  } finally {
    connection.release();
  }
});

export default router;
