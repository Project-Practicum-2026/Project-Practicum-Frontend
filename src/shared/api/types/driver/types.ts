// Warehouse (Hub) from backend
export interface IWarehouseResponse {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  contact_email: string;
  contact_phone: string | null;
}

// Route (available for driver to take)
export interface IRouteResponse {
  id: string;
  status: "available" | "taken" | "cancelled";
  version: number;
  origin_warehouse_id: string;
  total_distance_km: number;
  estimated_duration_min: number;
  total_weight_kg: number;
  total_volume_m3: number;
  built_at: string;
}

// Route stop with warehouse and cargo
export interface IRouteStopCargoResponse {
  id: string;
  cargo: {
    external_id: string;
    description: string;
    weight_kg: number;
    volume_m3: number;
    origin_warehouse_id: string;
    dest_warehouse_id: string;
    status: string;
    id: string;
  };
  action: string;
}

export interface IRouteStopResponse {
  id: string;
  stop_order: number;
  warehouse: IWarehouseResponse;
  estimated_arrival: string | null;
  distance_from_prev_km: number;
  cargo_items: IRouteStopCargoResponse[];
}

// Route detail (includes stops and origin warehouse)
export interface IRouteDetailResponse {
  id: string;
  status: "available" | "taken" | "cancelled";
  version: number;
  origin_warehouse_id: string;
  total_distance_km: number;
  estimated_duration_min: number;
  total_weight_kg: number;
  total_volume_m3: number;
  built_at: string;
  stops: IRouteStopResponse[];
  origin_warehouse: IWarehouseResponse;
}

// Trip status enum (matches backend TripStatus)
export type TripStatus = "waiting" | "loading" | "on_road" | "unloading" | "finished";

// Trip response
export interface ITripResponse {
  id: string;
  route_id: string;
  vehicle_id: string;
  status: TripStatus;
  started_at: string | null;
  finished_at: string | null;
  first_email_sent: boolean;
  second_email_sent: boolean;
  created_at: string;
  updated_at: string;
}

// Trip detail response
export interface ITripDetailResponse extends ITripResponse {
  route: IRouteResponse;
  vehicle: {
    id: string;
    plate_number: string;
    status: string;
    vehicle_type: {
      id: string;
      name: string;
      max_weight_kg: number;
      max_volume_m3: number;
      ors_profile: string;
    };
    current_warehouse_id: string | null;
  };
  crew: Array<{
    id: string;
    driver_id: string;
    role: string;
  }>;
}

// Take route request
export interface ITakeRouteRequest {
  version: number;
}

// Trip status update request
export interface ITripStatusUpdate {
  status: TripStatus;
}
