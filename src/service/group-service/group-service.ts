import { useAuth } from "@/store/authStore";
import axios from "axios";
import { refreshApi } from "./refreshApi";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

let isRefreshing = false;
let subscribers: Array<(token: string | null) => void> = [];

api.interceptors.request.use((config) => {
  const token = useAuth.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribers.push((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await refreshApi.post("/auth/refresh");

        if (data?.accessToken) {
          useAuth.getState().login(data.accessToken);
          subscribers.forEach((cb) => cb(data.accessToken));
          subscribers = [];
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } else {
          useAuth.getState().logout();
          window.location.href = "/login";
          return Promise.reject(new Error("No token"));
        }
      } catch (err) {
        console.error("Refresh token error:", err);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
