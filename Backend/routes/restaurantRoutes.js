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

// Get a Specific Restaurant by ID
router.get("/restaurants/:id", (req, res) => {
  const restaurantId = req.params.id;
  console.log(`Request received for restaurant with ID: ${restaurantId}`);

  const query = "SELECT * FROM restaurant WHERE id = ?";
  
  db.query(query, [restaurantId], (err, results) => {
    if (err) {
      console.error("Error fetching restaurant:", err);
      return res.status(500).json({ message: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(results[0]);
  });
});

// POST a New Restaurant
router.post("/restaurants", (req, res) => {
  const { name, cloudinaryImageId, costForTwo, deliveryTime, avgRating, cuisines, promoted, address, city, area } = req.body;
  
  const query = `INSERT INTO restaurant (name, cloudinaryImageId, costForTwo, deliveryTime, avgRating, cuisines, promoted, address, city, area) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [name, cloudinaryImageId, costForTwo, deliveryTime, avgRating, cuisines, promoted, address, city, area], (err, result) => {
    if (err) {
      console.error("Error inserting restaurant:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(201).json({ message: "Restaurant created", id: result.insertId });
  });
});

module.exports = router;
