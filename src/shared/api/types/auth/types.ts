export interface IRegisterData {
  email: string;
  password: string;
  fullName: string;
  role: ERoles;
}

export interface IAuthResponse {
  refresh_token: string;
  access_token: string;
  role: ERoles;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IUserInfo {
  id: string;
  email: string;
  fullName: string;
  role: ERoles;
  is_active: boolean;
}

export enum ERoles {
  MANAGER = "manager",
  DRIVER = "driver",
}
