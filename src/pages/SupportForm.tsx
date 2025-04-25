import { useState } from "react";
import { toast } from "react-hot-toast";
import { support } from "../lib/api";

export default function SupportForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await support.create({ subject, message });
      toast.success("Support ticket submitted!");
      setSubject("");
      setMessage("");
    } catch {
      toast.error("Failed to submit ticket.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">Submit Support Ticket</h2>
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
