import { createBrowserRouter } from "react-router";
import Layout from "./pages/Layout/main/Layout";
import Login from "./pages/Login/Login";
import { ROUTES } from "./shared/config/routes";
import { RoleRoute } from "./app/providers/RoleRoute";
import { ERoles } from "./shared/api/types/auth/types";
import { ProtectedRoute } from "./app/providers/ProtectedRoute";
import Dashboard from "./pages/Manager/Dashboard/Dashboard";
import Drivers from "./pages/Manager/Drivers/Dirvers";
import ManagerLayout from "./pages/Layout/manager/ManagerLayout";

const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <div>Home</div>,
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
