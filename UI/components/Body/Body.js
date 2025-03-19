import axios from "axios";
import React, { useEffect, useState } from "react";
import RestaurantCard, {
  promotedRestaurant,
} from "../restaurant/RestaurantCard";
import "./Body.css";
import { topMeals } from "./topMeal";

const Body = () => {
  const [search, setSearch] = useState("");
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const meals = topMeals;

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4174/api/restaurant/restaurants"
        );
        setAllRestaurants(response.data);
        setFilteredRestaurants(response.data);
      } catch (err) {
        setError("Failed to fetch restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleSearch = (e) => {
    setSearch(e);
    if (e === "") {
      setFilteredRestaurants(allRestaurants);
      return allRestaurants;
    } else {
      let filteredList = allRestaurants.filter((data) => {
        if (data.name.toLowerCase().includes(e.toLowerCase())) {
          return data;
        }
      });
      setFilteredRestaurants(filteredList);
      return filteredList;
    }
  };

  const PromotedRestaurantCard = promotedRestaurant(RestaurantCard);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="body">
      <section className="banner relative flex flex-col justify-center items-center">
        <div className="w-[50vw] z-10 text-center relative">
          <p className="text-2xl lg:text-6xl font-bold z-10 py-5 text-amber-100">
            Bite Buddy 🍔
          </p>
          <p className="z-10 text-gray-300 text-xl lg:text-4xl">
            Satisfy Your Cravings, One Bite at a Time!
          </p>
          <div className="mt-5 flex justify-center">
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search your desired restaurants.."
              className="block w-full max-w-md rounded-md bg-white px-4 py-2 text-base text-gray-900 outline-1 
                outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 
                sm:text-sm z-20 relative"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="cover"></div>
        <div className="fadeout"></div>
      </section>

      <div className="topMeals flex flex-row gap-16 justify-evenly mt-6">
        {meals.map((data, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src={data.image}
              className="w-45 h-45 rounded-full object-cover transition-transform cursor-pointer duration-300 hover:scale-110"
            />
            <span className="mt-2 text-center text-lg font-semibold">
              {data.title}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) =>
            restaurant.promoted ? (
              <PromotedRestaurantCard
                resData={restaurant}
                key={restaurant.id}
              />
            ) : (
              <RestaurantCard
                id={restaurant.id}
                resData={restaurant}
                key={restaurant.id}
              />
            )
          )
        ) : (
          <p>No Restaurants Found.</p>
        )}
      </div>
    </div>
  );
};

export default Body;
