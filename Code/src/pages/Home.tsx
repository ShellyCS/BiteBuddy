import { Clock, MapPin, Search, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { restaurants as restaurantsApi } from '../lib/api';

interface Restaurant {
  id: number;
  name: string;
  cloudinaryImageId: string;
  address: string;
  description: string;
  rating?: number;
  priceRange?: string;
  cuisine?: string;
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantsApi.getAll();
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          alt="Food"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find Your Next Favorite Restaurant
            </h1>
            <div className="max-w-xl mx-auto px-4">
              <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search for restaurants or cuisines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-6 py-3 focus:outline-none"
                />
                <button className="bg-yellow-500 text-white px-6 py-3 flex items-center">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Popular Restaurants</h2>
        {loading ? (
          <div className="text-center py-8">Loading restaurants...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredRestaurants.map(restaurant => (
              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.id}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-36">
                  <img
                    src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200,h_200,c_fit/${restaurant.cloudinaryImageId}`}
                    alt="Restaurant Image"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80";
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded text-sm font-semibold">
                    {restaurant.priceRange || '$$'}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-semibold mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-2">{restaurant.cuisine || 'Various Cuisines'}</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{restaurant.rating || '4.5'}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{restaurant.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Open</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
