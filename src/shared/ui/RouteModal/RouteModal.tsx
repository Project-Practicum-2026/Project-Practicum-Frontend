import type { FC } from "react";
import type { IFleetDashboardRoute } from "../../../shared/api";
import Loader from "../Loader/Loader";
import styles from "./RouteModal.module.scss";

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  routeData: IFleetDashboardRoute | null;
  error: string | null;
}

const RouteModal: FC<RouteModalProps> = ({ isOpen, onClose, isLoading, routeData, error }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Деталі маршруту</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Закрити">
            &times;
          </button>
        </div>

        <div className={styles.modalBody}>
          {isLoading && <Loader />}
          {error && <div className={styles.error}>{error}</div>}
          
          {!isLoading && !error && routeData && (
            <div className={styles.routeContainer}>
              {/* Origin */}
              <div className={styles.stopItem}>
                <div className={styles.stopMarker} style={{ background: "#10b981" }}>A</div>
                <div className={styles.stopInfo}>
                  <strong>{routeData.origin_warehouse.name}</strong>
                  <span>{routeData.origin_warehouse.address}</span>
                  <span className={styles.stopMeta}>Відправлення</span>
                </div>
              </div>

              {/* Stops */}
              {routeData.stops.sort((a, b) => a.stop_order - b.stop_order).map((stop, idx) => (
                <div key={stop.id} className={styles.stopItem}>
                  <div className={styles.stopMarker}>{idx + 1}</div>
                  <div className={styles.stopInfo}>
                    <strong>{stop.warehouse.name}</strong>
                    <span>{stop.warehouse.address}</span>
                    <div className={styles.stopTimes}>
                      {stop.estimated_arrival && (
                        <span>Планове прибуття: {new Date(stop.estimated_arrival).toLocaleString("uk-UA")}</span>
                      )}
                      {stop.actual_arrival && (
                         <span>Фактичне прибуття: {new Date(stop.actual_arrival).toLocaleString("uk-UA")}</span>
                      )}
                    </div>
                    {stop.distance_from_prev_km > 0 && (
                      <span className={styles.stopMeta}>
                        Відстань від попередньої: {stop.distance_from_prev_km.toFixed(1)} км
                      </span>
                    )}
                    {stop.cargo_items?.length > 0 && (
                      <div className={styles.stopCargo}>
                        {stop.cargo_items.map(ci => (
                          <span key={ci.id}>
                            {ci.action === "pickup" ? "📦 Забрати" : "📤 Доставити"}: {ci.cargo.description} ({ci.cargo.weight_kg} кг, {ci.cargo.volume_m3} м³)
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteModal;
