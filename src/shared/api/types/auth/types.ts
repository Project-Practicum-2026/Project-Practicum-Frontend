export interface IRegisterData {
  email: string;
  password: string;
  fullName: string;
  role: ERoles;
}

export interface IAuthResponse {
  refresh_token: string;
  access_token: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export enum ERoles {
  MANAGER = "manager",
  DRIVER = "driver",
}
