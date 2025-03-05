import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    type: "diner",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );
        localStorage.setItem("token", response.data.token);
        // alert("Login successful!");
        navigate("/Body");
      } else {
        // Sign up API call
        await axios.post("http://localhost:5000/api/auth/signup", formData);
        // alert("Signup successful! Please login.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-primary-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-primary-500"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-primary-500"
                >
                  <option value="diner">Diner</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-black rounded-md shadow-sm text-sm font-medium text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isLogin ? "Sign in" : "Sign up"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 text-red-500 text-center">{error}</div>
          )}

          <div className="mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-center text-sm text-yellow-500 hover:text-yellow-600"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// pace mail: test@1234
// sameer: test@111
// om: omtest@123
