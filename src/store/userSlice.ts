import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ERoles } from "../shared/api/types/auth/types";

interface IUserState {
  isAuth: boolean;
  accessToken: string | null;
  isAuthChecked: boolean;
  role: ERoles | null;
}

const initialState: IUserState = {
  isAuth: false,
  accessToken: null,
  isAuthChecked: false,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<{ accessToken: string; role: ERoles }>) => {
      state.isAuth = true;
      state.accessToken = action.payload.accessToken;
      state.role = action.payload.role;
    },
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    logout: (state) => {
      state.isAuth = false;
      state.accessToken = null;
      state.role = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setAuthData, setAuthChecked, logout } = userSlice.actions;
export default userSlice.reducer;
