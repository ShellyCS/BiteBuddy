import express from "express";
import pool from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";
import stripe from "../config/stripe.js";

const router = express.Router();

// Create new order
router.post("/", verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { restaurantId, items, total } = req.body;
    const userId = req.user.id;

    await connection.beginTransaction();

    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, restaurant_id, items, total, status, payment_status) VALUES (?, ?, ?, ?, "pending", "pending")',
      [userId, restaurantId, items, total]
    );

    await connection.commit();
    res.status(201).json({ orderId: orderResult.insertId });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  } finally {
    connection.release();
  }
});

// Create payment intent for an order
router.post("/:id/payment", verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const orderId = req.params.id;
    
    // Get order details
    const [orders] = await connection.execute(
      `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
      [orderId, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = orders[0];
    
    // Create a payment intent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Convert to cents
      currency: "usd",
      metadata: {
        orderId: order.id,
        userId: req.user.id,
      },
    });

    // Update order with payment intent ID
    await connection.execute(
      'UPDATE orders SET payment_intent_id = ? WHERE id = ?',
      [paymentIntent.id, orderId]
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ 
      message: "Error creating payment intent", 
      error: error.message 
    });
  } finally {
    connection.release();
  }
});

// Update payment status
router.put("/:id/payment-status", verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { status } = req.body;
    
    await connection.beginTransaction();

    await connection.execute(
      "UPDATE orders SET payment_status = ? WHERE id = ?", 
      [status, req.params.id]
    );

    await connection.commit();
    res.json({ message: "Payment status updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating payment status:", error);
    res.status(500).json({ 
      message: "Error updating payment status", 
      error: error.message 
    });
  } finally {
    connection.release();
  }
});

// Get user's orders
router.get("/user", verifyToken, async (req, res) => {
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
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  } finally {
    connection.release();
  }
});

// Get restaurant's orders
router.get("/restaurant/:id", verifyToken, async (req, res) => {
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
    const formattedOrders = orders.map((order) => ({
      ...order,
      items: JSON.parse(order.items),
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  } finally {
    connection.release();
  }
});

// Update order status
router.put("/:id/status", verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { status } = req.body;

    await connection.beginTransaction();

    await connection.execute("UPDATE orders SET status = ? WHERE id = ?", [
      status,
      req.params.id,
    ]);

    await connection.commit();
    res.json({ message: "Order status updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating order status:", error);
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  } finally {
    connection.release();
  }
});

// Get order by ID
router.get('/:id', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [orders] = await connection.execute(
      `SELECT o.*, r.name as restaurant_name
       FROM orders o
       JOIN restaurant r ON o.restaurant_id = r.id
       WHERE o.id = ? AND o.user_id = ?`,
      [req.params.id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Parse items JSON string
    const order = {
      ...orders[0],
      items: JSON.parse(orders[0].items)
    };

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  } finally {
    connection.release();
  }
});

export default router;