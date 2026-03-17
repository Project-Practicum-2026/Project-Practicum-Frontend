import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ROUTES } from "../../../shared/config/routes";
import { useCustomDispatch } from "../../../store/hooks";
import { setSelectedWarehouse, setAvailableRoutes } from "../../../store/driverSlice";
import { getWarehouses, getAvailableRoutes } from "../../../shared/api";
import type { IWarehouseResponse } from "../../../shared/api/types/driver/types";
import Loader from "../../../shared/ui/Loader/Loader";
import styles from "./HubSelection.module.scss";

const HubSelection = () => {
  const [warehouses, setWarehouses] = useState<IWarehouseResponse[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useCustomDispatch();
  const navigate = useNavigate();

  const selectedWarehouse = warehouses.find((w) => w.id === selectedId) || null;

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setIsLoading(true);
        const data = await getWarehouses();
        setWarehouses(data);
      } catch (err) {
        console.error("Failed to fetch warehouses:", err);
        setError("Не вдалося завантажити список складів");
      } finally {
        setIsLoading(false);
      }
    };
    fetchWarehouses();
  }, []);

  const handleSelectWarehouse = (warehouse: IWarehouseResponse) => {
    setSelectedId(warehouse.id);
    setIsDropdownOpen(false);
  };

  const handleReady = async () => {
    if (!selectedWarehouse) return;
    try {
      setIsSubmitting(true);
      dispatch(setSelectedWarehouse(selectedWarehouse));
      const routes = await getAvailableRoutes(selectedWarehouse.id);
      dispatch(setAvailableRoutes(routes));
      navigate(ROUTES.DRIVER_TRIP_SELECTION);
    } catch (err) {
      console.error("Failed to fetch routes:", err);
      setError("Не вдалося отримати доступні маршрути");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.hub}>
      <p className={styles.hub__question}>На якому складі ви зараз знаходитесь?</p>

      {error && <p style={{ color: "red", marginBottom: 16 }}>{error}</p>}

      <div className={styles.hub__dropdown}>
        <button
          className={`${styles.hub__trigger} ${isDropdownOpen ? styles["hub__trigger--open"] : ""}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span>{selectedWarehouse ? selectedWarehouse.name : "Оберіть склад зі списку"}</span>
          <svg
            className={`${styles.hub__chevron} ${isDropdownOpen ? styles["hub__chevron--open"] : ""}`}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {isDropdownOpen && (
          <ul className={styles.hub__list}>
            {warehouses.map((warehouse) => (
              <li key={warehouse.id}>
                <button
                  className={`${styles.hub__item} ${warehouse.id === selectedId ? styles["hub__item--active"] : ""}`}
                  onClick={() => handleSelectWarehouse(warehouse)}
                >
                  {warehouse.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        className={`${styles.hub__ready} ${selectedWarehouse ? styles["hub__ready--active"] : ""}`}
        onClick={handleReady}
        disabled={!selectedWarehouse || isSubmitting}
      >
        {isSubmitting ? "Завантаження..." : "Готовий взяти рейс"}
      </button>
    </div>
  );
};

export default HubSelection;
