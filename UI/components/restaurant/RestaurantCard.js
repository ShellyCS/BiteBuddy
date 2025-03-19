import React from "react";
import { useNavigate } from "react-router-dom";

const RestaurantCard = (props) => {
  const { resData } = props;
  const {
    id,
    cloudinaryImageId,
    name,
    avgRating,
    cuisines,
    costForTwo,
    deliveryTime,
  } = resData;

  const navigate = useNavigate();

  const handleRestaurantDetails = (restId) => {
    navigate(`/restaurant/${restId}`);
  };

  return (
    <div
      className="m-1.5 p-1.5 w-2xs hover:shadow-2xl cursor-pointer"
      style={{ backgroundColor: "#f0f0f0" }}
      onClick={() => handleRestaurantDetails(id)}
    >
      <img
        className="w-full h-40 object-cover rounded-md hover:scale-105 transition-transform duration-300"
        alt="res-logo"
        src={
          "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/" +
          cloudinaryImageId
        }
      />

      <div className="mt-3 space-y-1 text-gray-800">
        <h3 className="text-lg font-semibold">{name}</h3>
        <h4 className="text-sm text-gray-600 truncate" title={cuisines}>
          {cuisines}
        </h4>
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-gray-700">₹{costForTwo / 100} FOR TWO</span>
        </div>
        <h4 className="text-gray-500 text-sm">{deliveryTime} minutes</h4>
        <span className="bg-green-500 text-white px-2 py-0.5 rounded-md">
          {avgRating} ★
        </span>
      </div>
    </div>
  );
};

export const promotedRestaurant = (RestaurantCard) => {
  return (props) => {
    return (
      <div className="relative overflow-hidden">
        <RestaurantCard {...props} />
        <div className="absolute top-0 left-0 z-40">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 shadow-md animate-pulse">
            Promoted
          </div>
        </div>
      </div>
    );
  };
};

export default RestaurantCard;
