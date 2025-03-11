const express = require("express");
const db = require("../db");
const router = express.Router();

// Get All Restaurants
router.get("/restaurants", (req, res) => {
  const query = "SELECT * FROM restaurant";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching restaurants:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

module.exports = router;
