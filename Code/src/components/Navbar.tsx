import {
  Home,
  LogOut,
  MessageCircle,
  Ticket,
  User,
  Utensils,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path
      ? "text-yellow-500"
      : "text-gray-700 hover:text-yellow-500";
  };

  const toTitleCase = (str: string) =>
    str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    );

  return (
    <nav className="bg-yellow-50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <Utensils className="h-8 w-8 text-yellow-500" />
              <span className="ml-2 text-xl font-bold text-gray-800">
                BiteBuddy
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className={`flex items-center ${isActive("/")}`}>
                <Home className="h-5 w-5 mr-1" />
                <span>Home</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/contact"
                className={`flex items-center ${isActive("/contact")}`}
              >
                <MessageCircle className="h-5 w-5 mr-1" />
                <span>Contact Us</span>
              </Link>
            </div>
            {user?.role === "diner" && (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/support"
                  className={`flex items-center ${isActive("/support")}`}
                >
                  <Ticket className="h-5 w-5 mr-1" />
                  <span>Support</span>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to={user.role === "restaurant" ? "/dashboard" : "/profile"}
                  className={`flex items-center ${isActive(
                    user.role === "restaurant" ? "/dashboard" : "/profile"
                  )}`}
                >
                  <User className="h-5 w-5 mr-1" />
                  <span>
                    {user.fullName ? toTitleCase(user.fullName) : user.email}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-yellow-500"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${isActive(
                    "/login"
                  )} px-4 py-2 rounded-md hover:bg-gray-100`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
