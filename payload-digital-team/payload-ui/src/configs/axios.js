import axios from "axios";
import { useAuthStore } from "@/store/auth_store";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  withCredentials: true,
});

// Add a request interceptor to include the access token in the Authorization header
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore(); // Access the auth store
    const accessToken = authStore.auth.access_token;

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`; // Add the token to the Authorization header
    }

    if (!config.url.includes(import.meta.env.VITE_API_URL)) {
      config.url = import.meta.env.VITE_API_URL + config.url;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  },
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();

    if (
      error.response?.status === 401 &&
      !error.config._retry &&
      !error.config.url.includes("refresh-token") &&
      !error.config.url.includes("login")
    ) {
      try {
        error.config._retry = true;
        await authStore.refreshToken(); // Attempt to refresh token
        console.log("Retry : ", error.config);
        return api(error.config); // Retry the request
      } catch (error) {
        console.error(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
