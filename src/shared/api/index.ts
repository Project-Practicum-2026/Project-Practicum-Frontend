import { LOGIN_URL, REGISTER_URL } from "./apiUrls";
import type { ILoginData, IRegisterData, IAuthResponse } from "./types/auth/types";
import axios from "axios";

export const registerUser = async (data: IRegisterData) => {
  return axios.post<IAuthResponse>(REGISTER_URL, data);
};

export const loginUser = async (data: ILoginData) => {
  return axios.post<IAuthResponse>(LOGIN_URL, data);
};
