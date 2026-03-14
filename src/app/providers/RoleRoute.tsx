import { Navigate, Outlet } from "react-router";
import { useCustomSelector } from "../../store/hooks";
import { ERoles } from "../../shared/api/types/auth/types";
import type { FC } from "react";

export const RoleRoute: FC<{ allowedRoles: ERoles[] }> = ({ allowedRoles }) => {
  const role = useCustomSelector((state) => state.user.role);

  if (!role || !allowedRoles.includes(role)) {
    return (
      <Navigate
        to="/forbidden"
        replace
      />
    );
  }

  return <Outlet />;
};
