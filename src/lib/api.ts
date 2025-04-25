import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const auth = {
  register: (data: any) => api.post("/auth/register", data),
  login: (data: any) => api.post("/auth/login", data),
};

// Restaurants API
export const restaurants = {
  getAll: () => api.get("/restaurants"),
  getById: (id: string) => api.get(`/restaurants/${id}`),
  getProfile: (id: string) => api.get(`/restaurants/profile/${id}`),
  updateProfile: (id: string, data: any) =>
    api.put(`/restaurants/profile/${id}`, data),
  getMenu: (id: string) => api.get(`/restaurants/${id}/menu`),
  addMenuItem: (id: string, data: any) =>
    api.post(`/restaurants/${id}/menu`, data),
  updateMenuItem: (id: string, itemId: string, data: any) =>
    api.put(`/restaurants/${id}/menu/${itemId}`, data),
  deleteMenuItem: (id: string, itemId: string) =>
    api.delete(`/restaurants/${id}/menu/${itemId}`),
};

// Orders API
export const orders = {
  create: (data: any) => api.post("/orders", data),
  getById: (id: string) => api.get(`/orders/${id}`),
  getUserOrders: () => api.get("/orders/user"),
  getRestaurantOrders: (restaurantId: string) =>
    api.get(`/orders/restaurant/${restaurantId}`),
  updateStatus: (orderId: string, status: string) =>
    api.put(`/orders/${orderId}/status`, { status }),
  // Stripe payment integration endpoints
  createPayment: (orderId: string) => api.post(`/orders/${orderId}/payment`),
  updatePaymentStatus: (orderId: string, status: string) =>
    api.put(`/orders/${orderId}/payment-status`, { status }),
};

// Reservations API
export const reservations = {
  create: (data: any) => api.post("/reservations", data),
  getUserReservations: () => api.get("/reservations/user"),
  getRestaurantReservations: (restaurantId: string) =>
    api.get(`/reservations/restaurant/${restaurantId}`),
  updateStatus: (reservationId: string, status: string) =>
    api.put(`/reservations/${reservationId}/status`, { status }),
};

// Campaigns API
export const campaigns = {
  getAll: () => api.get("/campaigns"),
  getById: (id: string) => api.get(`/campaigns/${id}`),
  getByRestaurantId: (restaurantId: string) =>
    api.get(`/campaigns/restaurant/${restaurantId}`),
  create: (data: any) => api.post("/campaigns", data),
  update: (id: string, data: any) => api.put(`/campaigns/${id}`, data),
  delete: (id: string) => api.delete(`/campaigns/${id}`),
  getActiveForRestaurant: (restaurantId: string) =>
    api.get(`/campaigns/restaurant/${restaurantId}/active`),
};

// Ratings API
export const ratings = {
  create: (data: any) => api.post("/ratings", data),
};

// Supprt API
export const support = {
  create: (data: any) => api.post("/support", data),
  getUserTickets: () => api.get("/support/user"),
};

export default api;
