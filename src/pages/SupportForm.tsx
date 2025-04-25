import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { restaurants, support } from "../lib/api"; // Import restaurants API too

export default function SupportForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [restaurantList, setRestaurantList] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await restaurants.getAll();
      setRestaurantList(res.data);
    } catch (error) {
      toast.error("Failed to load restaurants");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId) {
      toast.error("Please select a restaurant");
      return;
    }
    try {
      await support.create({ subject, message, restaurantId });
      toast.success("Support ticket submitted!");
      setSubject("");
      setMessage("");
      setRestaurantId("");
    } catch {
      toast.error("Failed to submit ticket.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">Submit Support Ticket</h2>

      <select
        value={restaurantId}
        onChange={(e) => setRestaurantId(e.target.value)}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Select Restaurant</option>
        {restaurantList.map((rest) => (
          <option key={rest.id} value={rest.id}>
            {rest.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <textarea
        placeholder="Describe your issue..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border p-2 rounded"
        rows={4}
        required
      />
      <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
        Submit
      </button>
    </form>
  );
}
