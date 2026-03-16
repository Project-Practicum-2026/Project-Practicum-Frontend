export enum EStatuses {
  WAITING = "waiting",
  LOADING = "loading",
  ON_ROAD = "on_road",
  UNLOADING = "unloading",
  FINISHED = "finished",
}

export interface IRouteTask {
  id: string;
  route_id: string;
  vehicle_id: string;
  status: EStatuses;
  started_at: string;
  finished_at: string;
  first_email_sent: boolean;
  second_email_sent: boolean;
  created_at: string;
  updated_at: string;
}
