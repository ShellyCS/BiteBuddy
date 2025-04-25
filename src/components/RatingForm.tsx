import { useState } from "react";
import { toast } from "react-hot-toast";
import { Star } from "lucide-react";
import { ratings } from "../lib/api"; // Replace with actual API service

export default function RatingForm({ restaurantId }: { restaurantId: number }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ratings.create({ restaurantId, rating, comment });
      toast.success("Thanks for your feedback!");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error("Failed to submit rating.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer ${
              rating >= star ? "text-yellow-500" : "text-gray-300"
            }`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>

      <textarea
        placeholder="Leave a comment (optional)"
        className="w-full border border-gray-300 rounded-md p-2"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        type="submit"
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        Submit Rating
      </button>
    </form>
  );
}
