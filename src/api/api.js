import axios from "axios";
import { getAccessToken, getRefreshToken, set, remove } from "@/helper/session";

const apiUrl = import.meta.env.VITE_API_URL || "";
const basicAuthToken = btoa(`${import.meta.env.VITE_BASIC_AUTH_USERNAME || ""}:${import.meta.env.VITE_BASIC_AUTH_PASSWORD || ""}`);

// Instance for regular requests
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Instance for auth/basic requests
const authApi = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Basic ${basicAuthToken}`,
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle 401 & Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${apiUrl}auth/v1/refresh`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });
          
          set(data); // Save new tokens
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return api(originalRequest); // Retry original request
        } catch (refreshError) {
          remove();
          window.location.href = `${import.meta.env.BASE_URL}auth?session_expired=true`;
          return Promise.reject(refreshError);
        }
      } else {
        remove();
        window.location.href = `${import.meta.env.BASE_URL}auth?session_expired=true`;
      }
    }

    return Promise.reject(error);
  }
);

// Simplified exports
export const get = (url) => api.get(url).then(res => res.data);
export const post = (url, body) => api.post(url, body).then(res => res.data);
export const del = (url) => api.delete(url).then(res => res.data);

export const postBasic = (url, body) => authApi.post(url, body).then(res => res.data);
export const getBasic = (url) => authApi.get(url).then(res => res.data);

export default api;
