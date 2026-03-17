import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  IWarehouseResponse,
  IRouteResponse,
  IRouteDetailResponse,
} from "../shared/api/types/driver/types";

interface IDriverState {
  selectedWarehouse: IWarehouseResponse | null;
  availableRoutes: IRouteResponse[];
  activeRouteDetail: IRouteDetailResponse | null;
  activeTripId: string | null;
  currentStopIndex: number;
}

const initialState: IDriverState = {
  selectedWarehouse: null,
  availableRoutes: [],
  activeRouteDetail: null,
  activeTripId: null,
  currentStopIndex: 0,
};

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    setSelectedWarehouse: (state, action: PayloadAction<IWarehouseResponse>) => {
      state.selectedWarehouse = action.payload;
    },
    setAvailableRoutes: (state, action: PayloadAction<IRouteResponse[]>) => {
      state.availableRoutes = action.payload;
    },
    setActiveRouteDetail: (state, action: PayloadAction<IRouteDetailResponse>) => {
      state.activeRouteDetail = action.payload;
      state.currentStopIndex = 0;
    },
    setActiveTripId: (state, action: PayloadAction<string>) => {
      state.activeTripId = action.payload;
    },
    advanceStop: (state) => {
      if (
        state.activeRouteDetail &&
        state.currentStopIndex < state.activeRouteDetail.stops.length - 1
      ) {
        state.currentStopIndex += 1;
      }
    },
    resetDriverState: () => initialState,
  },
});

export const {
  setSelectedWarehouse,
  setAvailableRoutes,
  setActiveRouteDetail,
  setActiveTripId,
  advanceStop,
  resetDriverState,
} = driverSlice.actions;

export default driverSlice.reducer;
