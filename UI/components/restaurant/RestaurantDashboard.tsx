import axios from 'axios';
import { Calendar, ChefHat, Clock, Coffee, Menu, Settings, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  id: string;  // Ensure ID is included
  name: string;
  price: number;
  description: string;
  category: string;
}

interface Order {
  id: string;
  customerName: string;
  items: { name: string; quantity: number }[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  timestamp: string;
}

const newItem: MenuItem = {
  id: Math.random().toString(), // Generate a temporary unique ID
  name: "Pizza",
  price: 10.99,
  description: "Delicious cheese pizza",
  category: "Main Course"
};


const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: 0,
    description: '',
    category: 'main'
  });

  useEffect(() => {
    // Fetch menu items from MySQL
    axios.get('/api/menuItems')
      .then(response => setMenuItems(response.data))
      .catch(error => console.error('Error fetching menu items:', error));

    // Fetch orders from MySQL
    axios.get('/api/orders')
      .then(response => setOrders(response.data))
      .catch(error => console.error('Error fetching orders:', error));
  }, []);

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/menuItems', newMenuItem);
      setNewMenuItem({ name: '', price: 0, description: '', category: 'main' });
      setMenuItems([...menuItems, newMenuItem]);
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await axios.put(`/api/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    try {
      await axios.delete(`/api/menuItems/${itemId}`);
      setMenuItems(menuItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-yellow-500" />
            <span className="text-xl font-bold">Restaurant Dashboard</span>
          </div>
        </div>
        <nav className="mt-6">
          <button onClick={() => setActiveTab('overview')} className="w-full flex items-center px-6 py-3">
            <Menu className="h-5 w-5 mr-3" /> Overview
          </button>
          <button onClick={() => setActiveTab('orders')} className="w-full flex items-center px-6 py-3">
            <Clock className="h-5 w-5 mr-3" /> Orders
          </button>
          <button onClick={() => setActiveTab('menu')} className="w-full flex items-center px-6 py-3">
            <Coffee className="h-5 w-5 mr-3" /> Menu
          </button>
          <button onClick={() => setActiveTab('reservations')} className="w-full flex items-center px-6 py-3">
            <Calendar className="h-5 w-5 mr-3" /> Reservations
          </button>
          <button onClick={() => setActiveTab('customers')} className="w-full flex items-center px-6 py-3">
            <Users className="h-5 w-5 mr-3" /> Customers
          </button>
          <button onClick={() => setActiveTab('settings')} className="w-full flex items-center px-6 py-3">
            <Settings className="h-5 w-5 mr-3" /> Settings
          </button>
        </nav>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
