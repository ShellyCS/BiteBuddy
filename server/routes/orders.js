import express from 'express';
import pool from '../config/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Create new order
router.post('/', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { restaurantId, items, total } = req.body;
    const userId = req.user.id;

    await connection.beginTransaction();

    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, restaurant_id, items, total, status) VALUES (?, ?, ?, ?, "pending")',
      [userId, restaurantId, JSON.stringify(items), total]
    );

    await connection.commit();
    res.status(201).json({ orderId: orderResult.insertId });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  } finally {
    connection.release();
  }
});

// Get user's orders
router.get('/user', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [orders] = await connection.execute(
      `SELECT o.*, r.name as restaurant_name, r.address as restaurant_address
       FROM orders o
       JOIN restaurant r ON o.restaurant_id = r.id
       WHERE o.user_id = ?
       ORDER BY o.timestamp DESC`,
      [req.user.id]
    );

    // Parse items JSON string for each order
    const formattedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  } finally {
    connection.release();
  }
});

// Get restaurant's orders
router.get('/restaurant/:id', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [orders] = await connection.execute(
      `SELECT o.*, u.email as user_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.restaurant_id = ?
       ORDER BY o.timestamp DESC`,
      [req.params.id]
    );

    // Parse items JSON string for each order
    const formattedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  } finally {
    connection.release();
  }
});

// Update order status
router.put('/:id/status', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { status } = req.body;
    
    await connection.beginTransaction();

    await connection.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    await connection.commit();
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  } finally {
    connection.release();
  }
});

export default router;