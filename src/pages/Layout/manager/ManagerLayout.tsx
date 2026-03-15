import { Link, Outlet } from "react-router";
import { ROUTES } from "../../../shared/config/routes";

const ManagerLayout = () => {
  return (
    <div>
      <nav>
        <ul style={{ display: "flex", width: "100%", flexDirection: "row", gap: 50, listStyle: "none", padding: 20 }}>
          <li>
            <Link to={ROUTES.MANAGER_DASHBOARD}>Dashboard</Link>
          </li>
          <li>
            <Link to={ROUTES.MANAGER_DRIVERS}>Drivers</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default ManagerLayout;
