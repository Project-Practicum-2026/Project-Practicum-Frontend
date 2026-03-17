export const ROUTES = {
  ROOT: "/",
  HOME: "/home",
  LOGIN: "/login",
  ABOUT: "/about",
  MANAGER_DASHBOARD: "/manager-dashboard",
  MANAGER_DRIVERS: "/manager-dashboard/drivers",
  MANAGER_MANAGERS: "/manager-dashboard/managers",
  MANAGER_TRANSPORT: "/manager-dashboard/transport",
  MANAGER_WAREHOUSES: "/manager-dashboard/warehouses",
  DRIVER: "/driver",
  DRIVER_TRIP_SELECTION: "/driver/trips",
  DRIVER_ACTIVE_TRIP: "/driver/trip/:tripId",
} as const;

