import { createBrowserRouter } from "react-router";
import Layout from "./pages/Layout/ui/Layout";
import Login from "./pages/Login/Login";
import { ROUTES } from "./shared/config/routes";

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
    ],
  },
  {
    path: "*",
    element: <div>Not Found</div>,
  },
]);

export default router;
