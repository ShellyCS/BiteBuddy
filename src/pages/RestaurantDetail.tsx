import { Dialog, Transition } from "@headlessui/react";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Phone, Star, Users } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { reservations } from "../lib/api";

export default function RestaurantDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isSponsored, setIsSponsored] = useState(true); // 🔹 Hardcoded flag
  const [reservationData, setReservationData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    time: "19:00",
    guests: 2,
    specialRequests: "",
  });

  const restaurant = {
    id: 1,
    name: "Joe's Diner",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    cuisine: "American",
    rating: 4.5,
    address: "123 Main St",
    phone: "(555) 123-4567",
    hours: "9:00 AM - 10:00 PM",
    priceRange: "$$",
    description:
      "Classic American diner serving breakfast all day and home-style comfort food in a casual atmosphere.",
    menu: [
      {
        category: "Breakfast",
        items: [
          {
            id: 1,
            name: "Classic Breakfast",
            price: 12.99,
            description: "Eggs, bacon, toast, and hash browns",
          },
          {
            id: 2,
            name: "Pancake Stack",
            price: 10.99,
            description: "Three fluffy pancakes with maple syrup",
          },
        ],
      },
      {
        category: "Main Course",
        items: [
          {
            id: 3,
            name: "Burger",
            price: 14.99,
            description: "1/2 lb beef patty with lettuce, tomato, and fries",
          },
          {
            id: 4,
            name: "Grilled Chicken",
            price: 16.99,
            description: "Herb-marinated chicken with seasonal vegetables",
          },
        ],
      },
    ],
  };

  const handleAddToCart = (item: any) => {
    toast.success(`${item.name} added to cart!`);
  };

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
        customerName: user.displayName || "Guest",
        customerEmail: user.email || "",
        customerPhone: user.phone || "",
      });

      toast.success("Reservation submitted successfully!");
      setIsReservationModalOpen(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to submit reservation. Please try again."
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Restaurant Header */}
      <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
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
                {restaurant.rating}
              </span>
              <span className="flex items-center">
                <MapPin className="h-5 w-5 mr-1" />
                {restaurant.address}
              </span>
              <span>{restaurant.priceRange}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info + Menu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* About */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-gray-600 mb-4">{restaurant.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-2 text-gray-400" />
                {restaurant.phone}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2 text-gray-400" />
                {restaurant.hours}
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
            {restaurant.menu.map((category, index) => (
              <div key={index} className="mb-8 last:mb-0">
                <h3 className="text-xl font-semibold mb-4">
                  {category.category}
                </h3>
                <div className="grid gap-4">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start gap-4"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="font-medium text-yellow-500">
                          ${item.price.toFixed(2)}
                        </div>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-yellow-500 text-white text-sm px-3 py-1 rounded hover:bg-yellow-600 transition"
                        >
                          Add to Cart
                        </button>
                      </div>
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
          {/* Modal content (unchanged) */}
        </Dialog>
      </Transition>
    </div>
  );
}
