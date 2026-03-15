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
import Managers from "./pages/Manager/Managers/Managers";
import Transport from "./pages/Manager/Transport/Transport";
import Warehouse from "./pages/Manager/Warehouses/Warehouses";

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
                    path: ROUTES.MANAGER_MANAGERS,
                    element: <Managers />,
                  },
                  {
                    path: ROUTES.MANAGER_TRANSPORT,
                    element: <Transport />,
                  },
                  {
                    path: ROUTES.MANAGER_WAREHOUSES,
                    element: <Warehouse />,
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
