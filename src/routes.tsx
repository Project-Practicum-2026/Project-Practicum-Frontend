import { createBrowserRouter } from "react-router";
import Layout from "./pages/Layout/ui/Layout";
import Home from "./pages/Home/Home";

const router = createBrowserRouter([
  {
    path: "/",
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
