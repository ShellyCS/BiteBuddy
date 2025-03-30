import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Phone className="w-6 h-6 text-primary-500 mr-4" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="w-6 h-6 text-primary-500 mr-4" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600">support@bitebuddy.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 text-primary-500 mr-4" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-gray-600">
                        123 Food Street<br />
                        Cuisine City, FC 12345<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow-sm p-4">
              <summary className="font-medium cursor-pointer">How do I place an order?</summary>
              <p className="mt-2 text-gray-600">Browse restaurants, select your items, add them to cart, and proceed to checkout. You can track your order status in real-time.</p>
            </details>
            <details className="bg-white rounded-lg shadow-sm p-4">
              <summary className="font-medium cursor-pointer">What payment methods do you accept?</summary>
              <p className="mt-2 text-gray-600">We accept all major credit cards, digital wallets, and cash on delivery in select areas.</p>
            </details>
            <details className="bg-white rounded-lg shadow-sm p-4">
              <summary className="font-medium cursor-pointer">How can I become a restaurant partner?</summary>
              <p className="mt-2 text-gray-600">Visit our "Be a Seller" page to learn about partnership opportunities and register your restaurant.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}