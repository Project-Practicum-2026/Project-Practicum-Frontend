import axios from "axios";
import { store } from "../../store/store";
import { setAuthData, logout } from "../../store/userSlice";
import { refreshToken as refreshTokenFn } from "./index";
export const api = axios.create({});

api.interceptors.request.use((config) => {
  const accessToken = store.getState().user.accessToken;
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._isRetry) {
      originalRequest._isRetry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await refreshTokenFn(refreshToken);

        const newAccessToken = response.accessToken;
        const newRefreshToken = response.refreshToken;
        const role = response.role;

        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        store.dispatch(setAuthData({ accessToken: newAccessToken, role: role }));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api.request(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
