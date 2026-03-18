
import styles from "./DashBoardTable.module.scss";
import type { FC } from "react";
import textData from "../../../textData/ua.json";
import type { IFleetDashboardTrip } from "../../api";

interface DashboardTableProps {
  data: IFleetDashboardTrip[];
  onRouteClick?: (tripId: string) => void;
}

const DashboardTable: FC<DashboardTableProps> = ({ data, onRouteClick }) => {
  return (
    <div className={styles["active-trips"]}>
      <h1 className={styles["active-trips__title"]}>{textData.manager.dashboard.table.title}</h1>

      <div className={styles["active-trips__wrapper"]}>
        <table className={styles["active-trips__table"]}>
          <thead>
            <tr>
              <th className={styles["active-trips__head-cell"]}>{textData.manager.dashboard.table.headers.id}</th>
              <th className={styles["active-trips__head-cell"]}>{textData.manager.dashboard.table.headers.driver}</th>
              <th className={styles["active-trips__head-cell"]}>{textData.manager.dashboard.table.headers.status}</th>
              <th className={styles["active-trips__head-cell"]}>{textData.manager.dashboard.table.headers.dispatch}</th>
              <th className={styles["active-trips__head-cell"]}>{textData.manager.dashboard.table.headers.arrival}</th>
              <th className={`${styles["active-trips__head-cell"]} ${styles["active-trips__head-cell--center"]}`}>
                {textData.manager.dashboard.table.headers.route}
              </th>
              <th className={`${styles["active-trips__head-cell"]} ${styles["active-trips__head-cell--center"]}`}>
                {textData.manager.dashboard.table.headers.gps}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "24px", color: "#999" }}>
                  Немає активних рейсів
                </td>
              </tr>
            ) : (
              data.map((trip) => (
                <tr
                  key={trip.trip_id}
                  className={styles["active-trips__row"]}>
                  <td className={`${styles["active-trips__cell"]} ${styles["active-trips__cell--id"]}`}>{trip.trip_id.slice(0, 8).toUpperCase()}</td>
                  <td className={`${styles["active-trips__cell"]} ${styles["active-trips__cell--driver"]}`}>
                    <div>{trip.driver_full_name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>{trip.plate_number}</div>
                  </td>
                  <td className={styles["active-trips__cell"]}>
                    <span
                      className={`${styles["active-trips__status"]} ${styles[`active-trips__status--in-progress`]}`}>
                      В дорозі
                    </span>
                  </td>
                  <td className={`${styles["active-trips__cell"]} ${styles["active-trips__cell--address"]}`}>
                    {trip.origin || "—"}
                  </td>
                  <td className={`${styles["active-trips__cell"]} ${styles["active-trips__cell--address"]}`}>
                    {trip.destination || "—"}
                  </td>
                  <td className={`${styles["active-trips__cell"]} ${styles["active-trips__cell--center"]}`}>
                    <button
                      className={styles["active-trips__icon-button"]}
                      onClick={() => onRouteClick?.(trip.trip_id)}
                      title="Переглянути маршрут"
                      style={{ fontSize: "0.85rem", padding: "6px 12px", background: "var(--primary-accent)", color: "white", borderRadius: "6px", width: "auto" }}
                    >
                      Переглянути
                    </button>
                  </td>
                  <td className={`${styles["active-trips__cell"]} ${styles["active-trips__cell--center"]}`} style={{ minWidth: "120px" }}>
                    {trip.last_gps ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "0.85rem", alignItems: "center" }}>
                        <span style={{ fontWeight: 600 }}>{trip.last_gps.speed_kmh.toFixed(0)} км/год</span>
                        <span style={{ color: "#666" }}>
                          {trip.last_gps.latitude.toFixed(4)}, {trip.last_gps.longitude.toFixed(4)}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: "0.85rem", color: "#999" }}>Немає даних</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTable;

