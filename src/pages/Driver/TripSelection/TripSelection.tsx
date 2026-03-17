import { useState } from "react";
import { useNavigate } from "react-router";
import { useCustomSelector, useCustomDispatch } from "../../../store/hooks";
import { setActiveRouteDetail, setActiveTripId } from "../../../store/driverSlice";
import { getRouteDetail, takeRoute } from "../../../shared/api";
import type { IRouteResponse } from "../../../shared/api/types/driver/types";
import styles from "./TripSelection.module.scss";

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} хв`;
  if (mins === 0) return `${hours} год`;
  return `${hours} год ${mins} хв`;
};

const TripSelection = () => {
  const navigate = useNavigate();
  const dispatch = useCustomDispatch();
  const selectedWarehouse = useCustomSelector((state) => state.driver.selectedWarehouse);
  const availableRoutes = useCustomSelector((state) => state.driver.availableRoutes);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectRoute = async (route: IRouteResponse) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get route details (with stops info)
      const routeDetail = await getRouteDetail(route.id);
      dispatch(setActiveRouteDetail(routeDetail));

      // Take the route (assign it to the driver)
      const takenRoute = await takeRoute(route.id, { version: route.version });

      // The takeRoute might return trip info or we navigate to active trip
      // For now, store the route and navigate
      dispatch(setActiveTripId(takenRoute.id));
      navigate(`/driver/trip/${takenRoute.id}`);
    } catch (err) {
      console.error("Failed to take route:", err);
      setError("Не вдалося взяти маршрут. Спробуйте інший.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedWarehouse) {
    navigate("/driver");
    return null;
  }

  return (
    <div className={styles.trips}>
      <div className={styles.trips__hub}>
        <span className={styles.trips__hubName}>{selectedWarehouse.name.toUpperCase()}</span>
      </div>

      <p className={styles.trips__label}>Оберіть маршрут за вашим бажанням</p>

      {error && <p style={{ color: "red", marginBottom: 16, fontSize: "0.85rem" }}>{error}</p>}

      <div className={styles.trips__heading}>
        <span>Маршрути доставки</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
            fill="#f5a623"
          />
        </svg>
      </div>

      <ul className={styles.trips__list}>
        {availableRoutes.map((route) => (
          <li key={route.id}>
            <button
              className={styles.trips__item}
              onClick={() => handleSelectRoute(route)}
              disabled={isLoading}
            >
              <div className={styles.trips__destination}>
                {route.total_distance_km.toFixed(1)} км маршрут
              </div>
              <div className={styles.trips__duration}>
                Тривалість: {formatDuration(route.estimated_duration_min)} | Вага: {route.total_weight_kg.toFixed(1)} кг
              </div>
            </button>
          </li>
        ))}
      </ul>

      {availableRoutes.length === 0 && (
        <p className={styles.trips__empty}>Наразі немає доступних рейсів для цього хабу.</p>
      )}
    </div>
  );
};

export default TripSelection;
