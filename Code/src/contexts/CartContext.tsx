// src/contexts/CartContext.tsx
import React, { createContext, useContext, useEffect, useReducer } from 'react';

type CartItem = {
  id: number;
  restaurantId: number;
  name: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  restaurantId: number | null;
  total: number;
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  restaurantId: null,
  total: 0
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      // If we're adding an item from a different restaurant, clear the cart first
      if (state.restaurantId !== null && state.restaurantId !== action.payload.restaurantId) {
        return {
          items: [action.payload],
          restaurantId: action.payload.restaurantId,
          total: action.payload.price * action.payload.quantity
        };
      }

      // Check if the item is already in the cart
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex > -1) {
        // Update quantity if the item is already in the cart
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        
        return {
          ...state,
          items: updatedItems,
          restaurantId: action.payload.restaurantId,
          total: calculateTotal(updatedItems)
        };
      } else {
        // Add new item to cart
        const updatedItems = [...state.items, action.payload];
        return {
          ...state,
          items: updatedItems,
          restaurantId: action.payload.restaurantId,
          total: calculateTotal(updatedItems)
        };
      }

    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload.id);
      return {
        ...state,
        items: filteredItems,
        restaurantId: filteredItems.length > 0 ? state.restaurantId : null,
        total: calculateTotal(filteredItems)
      };

    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

type CartContextType = {
  cart: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState, () => {
    // Load cart from localStorage on initialization
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : initialState;
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity } });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};