import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  console.log("Register payload:", req.body);

  const connection = await pool.getConnection();
  try {
    const {
      email,
      password,
      confirmPassword,
      role,
      restaurantName,
      restaurantAddress,
      restaurantPhone,
    } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Email, password, and role are required." });
    }

    // Optional: check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (role === "restaurant" && (!restaurantName || !restaurantAddress)) {
      return res.status(400).json({
        message:
          "Restaurant name and address are required for restaurant users.",
      });
    }

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    await connection.beginTransaction();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [userResult] = await connection.execute(
      "INSERT INTO users (email, password, type) VALUES (?, ?, ?)",
      [email, hashedPassword, role]
    );

    let restaurantId = null;

    if (role === "restaurant") {
      const safeRestaurantName = restaurantName ?? null;
      const safeAddress = restaurantAddress ?? null;
      const safePhone = restaurantPhone ?? null;
      const safeImage = "default-image";
      const safeCost = 30000;
      const safeTime = 30;
      const safeRating = 4.0;
      const safeCuisines = "Various Cuisines";
      const safeCity = "Bangalore";
      const safeArea = "Local Area";

      const [restaurantResult] = await connection.execute(
        `INSERT INTO restaurant (name, cloudinaryImageId, costForTwo, deliveryTime, avgRating, cuisines, address, city, area) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          safeRestaurantName,
          safeImage,
          safeCost,
          safeTime,
          safeRating,
          safeCuisines,
          safeAddress,
          safeCity,
          safeArea,
        ]
      );

      restaurantId = restaurantResult.insertId;

      // Update user with restaurant_id
      await connection.execute(
        "UPDATE users SET restaurant_id = ? WHERE id = ?",
        [restaurantId, userResult.insertId]
      );
    }

    await connection.commit();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: userResult.insertId,
        email,
        role,
        restaurantId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      token,
      user: {
        id: userResult.insertId,
        email,
        role,
        restaurantId,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  } finally {
    connection.release();
  }
});

router.post("/login", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { email, password } = req.body;

    const [users] = await connection.execute(
      `SELECT u.*, r.id as restaurant_id 
       FROM users u 
       LEFT JOIN restaurant r ON u.restaurant_id = r.id 
       WHERE u.email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.type,
        restaurantId: user.restaurant_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.type,
        restaurantId: user.restaurant_id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  } finally {
    connection.release();
  }
});

export default router;
