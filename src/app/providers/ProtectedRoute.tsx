import { Navigate, Outlet, useLocation } from "react-router";
import { useCustomSelector } from "../../store/hooks";
import { ROUTES } from "../../shared/config/routes";
import Loader from "../../shared/ui/Loader/Loader";

export const ProtectedRoute = () => {
  const isAuth = useCustomSelector((state) => state.user.isAuth);

  const isAuthChecked = useCustomSelector((state) => state.user.isAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return (
      <div style={{ display: "flex", alignItems: "center", height: 100, justifyContent: "center", margin: 20 }}>
        <Loader />
      </div>
    );
  }

  if (!isAuth) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
};
