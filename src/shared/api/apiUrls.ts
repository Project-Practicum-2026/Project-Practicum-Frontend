import { API_BASE_URL } from "../config/config";

export const REGISTER_URL = `${API_BASE_URL}/auth/register`;
export const LOGIN_URL = `${API_BASE_URL}/auth/token`;

export const REFRESH_URL = `${API_BASE_URL}/auth/refresh`;

export const GET_USER_URL = `${API_BASE_URL}/auth/me`;

export const GET_TRIPS_URL = `${API_BASE_URL}/trips`;
export const CREATE_TRIP_URL = `${API_BASE_URL}/trips`;

export const GET_TRIP_URL = (id: string) => `${API_BASE_URL}/trips/${id}`;

// Driver endpoints
export const GET_WAREHOUSES_URL = `${API_BASE_URL}/warehouses/`;
export const GET_AVAILABLE_ROUTES_URL = (warehouseId: string) =>
  `${API_BASE_URL}/routes/available?warehouses_id=${warehouseId}`;
export const GET_ROUTE_DETAIL_URL = (routeId: string) =>
  `${API_BASE_URL}/routes/${routeId}`;
export const TAKE_ROUTE_URL = (routeId: string) =>
  `${API_BASE_URL}/routes/${routeId}/take`;
export const UPDATE_TRIP_STATUS_URL = (tripId: string) =>
  `${API_BASE_URL}/trips/${tripId}/status`;
export const GET_TRIP_DETAIL_URL = (tripId: string) =>
  `${API_BASE_URL}/trips/${tripId}`;

// Manager driver endpoints
export const GET_DRIVERS_URL = `${API_BASE_URL}/drivers/`;
export const ADD_DRIVER_URL = `${API_BASE_URL}/drivers/`;
export const GET_DRIVER_URL = (driverId: string) =>
  `${API_BASE_URL}/drivers/${driverId}`;
export const UPDATE_DRIVER_URL = (driverId: string) =>
  `${API_BASE_URL}/drivers/${driverId}`;
export const DELETE_DRIVER_URL = (driverId: string) =>
  `${API_BASE_URL}/drivers/${driverId}`;
export const UPDATE_DRIVER_STATUS_URL = (driverId: string) =>
  `${API_BASE_URL}/drivers/${driverId}/status`;

// Warehouse management
export const GET_ALL_WAREHOUSES_URL = `${API_BASE_URL}/warehouses/`;
export const ADD_WAREHOUSE_URL = `${API_BASE_URL}/warehouses/`;
export const UPDATE_WAREHOUSE_URL = (warehouseId: string) =>
  `${API_BASE_URL}/warehouses/${warehouseId}`;
export const DELETE_WAREHOUSE_URL = (warehouseId: string) =>
  `${API_BASE_URL}/warehouses/${warehouseId}`;

// Fleet/Vehicle management
export const GET_VEHICLES_URL = `${API_BASE_URL}/fleet/vehicles/`;
export const ADD_VEHICLE_URL = `${API_BASE_URL}/fleet/vehicles`;
export const GET_VEHICLE_TYPES_URL = `${API_BASE_URL}/fleet/vehicle-types`;
export const ADD_VEHICLE_TYPE_URL = `${API_BASE_URL}/fleet/vehicle-types`;
export const UPDATE_VEHICLE_TYPE_URL = (typeId: string) =>
  `${API_BASE_URL}/fleet/vehicle-types/${typeId}`;
export const DELETE_VEHICLE_TYPE_URL = (typeId: string) =>
  `${API_BASE_URL}/fleet/vehicle-types/${typeId}`;
export const UPDATE_VEHICLE_URL = (vehicleId: string) =>
  `${API_BASE_URL}/fleet/vehicles/${vehicleId}`;
export const DELETE_VEHICLE_URL = (vehicleId: string) =>
  `${API_BASE_URL}/fleet/vehicles/${vehicleId}`;
export const UPDATE_VEHICLE_STATUS_URL = (vehicleId: string) =>
  `${API_BASE_URL}/fleet/vehicles/${vehicleId}/status`;
export const GET_FLEET_DASHBOARD_URL = `${API_BASE_URL}/fleet/dashboard/`;
export const GET_FLEET_DASHBOARD_ROUTE_URL = (tripId: string) =>
  `${API_BASE_URL}/fleet/dashboard/${tripId}/route`;

// Cargo management
export const GET_CARGOS_URL = `${API_BASE_URL}/cargo/`;
