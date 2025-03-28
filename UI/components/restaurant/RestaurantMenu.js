import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DISH_IMAGE } from "../../utils/config";

const RestaurantMenu = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const restData = {
    resImage:
      "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=12.9715987&lng=77.5945627&restaurantId=466430&catalog_qa=undefined&submitAction=ENTER"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const filteredResult =
          result?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards?.filter(
            (res) => {
              if (res?.card?.card?.title) {
                return res;
              }
            }
          );

        const mappedFunction = filteredResult.reduce((acc, curr) => {
          const itemCards = curr.card.card.itemCards;
          const mappedItemCard = itemCards.map((card) => {
            return card.card.info;
          });
          acc.push({
            type: curr.card.card.title,
            itemCards: mappedItemCard,
          });
          return acc;
        }, []);

        setData(mappedFunction);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = () => {
    alert("Added to the cart");
  };

  return (
    <div className="p-4">
      <img
        className="w-full h-64 object-cover rounded-lg shadow-md"
        alt="Restaurant"
        src={restData.resImage}
      />

      <h2 className="text-2xl font-bold mt-4">Menu</h2>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4 mt-6">
          {[1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-200 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      )}

      {!loading && data && (
        <div className="flex flex-col gap-4 mt-4 w-3/4 mx-auto">
          {data?.map((menu) => {
            let isOnlyOneItem = false;
            menu.itemCards.length === 1
              ? (isOnlyOneItem = true)
              : (isOnlyOneItem = false);

            return (
              <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                <input
                  type="checkbox"
                  name="my-accordion-2"
                  defaultChecked={menu.type === "Recommended"}
                />
                <div className="collapse-title text-lg font-semibold">
                  {menu.type}
                </div>
                <div className="collapse-content">
                  <ul className="space-y-4">
                    {menu.itemCards.map((element, index) => {
                      let isLastItem = false;
                      index === menu.itemCards.length - 1
                        ? (isLastItem = true)
                        : (isLastItem = false);
                      return (
                        <>
                          <li
                            key={element.id}
                            className="flex items-center justify-between pb-2"
                          >
                            <div>
                              <h3 className="text-lg font-semibold">
                                {element.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {element.description}
                              </p>
                            </div>
                            {element?.imageId && (
                              <div className="flex flex-col items-center">
                                <img
                                  src={DISH_IMAGE + element.imageId}
                                  alt={element.name}
                                  className="w-20 h-20 object-cover rounded-lg shadow-sm"
                                />
                                <button
                                  className="mt-2 px-3 py-1 text-sm font-semibold bg-yellow-500 text-white rounded-md cursor-pointer"
                                  onClick={() => handleAddToCart()}
                                >
                                  ADD
                                </button>
                              </div>
                            )}
                          </li>
                          {!isOnlyOneItem && !isLastItem && (
                            <div className="divider"></div>
                          )}
                        </>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
