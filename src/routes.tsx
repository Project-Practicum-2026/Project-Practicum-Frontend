import { createBrowserRouter } from "react-router";
import Layout from "./pages/Layout/main/Layout";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { ROUTES } from "./shared/config/routes";
import { RoleRoute } from "./app/providers/RoleRoute";
import { ERoles } from "./shared/api/types/auth/types";
import { ProtectedRoute } from "./app/providers/ProtectedRoute";
import Dashboard from "./pages/Manager/Dashboard/Dashboard";
import Drivers from "./pages/Manager/Drivers/Dirvers";
import ManagerLayout from "./pages/Layout/manager/ManagerLayout";
import Transport from "./pages/Manager/Transport/Transport";
import Warehouse from "./pages/Manager/Warehouses/Warehouses";
import Cargo from "./pages/Manager/Cargo/Cargo";
import TripDetail from "./pages/Manager/TripDetail/TripDetail";
import DriverLayout from "./pages/Layout/driver/DriverLayout";
import HubSelection from "./pages/Driver/HubSelection/HubSelection";
import TripSelection from "./pages/Driver/TripSelection/TripSelection";
import ActiveTrip from "./pages/Driver/ActiveTrip/ActiveTrip";
const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: ROUTES.LOGIN,
        element: <Login />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <RoleRoute allowedRoles={[ERoles.MANAGER]} />,
            children: [
              {
                element: <ManagerLayout />,
                children: [
                  {
                    path: ROUTES.MANAGER_DASHBOARD,
                    element: <Dashboard />,
                  },
                  {
                    path: ROUTES.MANAGER_DRIVERS,
                    element: <Drivers />,
                  },
                  {
                    path: ROUTES.MANAGER_TRANSPORT,
                    element: <Transport />,
                  },
                  {
                    path: ROUTES.MANAGER_WAREHOUSES,
                    element: <Warehouse />,
                  },
                  {
                    path: ROUTES.MANAGER_CARGO,
                    element: <Cargo />,
                  },
                  {
                    path: ROUTES.MANAGER_TRIP_DETAIL,
                    element: <TripDetail />,
                  },
                ],
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={[ERoles.DRIVER]} />,
            children: [
              {
                element: <DriverLayout />,
                children: [
                  {
                    path: ROUTES.DRIVER,
                    element: <HubSelection />,
                  },
                  {
                    path: ROUTES.DRIVER_TRIP_SELECTION,
                    element: <TripSelection />,
                  },
                  {
                    path: ROUTES.DRIVER_ACTIVE_TRIP,
                    element: <ActiveTrip />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <div>Not Found</div>,
  },
]);

export default router;

