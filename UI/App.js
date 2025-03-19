import React from "react";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Body from "./components/Body/Body";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import ReserveTable from "./components/ReserveTable/ReserveTable";
import RestaurantDashboard from "./components/restaurant/RestaurantDashboard";
import RestaurantMenu from "./components/restaurant/RestaurantMenu";

const AppLayout = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Body" element={<Body />} />
          <Route path="/reserve" element={<ReserveTable />} />
          <Route path="/restaurant" element={<RestaurantDashboard />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/restaurant/:id" element={<RestaurantMenu />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<AppLayout />);
