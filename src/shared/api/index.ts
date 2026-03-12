import { LOGIN_URL, REGISTER_URL } from "./apiUrls";
import type { ILoginData, IRegisterData, IRegisterResponse } from "./types/auth/types";
import axios from "axios";

export const REGISTER_USER = async (data: IRegisterData) => {
  return axios.post<IRegisterResponse>(REGISTER_URL, data);
};

export const LOGIN_USER = async (data: ILoginData) => {
  return axios.post(LOGIN_URL, data);
};
