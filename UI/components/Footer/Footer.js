import React from "react";

const Footer = () => {
  return (
    <div className="bg-yellow-50 text-black py-6 text-center mt-10">
      <p className="text-lg">
        &copy; {new Date().getFullYear()} Bitbuddy. All rights reserved.
      </p>
      <div className="flex justify-center mt-2 space-x-6">
        <a href="#" className="hover:underline">
          Privacy Policy
        </a>
        <a href="#" className="hover:underline">
          Terms of Service
        </a>
        <a href="#" className="hover:underline">
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default Footer;
