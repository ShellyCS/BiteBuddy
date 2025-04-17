import { format } from 'date-fns';
import { Clock, Edit2, Menu, PlusCircle, Settings, Trash2, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { restaurants as restaurantsApi } from '../lib/api';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
}

interface RestaurantProfile {
  id: number;
  name: string;
  address: string;
  cuisines: string;
  costForTwo: number;
  city: string;
  area: string;
  deliveryTime: number;
  menuItems: MenuItem[];
  recentOrders: any[];
  recentReservations: any[];
}

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('menu');
  const [profile, setProfile] = useState<RestaurantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: 0,
    description: '',
    category: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await restaurantsApi.getProfile(user.restaurantId);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load restaurant profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await restaurantsApi.addMenuItem(user.restaurantId, newMenuItem);
      toast.success('Menu item added successfully');
      fetchProfile();
      setNewMenuItem({ name: '', price: 0, description: '', category: '' });
    } catch (error) {
      toast.error('Failed to add menu item');
    }
  };

  const handleUpdateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenuItem) return;
    
    try {
      await restaurantsApi.updateMenuItem(user.restaurantId, editingMenuItem.id.toString(), editingMenuItem);
      toast.success('Menu item updated successfully');
      fetchProfile();
      setEditingMenuItem(null);
    } catch (error) {
      toast.error('Failed to update menu item');
    }
  };

  const handleDeleteMenuItem = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
      await restaurantsApi.deleteMenuItem(user.restaurantId, itemId.toString());
      toast.success('Menu item deleted successfully');
      fetchProfile();
    } catch (error) {
      toast.error('Failed to delete menu item');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const { data } = await restaurantsApi.updateProfile(user.restaurantId, {
        name: profile.name,
        address: profile.address,
        cuisines: profile.cuisines,
        costForTwo: profile.costForTwo,
        city: profile.city,
        area: profile.area,
        deliveryTime: profile.deliveryTime
      });
      setProfile(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'menu':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Menu Items</h3>
              <button 
                onClick={() => setEditingMenuItem(null)}
                className="flex items-center text-yellow-500 hover:text-yellow-600"
              >
                <PlusCircle className="h-5 w-5 mr-1" />
                Add Item
              </button>
            </div>

            {/* Add/Edit Menu Item Form */}
            <form 
              onSubmit={editingMenuItem ? handleUpdateMenuItem : handleAddMenuItem}
              className="bg-gray-50 p-4 rounded-lg mb-6"
            >
              <h4 className="font-semibold mb-4">
                {editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editingMenuItem ? editingMenuItem.name : newMenuItem.name}
                    onChange={(e) => editingMenuItem 
                      ? setEditingMenuItem({ ...editingMenuItem, name: e.target.value })
                      : setNewMenuItem({ ...newMenuItem, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={editingMenuItem ? editingMenuItem.category : newMenuItem.category}
                    onChange={(e) => editingMenuItem
                      ? setEditingMenuItem({ ...editingMenuItem, category: e.target.value })
                      : setNewMenuItem({ ...newMenuItem, category: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    value={editingMenuItem ? editingMenuItem.price : newMenuItem.price}
                    onChange={(e) => editingMenuItem
                      ? setEditingMenuItem({ ...editingMenuItem, price: parseFloat(e.target.value) })
                      : setNewMenuItem({ ...newMenuItem, price: parseFloat(e.target.value) })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={editingMenuItem ? editingMenuItem.description : newMenuItem.description}
                    onChange={(e) => editingMenuItem
                      ? setEditingMenuItem({ ...editingMenuItem, description: e.target.value })
                      : setNewMenuItem({ ...newMenuItem, description: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                {editingMenuItem && (
                  <button
                    type="button"
                    onClick={() => setEditingMenuItem(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                >
                  {editingMenuItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>

            {/* Menu Items List */}
            <div className="grid gap-4 md:grid-cols-2">
              {profile?.menuItems.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-gray-600">{item.description}</p>
                      <p className="text-yellow-500 font-semibold">${Number(item.price).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingMenuItem(item)}
                        className="text-gray-600 hover:text-yellow-500"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="text-gray-600 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {profile?.recentOrders.map(order => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.customer_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        try {
                          const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                          return Array.isArray(items)
                            ? items.map((item: any, index: number) => (
                                <div key={index}>{item.name}</div>
                              ))
                            : "No items";
                        } catch {
                          return "No items";
                        }
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        try {
                          const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                          return Array.isArray(items)
                            ? items.map((item: any, index: number) => (
                                <div key={index}>{item.quantity}</div>
                              ))
                            : "No items";
                        } catch {
                          return "No items";
                        }
                      })()}
                    </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">{order.items}</td> */}
                      <td className="px-6 py-4 whitespace-nowrap">${order.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'reservations':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Table Reservations</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guests
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {profile?.recentReservations.map(reservation => (
                    <tr key={reservation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{reservation.customer_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {format(new Date(reservation.date), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {format(new Date(`2000-01-01T${reservation.time}`), 'h:mm a')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{reservation.guests}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reservation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Restaurant Settings</h3>
            {profile && (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cuisines</label>
                    <input
                      type="text"
                      value={profile.cuisines}
                      onChange={(e) => setProfile({ ...profile, cuisines: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cost for Two</label>
                    <input
                      type="number"
                      value={profile.costForTwo}
                      onChange={(e) => setProfile({ ...profile, costForTwo: parseInt(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Delivery Time (minutes)</label>
                    <input
                      type="number"
                      value={profile.deliveryTime}
                      onChange={(e) => setProfile({ ...profile, deliveryTime: parseInt(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Area</label>
                    <input
                      type="text"
                      value={profile.area}
                      onChange={(e) => setProfile({ ...profile, area: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Restaurant Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('menu')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'menu'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Menu className="h-5 w-5 mr-2" />
              Menu Management
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'orders'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Clock className="h-5 w-5 mr-2" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'reservations'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="h-5 w-5 mr-2" />
              Reservations
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'settings'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </button>
          </nav>
        </div>
        <div className="md:col-span-3 bg-white rounded-lg shadow p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}