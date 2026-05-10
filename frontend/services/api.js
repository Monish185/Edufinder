import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
  timeout: 15000,
});

API.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const { token } = JSON.parse(userData);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (_) {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally — redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
