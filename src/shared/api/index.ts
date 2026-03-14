import axios from "axios";
import { api } from "./api";
import { GET_USER_URL, LOGIN_URL, REFRESH_URL, REGISTER_URL } from "./apiUrls";
import type { ILoginData, IRegisterData, IAuthResponse, IUserInfo } from "./types/auth/types";

export const registerUser = async (data: IRegisterData) => {
  const response = await api.post<IAuthResponse>(REGISTER_URL, data);

  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    role: response.data.role,
  };
};

export const loginUser = async (data: ILoginData) => {
  const response = await api.post<IAuthResponse>(LOGIN_URL, data);

  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    role: response.data.role,
  };
};

export const getUserInfo = async () => {
  const response = await api.get<IUserInfo>(GET_USER_URL);

  return {
    id: response.data.id,
    email: response.data.email,
    fullName: response.data.fullName,
    role: response.data.role,
    isActive: response.data.is_active,
  };
};

export const refreshToken = async (refreshToken: string) => {
  const response = await axios.post(REFRESH_URL, { refresh_token: refreshToken });
  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    role: response.data.role,
  };
};
