// src/pages/Checkout.tsx
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { orders as ordersApi, restaurants as restaurantsApi } from "../lib/api";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  clearCart,
  removeEntireItem,
  removeItem,
  selectCartTotal,
} from "../utils/cartSlice";

interface SuggestedItem {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  restaurantId: number;
}

export default function Checkout() {
  // const { cart, removeItem, updateQuantity, clearCart, addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [suggestedItems, setSuggestedItems] = useState<SuggestedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantInfo, setRestaurantInfo] = useState<any>(null);
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart.items);
  const total = useSelector(selectCartTotal);

  useEffect(() => {
    if (!cart.restaurantId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch restaurant details
        const restaurantResponse = await restaurantsApi.getById(
          cart.restaurantId.toString()
        );
        setRestaurantInfo(restaurantResponse.data);

        // Extract current categories from cart items
        const currentCategories = new Set();
        cart.forEach((item) => {
          // We would need to know the category of each item
          // For now, we'll get suggestions based on restaurant
          currentCategories.add("placeholder");
        });

        // Get suggested items from the same restaurant but different categories
        const suggested = restaurantResponse.data.menu
          .flatMap((category) => category.items)
          .filter(
            (item) =>
              // Don't suggest items already in cart
              !cart.some((cartItem) => cartItem.id === item.id)
          )
          .slice(0, 4); // Limit to 4 suggestions

        setSuggestedItems(
          suggested.map((item) => ({
            ...item,
            restaurantId: cart.restaurantId,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load suggestions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cart.restaurantId, cart.items]);

  const handleAddQty = (item) => {
    // dispatch an action
    dispatch(addItem(item));
  };

  const handleRemoveQty = (id) => {
    dispatch(removeItem(id));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeEntireItem(id));
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    try {
      const orderItems = cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      await ordersApi.create({
        restaurantId: cart.restaurantId,
        items: orderItems,
        total: cart.total,
      });

      toast.success("Order placed successfully!");
      dispatch(clearCart());
      navigate("/profile");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/"
          className="flex items-center text-gray-600 hover:text-yellow-500"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Continue Shopping
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/"
            className="bg-yellow-500 text-white py-3 px-6 rounded-md hover:bg-yellow-600 transition-colors"
          >
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {restaurantInfo && (
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center">
                    <img
                      src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_100,h_100,c_fit/${restaurantInfo.cloudinaryImageId}`}
                      alt={restaurantInfo.name}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/100?text=Restaurant";
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-lg">
                        {restaurantInfo.name}
                      </h3>
                      <p className="text-gray-600">{restaurantInfo.address}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cart Items List */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-yellow-500">
                        ${(item.price / 30).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleRemoveQty(item.id)}
                        className="p-1 bg-gray-200 rounded-full"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="mx-2 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleAddQty(item)}
                        className="p-1 bg-gray-200 rounded-full"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="ml-3 text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Items */}
            {suggestedItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">You Might Also Like</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                        <p className="text-yellow-500">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => {
                          // addItem(
                          //   {
                          //     id: item.id,
                          //     restaurantId: item.restaurantId,
                          //     name: item.name,
                          //     price: item.price,
                          //   },
                          //   1
                          // );
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
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Payment Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹12.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(total * 0.05)?.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(total + 12 + total * 0.05)?.toFixed(2)}</span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-yellow-500 text-white py-3 px-4 rounded-md hover:bg-yellow-600 transition-colors"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
