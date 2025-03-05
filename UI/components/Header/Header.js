import React from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  TableCellsIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import logo from "../../assets/logo.webp";

const Header = () => {
  return (
    <div className="flex justify-between bg-yellow-50 sticky top-0 z-50 shadow-md px-4 py-2">
      <div className="logo-container flex items-center">
        <Link to="/Body">
          <img
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20"
            src={logo}
            alt="Logo"
          />
        </Link>
        <p className="text-xl font-bold ml-2 text-gray-700">Bite Buddy 🍔</p>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center">
        <ul className="flex items-center space-x-6 text-gray-700">
          <li className="flex items-center space-x-1 hover:text-indigo-600 cursor-pointer">
            <HomeIcon className="h-5 w-5" />
            <Link to="/Body">Home</Link>
          </li>
          <li className="flex items-center space-x-1 hover:text-indigo-600 cursor-pointer">
            <UserCircleIcon className="h-5 w-5" />
            <span>About Us</span>
          </li>
          <li className="flex items-center space-x-1 hover:text-indigo-600 cursor-pointer">
            <ShoppingCartIcon className="h-5 w-5" />
            <span>Cart</span>
          </li>
          <li className="flex items-center space-x-1 hover:text-indigo-600 cursor-pointer">
            <TableCellsIcon className="h-5 w-5" />
            <Link to="/reserve">Reserve Table</Link>
          </li>
          <li className="flex items-center space-x-1 hover:text-indigo-600 cursor-pointer">
            <BuildingStorefrontIcon className="h-5 w-5" />
            <span>Be-a-seller</span>
          </li>
          <li className="flex items-center space-x-1 hover:text-indigo-600 cursor-pointer">
            <ClipboardDocumentListIcon className="h-5 w-5" />
            <span>Orders</span>
          </li>
          <li className="flex items-center space-x-1 hover:text-indigo-600 cursor-pointer">
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <Link to="/">Logout</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
