import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IUserState {
  isAuth: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: IUserState = {
  isAuth: false,
  accessToken: null,
  refreshToken: null,
};

const userSllice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setAuthData: (state: IUserState, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.isAuth = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const { setAuthData } = userSllice.actions;
export default userSllice.reducer;
