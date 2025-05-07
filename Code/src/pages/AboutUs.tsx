
const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-yellow-500">About Us</h1>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to BiteBuddy</h2>
          <p className="text-gray-700 mb-4">
            BiteBuddy is a platform designed to connect food lovers with their favorite restaurants. We aim to make dining out or ordering food from your favorite local spots easier, quicker, and more enjoyable.
          </p>
          <p className="text-gray-700 mb-4">
            Our platform allows diners to explore restaurant menus, reserve tables, and interact with local businesses to make their dining experience seamless. As the developers, we are dedicated to continuously improving the user experience, ensuring convenience, and supporting local businesses.
          </p>
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Meet the Developer</h3>
          <p className="text-gray-700">
            Developed & Managed by BiteBuddy Pvt Ltd.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
