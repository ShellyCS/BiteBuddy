import { format } from "date-fns";
import { Calendar, Clock, CreditCard, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import {
  orders as ordersApi,
  reservations as reservationsApi,
} from "../lib/api";
import { useLocation } from "react-router-dom";

interface Order {
  id: number;
  restaurant_name: string;
  timestamp: string;
  status: string;
  total: number;
  items: any[];
  payment_status?: string;
  payment_intent_id?: string;
}

interface Reservation {
  id: string;
  restaurant_name: string;
  date: string;
  time: string;
  guests: number;
  status: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      fetchUserData();
      
      // Check for payment success in URL
      const queryParams = new URLSearchParams(location.search);
      const paymentSuccess = queryParams.get('payment_success');
      const orderId = queryParams.get('order_id');
      
      if (paymentSuccess === 'true' && orderId) {
        toast.success("Payment successful! Your order has been placed.");
      }
    }
  }, [user, location]);

  const fetchUserData = async () => {
    try {
      const [ordersRes, reservationsRes] = await Promise.all([
        ordersApi.getUserOrders(),
        reservationsApi.getUserReservations(),
      ]);

      setOrders(ordersRes.data);
      setReservations(reservationsRes.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      await reservationsApi.updateStatus(reservationId, "cancelled");
      toast.success("Reservation cancelled successfully");
      fetchUserData();
    } catch (error) {
      toast.error("Failed to cancel reservation");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  const renderProfile = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold">Personal Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center text-gray-600">
            <User className="h-5 w-5 mr-2 text-gray-400" />
            <span>{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Order History</h3>
      <div className="grid gap-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">You don't have any orders yet.</p>
          </div>
        ) : (
          orders.map((order) => {
            // Ensure total is a number
            const totalNum = parseFloat(order.total as any);

            // Calculate order components - ensuring we have numbers
            const subtotal = parseFloat((totalNum * 1.0).toFixed(2));
            const deliveryFee = 12;
            const tax = parseFloat((subtotal * 0.05).toFixed(2));
            const calculatedTotal = parseFloat(
              (subtotal + deliveryFee + tax).toFixed(2)
            );

            return (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">
                      {order.restaurant_name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {format(new Date(order.timestamp), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2 items-end">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                    
                    {/* Payment Status Badge */}
                    {order.payment_status && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm flex items-center ${
                          order.payment_status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.payment_status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        <CreditCard className="h-3 w-3 mr-1" />
                        {order.payment_status === "completed" 
                          ? "Paid" 
                          : order.payment_status === "failed"
                          ? "Payment Failed"
                          : "Payment Pending"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  {/* Parse and display the order items properly */}
                  <div className="space-y-2">
                    {(() => {
                      try {
                        // Try to parse the JSON string
                        const parsedItems = JSON.parse(order.items as any);

                        // Handle both array of items and single item
                        if (Array.isArray(parsedItems)) {
                          return parsedItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between py-1">
                              <div className="flex items-center">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-gray-500 ml-2">
                                  x{item.quantity || 1}
                                </span>
                              </div>
                              <span>
                                ${parseFloat(item.price / 30).toFixed(2)}
                              </span>
                            </div>
                          ));
                        } else {
                          return (
                            <div className="flex justify-between py-1">
                              <div className="flex items-center">
                                <span className="font-medium">
                                  {parsedItems.name}
                                </span>
                                <span className="text-gray-500 ml-2">
                                  x{parsedItems.quantity || 1}
                                </span>
                              </div>
                              <span>
                                ₹{parseFloat(parsedItems.price).toFixed(2)}
                              </span>
                            </div>
                          );
                        }
                      } catch (e) {
                        // If parsing fails, display it in a cleaner format
                        return (
                          <div className="py-1">
                            {typeof order.items === "string"
                              ? order.items
                                  .replace(/[{}"\\]/g, "")
                                  .replace(/,/g, ", ")
                                  .replace(/:/g, ": ")
                              : "Item information not available"}
                          </div>
                        );
                      }
                    })()}
                  </div>

                  {/* Order totals section with delivery fee and tax */}
                  <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Tax (5%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center font-semibold pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span className="text-yellow-500">
                        ${totalNum.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Retry Payment Button for Failed Payments */}
                {order.payment_status === "failed" && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button 
                      onClick={async () => {
                        try {
                          const response = await ordersApi.createPayment(order.id.toString());
                          // Redirect to a new checkout page with this order's payment intent
                          window.location.href = `/checkout?order_id=${order.id}&client_secret=${response.data.clientSecret}`;
                        } catch (error) {
                          toast.error("Failed to initialize payment. Please try again.");
                        }
                      }}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors w-full"
                    >
                      <CreditCard className="h-4 w-4 inline mr-2" />
                      Retry Payment
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const renderReservations = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">My Reservations</h3>
      <div className="grid gap-4">
        {reservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">You don't have any reservations yet.</p>
          </div>
        ) : (
          reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg">
                    {reservation.restaurant_name}
                  </h4>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                      <span>
                        {format(new Date(reservation.date), "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-2 text-gray-400" />
                      <span>
                        {format(
                          new Date(`2000-01-01T${reservation.time}`),
                          "h:mm a"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User className="h-5 w-5 mr-2 text-gray-400" />
                      <span>
                        {reservation.guests}{" "}
                        {reservation.guests === 1 ? "Guest" : "Guests"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      reservation.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : reservation.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {reservation.status}
                  </span>
                  {reservation.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                      className="text-red-500 hover:text-red-600 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">My Profile</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "profile"
                  ? "bg-yellow-100 text-yellow-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <User className="h-5 w-5 mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "orders"
                  ? "bg-yellow-100 text-yellow-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Clock className="h-5 w-5 mr-2" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab("reservations")}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "reservations"
                  ? "bg-yellow-100 text-yellow-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Reservations
            </button>
          </nav>
        </div>

        <div className="md:col-span-3">
          {activeTab === "profile" && renderProfile()}
          {activeTab === "orders" && renderOrders()}
          {activeTab === "reservations" && renderReservations()}
        </div>
      </div>
    </div>
  );
}