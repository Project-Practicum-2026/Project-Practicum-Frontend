import { NavLink, Outlet } from "react-router";
import { ROUTES } from "../../../shared/config/routes";
import textData from "../../../textData/ua.json";
import styles from "./ManagerLayout.module.scss";
import PageHeader from "../../../shared/ui/PageHeader/PageHeader";

const ManagerLayout = () => {
  // Масив з назвами
  const MANAGER_LINKS = [
    { path: ROUTES.MANAGER_DASHBOARD, label: textData.manager.menu.dashboard },
    { path: ROUTES.MANAGER_CARGO, label: "ВАНТАЖІ" },
    { path: ROUTES.MANAGER_DRIVERS, label: textData.manager.menu.drivers },
    { path: ROUTES.MANAGER_TRANSPORT, label: textData.manager.menu.transport },
    {
      path: ROUTES.MANAGER_WAREHOUSES,
      label: textData.manager.menu.warehouses,
    },
  ];

  return (
    <div className={styles.layout}>
      <div className={styles["cabinet-head"]}>
        <PageHeader
          variant="cabinet"
          textStart={textData.manager.cabinetTitle.start}
          textAccent={textData.manager.cabinetTitle.accent}
        />

        <nav className={styles.nav}>
          <ul className={styles.menu}>
            {MANAGER_LINKS.map((link) => (
              <li key={link.path} className={styles["menu-item"]}>
                <NavLink
                  to={link.path}
                  end
                  className={({ isActive }) =>
                    `${styles["menu-link"]} ${isActive ? styles["menu-link--active"] : ""}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Контент активної сторінки */}
      <Outlet />
    </div>
  );
};

export default ManagerLayout;
