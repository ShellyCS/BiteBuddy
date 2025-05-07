// src/components/Cart.tsx
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  removeItem,
  selectCartTotal,
  removeEntireItem,
} from "../utils/cartSlice";

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux cart state
  const cartItems = useSelector((store) => store.cart.items);
  const total = useSelector(selectCartTotal);
  
  // Calculate total quantity across all items
  const itemQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const handleAddQty = (item) => {
    dispatch(addItem(item));
  };

  const handleRemoveQty = (id) => {
    dispatch(removeItem(id));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeEntireItem(id));
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to checkout");
      navigate("/login");
      return;
    }
    
    // Close cart and navigate to checkout page
    setIsOpen(false);
    navigate("/checkout");
  };

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={toggleCart}
        className="fixed bottom-4 right-4 bg-yellow-500 text-white p-3 rounded-full shadow-lg hover:bg-yellow-600 transition-colors z-50"
      >
        <ShoppingCart className="h-6 w-6" />
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {itemQty}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button
              onClick={toggleCart}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-grow overflow-y-auto p-4">
            {!cartItems.length ? (
              <p className="text-center text-gray-500 my-8">
                Your cart is empty
              </p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
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
                      <span className="mx-2">{item.quantity}</span>
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
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-yellow-500">
                ${total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={!cartItems.length}
              className="w-full bg-yellow-500 text-white py-3 px-4 rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-2"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={toggleCart}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleCart}
        ></div>
      )}
    </>
  );
}