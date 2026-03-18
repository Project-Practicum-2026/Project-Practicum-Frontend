export const ROUTES = {
  ROOT: "/",
  HOME: "/home",
  LOGIN: "/login",
  ABOUT: "/about",
  MANAGER_DASHBOARD: "/manager-dashboard",
  MANAGER_DRIVERS: "/manager-dashboard/drivers",
  MANAGER_TRANSPORT: "/manager-dashboard/transport",
  MANAGER_WAREHOUSES: "/manager-dashboard/warehouses",
  MANAGER_CARGO: "/manager-dashboard/cargo",
  MANAGER_TRIPS: "/manager-dashboard/trips",
  MANAGER_TRIP_DETAIL: "/manager-dashboard/trip/:tripId",
  DRIVER: "/driver",
  DRIVER_TRIP_SELECTION: "/driver/trips",
  DRIVER_ACTIVE_TRIP: "/driver/trip/:tripId",
} as const;

