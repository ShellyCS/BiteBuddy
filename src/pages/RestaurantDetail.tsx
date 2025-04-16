import { Dialog, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Phone, ShoppingBag, Star, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { reservations, restaurants as restaurantsApi } from '../lib/api';

export default function RestaurantDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSponsored, setIsSponsored] = useState(true); // 🔹 Hardcoded flag
  const [reservationData, setReservationData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '19:00',
    guests: 2,
    specialRequests: '',
    occasion: ''
  });

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const { data } = await restaurantsApi.getById(id);
        setRestaurant(data);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        toast.error('Failed to load restaurant details');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!user) {
      toast.error("You need to be logged in to make a reservation.");
      return;
    }
  
    try {
      await reservations.create({
        restaurantId: id,
        date: reservationData.date,
        time: reservationData.time,
        guests: reservationData.guests,
        occasion: reservationData.occasion || "",
        specialRequests: reservationData.specialRequests,
        customerName: user.fullName || "Guest",
        customerEmail: user.email || "",
        customerPhone: user.phone || "",
      });
  
      toast.success('Reservation submitted successfully!');
      setIsReservationModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit reservation. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-700">Restaurant not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Restaurant Header */}
      <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
        <img
          src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024,h_1024,c_fit/${restaurant.cloudinaryImageId}`}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-8 text-white w-full">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
              {restaurant.name}
              {isSponsored && (
                <span className="bg-yellow-400 text-white text-xs px-2 py-1 rounded uppercase">
                  Sponsored
                </span>
              )}
            </h1>
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                {restaurant.avgRating}
              </span>
              <span className="flex items-center">
                <MapPin className="h-5 w-5 mr-1" />
                {restaurant.address}
              </span>
              <span>{'$'.repeat(Math.ceil(restaurant.costForTwo / 15000))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* About */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-gray-600 mb-4">{restaurant.cuisines}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-2 text-gray-400" />
                Contact on App
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2 text-gray-400" />
                {restaurant.deliveryTime} min delivery time
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                {restaurant.address}
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Menu</h2>
            {restaurant.menu && restaurant.menu.map((category, index) => (
              <div key={index} className="mb-8 last:mb-0">
                <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
                <div className="grid gap-4">
                  {category.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start p-3 hover:bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="font-medium text-yellow-500">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => {
                          addItem({
                            id: item.id,
                            restaurantId: parseInt(id),
                            name: item.name,
                            price: item.price
                          }, 1);
                          toast.success(`${item.name} added to cart`);
                        }}
                        className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                      >
                        <ShoppingBag className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h3 className="text-xl font-bold mb-4">Make a Reservation</h3>
            <button
              onClick={() => setIsReservationModalOpen(true)}
              className="w-full bg-yellow-500 text-white py-3 px-4 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Reserve a Table
            </button>
          </div>

          {/* Sponsored Controls - Restaurant Role Only */}
          {user?.role === "restaurant" && (
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6 mt-[42px]">
              <h3 className="text-xl font-bold mb-4">Ad Campaign</h3>
              <button
                onClick={() => {
                  if (id) navigate(`/restaurant/${id}/campaigns`);
                }}
                className="w-full border border-yellow-500 text-yellow-600 py-3 px-4 rounded-md hover:bg-yellow-50 transition-colors"
              >
                View Ad Campaigns
              </button>

              <button
                onClick={() => setIsSponsored(!isSponsored)}
                className="mt-2 w-full bg-blue-50 text-blue-600 border border-blue-200 py-2 px-4 rounded hover:bg-blue-100 transition"
              >
                {isSponsored ? "Remove Sponsorship" : "Sponsor My Listing"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reservation Modal */}
      <Transition show={isReservationModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsReservationModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Reserve a Table
                </Dialog.Title>

                <form onSubmit={handleReservationSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <div className="mt-1 relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="date"
                        value={reservationData.date}
                        onChange={(e) => setReservationData({ ...reservationData, date: e.target.value })}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200"
                        min={format(new Date(), 'yyyy-MM-dd')}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <div className="mt-1 relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <select
                        value={reservationData.time}
                        onChange={(e) => setReservationData({ ...reservationData, time: e.target.value })}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200"
                        required
                      >
                        {Array.from({ length: 14 }, (_, i) => i + 11).map((hour) => (
                          <option key={hour} value={`${hour}:00`}>
                            {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
                    <div className="mt-1 relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <select
                        value={reservationData.guests}
                        onChange={(e) => setReservationData({ ...reservationData, guests: Number(e.target.value) })}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200"
                        required
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Special Requests</label>
                    <textarea
                      value={reservationData.specialRequests}
                      onChange={(e) => setReservationData({ ...reservationData, specialRequests: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200"
                      rows={3}
                      placeholder="Any special requests or dietary requirements?"
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsReservationModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Confirm Reservation
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}