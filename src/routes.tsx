import { createBrowserRouter } from "react-router";
import Layout from "./pages/Layout/ui/Layout";
import Home from "./pages/Home/Home";
import { ROUTES } from "./shared/config/routes";

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "*",
    element: <div>Not Found</div>,
  },
]);

export default router;
