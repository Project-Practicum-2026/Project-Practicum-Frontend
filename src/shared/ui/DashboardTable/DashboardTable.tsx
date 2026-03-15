import { MapPin, Navigation } from "lucide-react";
import styles from "./DashBoardTable.module.scss";
import type { FC } from "react";
import textData from "../../../textData/ua.json";

interface ITrip {
  id: string;
  driver: string;
  status: string;
  modifier: string;
  dep: string;
  depTime: string;
  arr: string;
  arrTime: string;
}

const DashboardTable: FC<{ data: ITrip[] }> = ({ data }) => {
  return (
    <div className={styles["active-trips"]}>
      <h1 className={styles["active-trips__title"]}>{textData.managerDashboard.table.title}</h1>

      <div className={styles["active-trips__wrapper"]}>
        <table className={styles["active-trips__table"]}>
          <thead>
            <tr>
              <th className={styles["active-trips__head-cell"]}>{textData.managerDashboard.table.headers.id}</th>
              <th className={styles["active-trips__head-cell"]}>{textData.managerDashboard.table.headers.driver}</th>
              <th className={styles["active-trips__head-cell"]}>{textData.managerDashboard.table.headers.status}</th>
              <th className={styles["active-trips__head-cell"]}>{textData.managerDashboard.table.headers.dispatch}</th>
              <th className={styles["active-trips__head-cell"]}>{textData.managerDashboard.table.headers.arrival}</th>
              <th className={`${styles["active-trips__head-cell"]} ${styles["active-trips__head-cell--center"]}`}>
                {textData.managerDashboard.table.headers.route}
              </th>
              <th className={`${styles["active-trips__head-cell"]} ${styles["active-trips__head-cell--center"]}`}>
                {textData.managerDashboard.table.headers.gps}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((trip) => (
              <tr
                key={trip.id}
                className={styles["active-trips__row"]}>
                <td className={`${styles["active-trips__cell"]} ${styles["active-trips__cell--id"]}`}>{trip.id}</td>
                <td className={`${styles["active-trips__cell"]} ${styles["active-trips__cell--driver"]}`}>
                  {trip.driver}
                </td>
                <td className={styles["active-trips__cell"]}>
                  <span
                    className={`${styles["active-trips__status"]} ${styles[`active-trips__status--${trip.modifier}`]}`}>
                    {trip.status}
                  </span>
                </td>
                <td className={`${styles["active-trips__cell"]} ${styles["active-trips__cell--address"]}`}>
                  {trip.dep}
                  <span className={styles["active-trips__date-time"]}>{trip.depTime}</span>
                </td>
                <td className={`${styles["active-trips__cell"]} ${styles["active-trips__cell--address"]}`}>
                  {trip.arr}
                  <span className={styles["active-trips__date-time"]}>{trip.arrTime}</span>
                </td>
                <td className={`${styles["active-trips__cell"]} ${styles["active-trips__cell--center"]}`}>
                  <button className={styles["active-trips__icon-button"]}>
                    <MapPin size={28} />
                  </button>
                </td>
                <td className={`${styles["active-trips__cell"]} ${styles["active-trips__cell--center"]}`}>
                  <button className={styles["active-trips__icon-button"]}>
                    <Navigation size={28} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTable;
