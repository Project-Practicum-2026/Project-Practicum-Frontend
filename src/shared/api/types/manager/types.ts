export interface ICargoResponse {
  id: string;
  external_id: string;
  description: string;
  weight_kg: number;
  volume_m3: number;
  origin_warehouse_id: string;
  dest_warehouse_id: string;
  status: "PENDING" | "IN_TRANSIT" | "DELIVERED";
}

export interface IVehicleTypeResponse {
  id: string;
  name: string;
  max_weight_kg: number;
  max_volume_m3: number;
  ors_profile: string;
}

export interface IAddVehicleTypeRequest {
  name: string;
  max_weight_kg: number;
  max_volume_m3: number;
  ors_profile: string;
}

export interface IFleetDashboardResponse {
  total_vehicles: number;
  available_vehicles: number;
  in_transit_vehicles: number;
  maintenance_vehicles: number;
}

export interface ICreateTripRequest {
  route_id: string;
  vehicle_id: string;
  driver_ids: string[];
}
