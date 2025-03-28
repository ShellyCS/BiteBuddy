import { useState } from "react";

const ManageFAQ = () => {
  const faqs = [
    {
      id: 1,
      question: "How does BiteBuddy work?",
      answer:
        "BiteBuddy connects you with local restaurants for quick food delivery.",
    },
    {
      id: 2,
      question: "Can I track my order?",
      answer: "Yes, you can track your order in real-time through the app.",
    },
    {
      id: 3,
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards, PayPal, and digital wallets.",
    },
    {
      id: 4,
      question: "Can I cancel my order?",
      answer:
        "Yes, you can cancel before the restaurant starts preparing your food.",
    },
  ];

  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="border border-gray-200 rounded-xl">
            <button
              className="w-full text-left p-4 text-lg font-medium flex justify-between items-center  cursor-pointer transition-all duration-300 hover:bg-gray-100 rounded-xl"
              onClick={() => toggleFAQ(faq.id)}
            >
              <span className="text-gray-900">{faq.question}</span>
              <span
                className={`text-gray-500 text-xl transition-transform duration-300 ${
                  openFAQ === faq.id ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openFAQ === faq.id ? "max-h-40 p-4" : "max-h-0"
              }`}
            >
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageFAQ;
