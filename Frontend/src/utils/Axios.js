import axios from "axios";
import { useUserStore } from "../stores/useUserStore.js";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Attach interceptor to the custom Axios instance
Axios.interceptors.response.use(
  (response) => response, // Pass successful responses as-is
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 and the request has not already been retried
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshToken, logout } = useUserStore.getState(); 
      try {
        await refreshToken();
        return Axios(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError); // Reject with the refresh error
      }
    }

    // For other errors, reject the promise as-is
    return Promise.reject(error);
  }
);

export default Axios;
