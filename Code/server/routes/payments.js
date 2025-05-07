import express from 'express';
import stripe from '../config/stripe.js';
import pool from '../config/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Create a payment intent
router.post('/create-payment-intent', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { amount, orderId } = req.body;
    
    // Create a payment intent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: orderId,
        userId: req.user.id,
      },
    });

    // Save payment intent information in the database
    await connection.execute(
      'UPDATE orders SET payment_intent_id = ?, payment_status = "pending" WHERE id = ? AND user_id = ?',
      [paymentIntent.id, orderId, req.user.id]
    );

    // Return the client secret to the client
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Error creating payment intent', error: error.message });
  } finally {
    connection.release();
  }
});

// Confirm payment success (webhook)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;
      
      // Update order payment status
      await connection.execute(
        'UPDATE orders SET payment_status = "completed" WHERE payment_intent_id = ?',
        [paymentIntent.id]
      );
      
      console.log(`Payment for order ${orderId} succeeded`);
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;
      
      // Update order payment status
      await connection.execute(
        'UPDATE orders SET payment_status = "failed" WHERE payment_intent_id = ?',
        [paymentIntent.id]
      );
      
      console.log(`Payment for order ${orderId} failed`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ message: 'Error handling webhook' });
  } finally {
    connection.release();
  }
});

export default router;