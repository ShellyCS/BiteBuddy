import express from 'express';
import pool from '../config/db.js';
import { isRestaurantOwner, verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all restaurants
router.get('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [restaurants] = await connection.execute(
      'SELECT * FROM restaurant'
    );

    const formattedRestaurants = restaurants.map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      cuisine: restaurant.cuisines,
      rating: restaurant.avgRating,
      priceRange: `${'$'.repeat(Math.ceil(restaurant.costForTwo / 15000))}`,
      deliveryTime: restaurant.deliveryTime,
      promoted: restaurant.promoted || false,
      image: restaurant.cloudinaryImageId,
      cloudinaryImageId: restaurant.cloudinaryImageId
    }));

    res.json(formattedRestaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
  } finally {
    connection.release();
  }
});

// Get restaurant profile (for restaurant owners)
router.get('/profile/:id', verifyToken, isRestaurantOwner, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [restaurants] = await connection.execute(
      `SELECT r.*, u.email, u.fullName
       FROM restaurant r
       JOIN users u ON u.restaurant_id = r.id
       WHERE r.id = ? AND u.id = ?`,
      [req.params.id, req.user.id]
    );

    if (restaurants.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const restaurant = restaurants[0];

    // Get menu items
    const [menuItems] = await connection.execute(
      'SELECT * FROM menu_items WHERE restaurant_id = ? ORDER BY category',
      [req.params.id]
    );

    // Get recent orders
    const [orders] = await connection.execute(
      `SELECT o.*, u.email as customer_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.restaurant_id = ?
       ORDER BY o.timestamp DESC
       LIMIT 5`,
      [req.params.id]
    );

    // Get recent reservations
    const [reservations] = await connection.execute(
      `SELECT *
       FROM reservations
       WHERE restaurant_id = ?
       ORDER BY date DESC, time DESC
       LIMIT 5`,
      [req.params.id]
    );

    res.json({
      ...restaurant,
      menuItems,
      recentOrders: orders,
      recentReservations: reservations
    });
  } catch (error) {
    console.error('Error fetching restaurant profile:', error);
    res.status(500).json({ message: 'Error fetching restaurant profile', error: error.message });
  } finally {
    connection.release();
  }
});

// Get restaurant by ID with menu items
router.get('/:id', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [restaurants] = await connection.execute(
      'SELECT * FROM restaurant WHERE id = ?',
      [req.params.id]
    );

    if (restaurants.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const [menuItems] = await connection.execute(
      'SELECT * FROM menu_items WHERE restaurant_id = ? ORDER BY category',
      [req.params.id]
    );

    const restaurant = restaurants[0];
    
    // Group menu items by category
    const menuByCategory = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    restaurant.menu = Object.entries(menuByCategory).map(([category, items]) => ({
      category,
      items
    }));

    res.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ message: 'Error fetching restaurant', error: error.message });
  } finally {
    connection.release();
  }
});

// Update restaurant profile
router.put('/profile/:id', verifyToken, isRestaurantOwner, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { name, address, cuisines, costForTwo, city, area, deliveryTime } = req.body;

    await connection.beginTransaction();

    // Verify restaurant ownership
    const [restaurants] = await connection.execute(
      `SELECT r.id 
       FROM restaurant r
       JOIN users u ON u.restaurant_id = r.id
       WHERE r.id = ? AND u.id = ?`,
      [req.params.id, req.user.id]
    );

    if (restaurants.length === 0) {
      await connection.rollback();
      return res.status(403).json({ message: 'Not authorized to update this restaurant' });
    }

    await connection.execute(
      `UPDATE restaurant 
       SET name = ?, address = ?, cuisines = ?, costForTwo = ?, 
           city = ?, area = ?, deliveryTime = ?
       WHERE id = ?`,
      [name, address, cuisines, costForTwo, city, area, deliveryTime, req.params.id]
    );

    await connection.commit();

    // Fetch updated restaurant data
    const [updatedRestaurant] = await connection.execute(
      'SELECT * FROM restaurant WHERE id = ?',
      [req.params.id]
    );

    res.json(updatedRestaurant[0]);
  } catch (error) {
    await connection.rollback();
    console.error('Error updating restaurant profile:', error);
    res.status(500).json({ message: 'Error updating restaurant profile', error: error.message });
  } finally {
    connection.release();
  }
});

// Get restaurant menu items
router.get('/:id/menu', verifyToken, isRestaurantOwner, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [menuItems] = await connection.execute(
      'SELECT * FROM menu_items WHERE restaurant_id = ? ORDER BY category',
      [req.params.id]
    );

    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Error fetching menu items', error: error.message });
  } finally {
    connection.release();
  }
});

// Add menu item
router.post('/:id/menu', verifyToken, isRestaurantOwner, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { name, price, description, category } = req.body;

    await connection.beginTransaction();

    const [result] = await connection.execute(
      'INSERT INTO menu_items (restaurant_id, name, price, description, category) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, name, price, description, category]
    );

    await connection.commit();
    res.status(201).json({ 
      id: result.insertId,
      name,
      price,
      description,
      category
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error adding menu item:', error);
    res.status(500).json({ message: 'Error adding menu item', error: error.message });
  } finally {
    connection.release();
  }
});

// Update menu item
router.put('/:id/menu/:itemId', verifyToken, isRestaurantOwner, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { name, price, description, category } = req.body;

    await connection.beginTransaction();

    await connection.execute(
      'UPDATE menu_items SET name = ?, price = ?, description = ?, category = ? WHERE id = ? AND restaurant_id = ?',
      [name, price, description, category, req.params.itemId, req.params.id]
    );

    await connection.commit();
    res.json({ message: 'Menu item updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Error updating menu item', error: error.message });
  } finally {
    connection.release();
  }
});

// Delete menu item
router.delete('/:id/menu/:itemId', verifyToken, isRestaurantOwner, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute(
      'DELETE FROM menu_items WHERE id = ? AND restaurant_id = ?',
      [req.params.itemId, req.params.id]
    );

    await connection.commit();
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Error deleting menu item', error: error.message });
  } finally {
    connection.release();
  }
});

export default router;