import axios from "axios";
import { api } from "./api";
import {
  GET_TRIPS_URL,
  GET_USER_URL,
  LOGIN_URL,
  REFRESH_URL,
  REGISTER_URL,
  GET_WAREHOUSES_URL,
  GET_AVAILABLE_ROUTES_URL,
  GET_ROUTE_DETAIL_URL,
  TAKE_ROUTE_URL,
  UPDATE_TRIP_STATUS_URL,
  GET_TRIP_DETAIL_URL,
  GET_DRIVERS_URL,
  ADD_DRIVER_URL,
  UPDATE_DRIVER_URL,
  DELETE_DRIVER_URL,
  UPDATE_DRIVER_STATUS_URL,
  GET_ALL_WAREHOUSES_URL,
  ADD_WAREHOUSE_URL,
  UPDATE_WAREHOUSE_URL,
  DELETE_WAREHOUSE_URL,
  GET_VEHICLES_URL,
  ADD_VEHICLE_URL,
  UPDATE_VEHICLE_URL,
  DELETE_VEHICLE_URL,
  GET_VEHICLE_TYPES_URL,
  UPDATE_VEHICLE_STATUS_URL,
  UPDATE_VEHICLE_TYPE_URL,
  DELETE_VEHICLE_TYPE_URL,
  GET_CARGOS_URL,
  GET_FLEET_DASHBOARD_URL,
  ADD_VEHICLE_TYPE_URL,
  CREATE_TRIP_URL,
} from "./apiUrls";
import type { ILoginData, IRegisterData, IAuthResponse, IUserInfo } from "./types/auth/types";
import type { IRouteTask } from "./types/routes/types";
import type {
  IWarehouseResponse,
  IRouteResponse,
  IRouteDetailResponse,
  ITripResponse,
  ITripDetailResponse,
  ITakeRouteRequest,
  ITripStatusUpdate,
} from "./types/driver/types";

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
    full_name: response.data.full_name,
    role: response.data.role,
    is_active: response.data.is_active,
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

export const getTrips = async () => {
  const response = await api.get<IRouteTask[]>(GET_TRIPS_URL);
  return response.data;
};

// Driver API functions

export const getWarehouses = async (): Promise<IWarehouseResponse[]> => {
  const response = await api.get<IWarehouseResponse[]>(GET_WAREHOUSES_URL);
  return response.data;
};

export const getAvailableRoutes = async (warehouseId: string): Promise<IRouteResponse[]> => {
  const response = await api.get<IRouteResponse[]>(GET_AVAILABLE_ROUTES_URL(warehouseId));
  return response.data;
};

export const getRouteDetail = async (routeId: string): Promise<IRouteDetailResponse> => {
  const response = await api.get<IRouteDetailResponse>(GET_ROUTE_DETAIL_URL(routeId));
  return response.data;
};

export const takeRoute = async (routeId: string, data: ITakeRouteRequest): Promise<IRouteResponse> => {
  const response = await api.post<IRouteResponse>(TAKE_ROUTE_URL(routeId), data);
  return response.data;
};

export const getTripDetail = async (tripId: string): Promise<ITripDetailResponse> => {
  const response = await api.get<ITripDetailResponse>(GET_TRIP_DETAIL_URL(tripId));
  return response.data;
};

export const updateTripStatus = async (tripId: string, data: ITripStatusUpdate): Promise<ITripResponse> => {
  const response = await api.post<ITripResponse>(UPDATE_TRIP_STATUS_URL(tripId), data);
  return response.data;
};

// Manager driver management functions

export interface IDriverResponse {
  id: string;
  user_id: string;
  status: string;
  home_warehouse_id: string | null;
  user: {
    full_name: string;
    email: string;
    phone: string | null;
    role: string;
  };
}

export interface IDriverCreate {
  email: string;
  password: string;
  full_name: string;
  phone?: string | null;
  home_warehouse_id?: string | null;
}

export const getDrivers = async (): Promise<IDriverResponse[]> => {
  const response = await api.get<IDriverResponse[]>(GET_DRIVERS_URL);
  return response.data;
};

export const addDriver = async (data: IDriverCreate): Promise<IDriverResponse> => {
  const response = await api.post<IDriverResponse>(ADD_DRIVER_URL, data);
  return response.data;
};

export const updateDriverStatus = async (driverId: string, status: string): Promise<IDriverResponse> => {
  const response = await api.patch<IDriverResponse>(UPDATE_DRIVER_STATUS_URL(driverId), { status });
  return response.data;
};

export const updateDriver = async (driverId: string, data: Partial<IDriverCreate>): Promise<IDriverResponse> => {
  const response = await api.patch<IDriverResponse>(UPDATE_DRIVER_URL(driverId), data);
  return response.data;
};

export const deleteDriver = async (driverId: string): Promise<void> => {
  await api.delete(DELETE_DRIVER_URL(driverId));
};

// Warehouse management (manager side)

export interface IWarehouseCreate {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  contact_email: string;
  contact_phone?: string | null;
}

export const getAllWarehouses = async (): Promise<IWarehouseResponse[]> => {
  const response = await api.get<IWarehouseResponse[]>(GET_ALL_WAREHOUSES_URL);
  return response.data;
};

export const addWarehouse = async (data: IWarehouseCreate): Promise<IWarehouseResponse> => {
  const response = await api.post<IWarehouseResponse>(ADD_WAREHOUSE_URL, data);
  return response.data;
};

export const updateWarehouse = async (warehouseId: string, data: Partial<IWarehouseCreate>): Promise<IWarehouseResponse> => {
  const response = await api.patch<IWarehouseResponse>(UPDATE_WAREHOUSE_URL(warehouseId), data);
  return response.data;
};

export const deleteWarehouse = async (warehouseId: string): Promise<void> => {
  await api.delete(DELETE_WAREHOUSE_URL(warehouseId));
};

// Fleet/Vehicle management

export interface IVehicleTypeResponse {
  id: string;
  name: string;
  max_weight_kg: number;
  max_volume_m3: number;
  ors_profile: string;
}

export interface IVehicleResponse {
  id: string;
  plate_number: string;
  status: "available" | "on_trip" | "maintenance";
  vehicle_type: IVehicleTypeResponse;
  current_warehouse_id: string | null;
}

export interface IVehicleCreate {
  plate_number: string;
  vehicle_type_id: string;
  current_warehouse_id?: string | null;
}

export const getVehicles = async (): Promise<IVehicleResponse[]> => {
  const response = await api.get<IVehicleResponse[]>(GET_VEHICLES_URL);
  return response.data;
};

export const addVehicle = async (data: IVehicleCreate): Promise<IVehicleResponse> => {
  const response = await api.post<IVehicleResponse>(ADD_VEHICLE_URL, data);
  return response.data;
};

export const getVehicleTypes = async (): Promise<IVehicleTypeResponse[]> => {
  const response = await api.get<IVehicleTypeResponse[]>(GET_VEHICLE_TYPES_URL);
  return response.data;
};

export const addVehicleType = async (data: any): Promise<IVehicleTypeResponse> => {
  const response = await api.post<IVehicleTypeResponse>(ADD_VEHICLE_TYPE_URL, data);
  return response.data;
};

export const updateVehicleType = async (typeId: string, data: Partial<{ name: string; max_weight_kg: number; max_volume_m3: number; ors_profile: string }>): Promise<IVehicleTypeResponse> => {
  const response = await api.patch<IVehicleTypeResponse>(UPDATE_VEHICLE_TYPE_URL(typeId), data);
  return response.data;
};

export const deleteVehicleType = async (typeId: string): Promise<void> => {
  await api.delete(DELETE_VEHICLE_TYPE_URL(typeId));
};

export const updateVehicleStatus = async (
  vehicleId: string,
  status: "available" | "on_trip" | "maintenance"
): Promise<IVehicleResponse> => {
  const response = await api.patch<IVehicleResponse>(UPDATE_VEHICLE_STATUS_URL(vehicleId), { status });
  return response.data;
};

export const updateVehicle = async (vehicleId: string, data: Partial<IVehicleCreate>): Promise<IVehicleResponse> => {
  const response = await api.patch<IVehicleResponse>(UPDATE_VEHICLE_URL(vehicleId), data);
  return response.data;
};

export const deleteVehicle = async (vehicleId: string): Promise<void> => {
  await api.delete(DELETE_VEHICLE_URL(vehicleId));
};

export const getFleetDashboard = async () => {
  const response = await api.get(GET_FLEET_DASHBOARD_URL);
  return response.data;
};

export const getCargos = async () => {
  const response = await api.get(GET_CARGOS_URL);
  return response.data;
};

export const createTrip = async (data: any) => {
  const response = await api.post(CREATE_TRIP_URL, data);
  return response.data;
};
