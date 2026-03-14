import { createBrowserRouter } from "react-router";
import Layout from "./pages/Layout/ui/Layout";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { ROUTES } from "./shared/config/routes";
import { RoleRoute } from "./app/providers/RoleRoute";
import { ERoles } from "./shared/api/types/auth/types";
import { ProtectedRoute } from "./app/providers/ProtectedRoute";

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
                path: "/manager",
                element: <div>Manager Page - only for MANAGER role</div>,
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
