import { Toaster } from "react-hot-toast";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Provider } from "react-redux";

// Pages
import AboutUs from "./pages/AboutUs";
import CampaignList from "./pages/CampaignList";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import RestaurantDetail from "./pages/RestaurantDetail";
import appStore from "./utils/appStore";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <Register />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["restaurant"]}>
            <RestaurantDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/contact" element={<Contact />} />
      <Route path="/restaurant/:id" element={<RestaurantDetail />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["diner"]}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route
        path="/restaurant/:id/campaigns"
        element={
          <ProtectedRoute allowedRoles={["restaurant"]}>
            <CampaignList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute allowedRoles={["diner"]}>
            <Checkout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={appStore}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Navbar />
              <main className="flex-grow container mx-auto px-4 py-8">
                <AppRoutes />
              </main>
              <Footer />
              <Cart />
              <Toaster position="top-right" />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;
