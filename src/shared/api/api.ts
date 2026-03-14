import axios from "axios";
import { store } from "../../store/store";
import { setAuthData, logout } from "../../store/userSlice";
import { API_BASE_URL } from "../config/config";
import { refreshToken as refreshTokenFn } from "./index";
export const api = axios.create({
  baseURL: API_BASE_URL, // Укажите URL вашего бэкенда
});

// Интерсептор запроса: автоматически добавляет токен из Redux
api.interceptors.request.use((config) => {
  const accessToken = store.getState().user.accessToken;
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Интерсептор ответа: ловит 401 ошибку и обновляет токен
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если 401 ошибка и мы еще не пытались повторить запрос
    if (error.response?.status === 401 && originalRequest && !originalRequest._isRetry) {
      originalRequest._isRetry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // ВАЖНО: Запрос через обычный axios, чтобы не попасть в бесконечный цикл интерсепторов
        const response = await refreshTokenFn(refreshToken);

        const newAccessToken = response.accessToken;
        const newRefreshToken = response.refreshToken;
        const role = response.role;

        // Сохраняем "бэкап" в localStorage
        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Обновляем текущее состояние в Redux
        store.dispatch(setAuthData({ accessToken: newAccessToken, role: role }));

        // Повторяем упавший запрос с новым токеном
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api.request(originalRequest);
      } catch (refreshError) {
        // Рефреш токен невалиден — очищаем всё и выкидываем на логин
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
