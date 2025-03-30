import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { email, password, type, restaurantName, address, phone } = req.body;
    
    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    await connection.beginTransaction();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [userResult] = await connection.execute(
      'INSERT INTO users (email, password, type) VALUES (?, ?, ?)',
      [email, hashedPassword, type]
    );

    let restaurantId = null;

    // If registering as restaurant, create restaurant entry
    if (type === 'restaurant') {
      const [restaurantResult] = await connection.execute(
        `INSERT INTO restaurant (name, cloudinaryImageId, costForTwo, deliveryTime, avgRating, cuisines, address, city, area) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [restaurantName, 'default-image', 30000, 30, 4.0, 'Various Cuisines', address, 'Bangalore', 'Local Area']
      );
      restaurantId = restaurantResult.insertId;

      // Update user with restaurant_id
      await connection.execute(
        'UPDATE users SET restaurant_id = ? WHERE id = ?',
        [restaurantId, userResult.insertId]
      );
    }

    await connection.commit();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: userResult.insertId, 
        email, 
        role: type,
        restaurantId 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: userResult.insertId,
        email,
        role: type,
        restaurantId
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  } finally {
    connection.release();
  }
});

router.post('/login', async (req, res) => {
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
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.type,
        restaurantId: user.restaurant_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.type,
        restaurantId: user.restaurant_id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  } finally {
    connection.release();
  }
});

export default router;