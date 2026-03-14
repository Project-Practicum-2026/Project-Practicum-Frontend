import { api } from "./api";
import { LOGIN_URL, REGISTER_URL } from "./apiUrls";
import type { ILoginData, IRegisterData, IAuthResponse } from "./types/auth/types";

export const registerUser = async (data: IRegisterData) => {
  const response = await api.post<IAuthResponse>(REGISTER_URL, data);

  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
  };
};

export const loginUser = async (data: ILoginData) => {
  const response = await api.post<IAuthResponse>(LOGIN_URL, data);

  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
  };
};
