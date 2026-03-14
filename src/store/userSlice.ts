import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IUserState {
  isAuth: boolean;
  accessToken: string | null;
  isAuthChecked: boolean;
}

const initialState: IUserState = {
  isAuth: false,
  accessToken: null,
  isAuthChecked: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.isAuth = true;
      state.accessToken = action.payload.accessToken;
    },
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    logout: (state) => {
      state.isAuth = false;
      state.accessToken = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setAuthData, setAuthChecked, logout } = userSlice.actions;
export default userSlice.reducer;
