import { useEffect, useState } from "react";
import { getTrips } from "../../../shared/api";
import type { IRouteTask } from "../../../shared/api/types/routes/types";
import Loader from "../../../shared/ui/Loader/Loader";
import styles from "./Trips.module.scss";

const Trips = () => {
  const [trips, setTrips] = useState<IRouteTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const tripsData = await getTrips();
      setTrips(tripsData);
    } catch (err) {
      console.error("Failed to fetch initial data for trips:", err);
      setError("Помилка завантаження даних");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>РЕЙСИ</h2>

      {error && <p style={{ color: "red", marginBottom: 20 }}>{error}</p>}

      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}><Loader /></div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID Рейсу</th>
                  <th>Маршрут</th>
                  <th>ID ТЗ</th>
                  <th>Статус</th>
                  <th>Дата створення</th>
                </tr>
              </thead>
              <tbody>
                {trips.map(trip => (
                  <tr key={trip.id}>
                    <td>{trip.id.substring(0, 8)}...</td>
                    <td>{trip.route_id.substring(0, 8)}...</td>
                    <td>{trip.vehicle_id.substring(0, 8)}...</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[`status_${trip.status}`] || ""}`}>
                        {trip.status}
                      </span>
                    </td>
                    <td>{new Date(trip.created_at).toLocaleString()}</td>
                  </tr>
                ))}
                {trips.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                      Рейсів не знайдено
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Trips;
