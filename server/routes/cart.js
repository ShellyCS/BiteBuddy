import express from "express";
import db from "../config/db.js"; // adjust the path as needed
const router = express.Router();

// Add to cart
router.post("/add", async (req, res) => {
  const { user_id, item_id, quantity } = req.body;
  try {
    const [existing] = await db.query(
      "SELECT * FROM cart WHERE user_id = ? AND item_id = ?",
      [user_id, item_id]
    );
    if (existing.length) {
      await db.query(
        "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND item_id = ?",
        [quantity, user_id, item_id]
      );
    } else {
      await db.query(
        "INSERT INTO cart (user_id, item_id, quantity) VALUES (?, ?, ?)",
        [user_id, item_id, quantity]
      );
    }
    res.status(200).json({ message: "Item added to cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get cart
router.get("/:userId", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.item_id, c.quantity, m.name, m.price 
       FROM cart c JOIN menu_items m ON c.item_id = m.id 
       WHERE c.user_id = ?`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update quantity
router.put("/update", async (req, res) => {
  const { user_id, item_id, quantity } = req.body;
  try {
    await db.query(
      "UPDATE cart SET quantity = ? WHERE user_id = ? AND item_id = ?",
      [quantity, user_id, item_id]
    );
    res.json({ message: "Quantity updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove item
router.delete("/remove", async (req, res) => {
  const { user_id, item_id } = req.body;
  try {
    await db.query("DELETE FROM cart WHERE user_id = ? AND item_id = ?", [
      user_id,
      item_id,
    ]);
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear cart
router.delete("/clear/:userId", async (req, res) => {
  try {
    await db.query("DELETE FROM cart WHERE user_id = ?", [req.params.userId]);
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
