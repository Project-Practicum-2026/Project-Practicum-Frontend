import { API_BASE_URL } from "../config/config";

export const REGISTER_URL = `${API_BASE_URL}/auth/register`;
export const LOGIN_URL = `${API_BASE_URL}/auth/token`;

export const REFRESH_URL = `${API_BASE_URL}/auth/refresh`;

export const GET_USER_URL = `${API_BASE_URL}/auth/me`;

export const GET_TRIPS_URL = `${API_BASE_URL}/trips`;

export const GET_TRIP_URL = (id: string) => `${API_BASE_URL}/trips/${id}`;
