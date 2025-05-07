import express from 'express';
import pool from '../config/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Create new reservation
router.post('/', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { 
      restaurantId, 
      date, 
      time, 
      guests, 
      occasion,
      specialRequests,
      customerName,
      customerEmail,
      customerPhone 
    } = req.body;

    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO reservations (
        restaurant_id, customer_name, customer_email, customer_phone,
        date, time, guests, occasion, special_requests, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, "pending")`,
      [restaurantId, customerName, customerEmail, customerPhone, date, time, guests, occasion, specialRequests]
    );

    await connection.commit();
    res.status(201).json({ reservationId: result.insertId });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: 'Error creating reservation', error: error.message });
  } finally {
    connection.release();
  }
});

// Get user's reservations
router.get('/user', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [reservations] = await connection.execute(
      `SELECT r.*, rest.name as restaurant_name, rest.address as restaurant_address
       FROM reservations r
       JOIN restaurant rest ON r.restaurant_id = rest.id
       WHERE r.customer_email = ?
       ORDER BY r.date, r.time`,
      [req.user.email]
    );

    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Error fetching reservations', error: error.message });
  } finally {
    connection.release();
  }
});

// Get restaurant's reservations
router.get('/restaurant/:id', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [reservations] = await connection.execute(
      `SELECT r.*
       FROM reservations r
       WHERE r.restaurant_id = ?
       ORDER BY r.date, r.time`,
      [req.params.id]
    );

    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Error fetching reservations', error: error.message });
  } finally {
    connection.release();
  }
});

// Update reservation status
router.put('/:id/status', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { status } = req.body;

    await connection.beginTransaction();

    await connection.execute(
      'UPDATE reservations SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    await connection.commit();
    res.json({ message: 'Reservation status updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating reservation status:', error);
    res.status(500).json({ message: 'Error updating reservation status', error: error.message });
  } finally {
    connection.release();
  }
});

export default router;