import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCustomSelector, useCustomDispatch } from "../../../store/hooks";
import { advanceStop, resetDriverState } from "../../../store/driverSlice";
import { updateTripStatus, getTripDetail } from "../../../shared/api";
import type { TripStatus } from "../../../shared/api/types/driver/types";
import ConfirmModal from "../../../shared/ui/ConfirmModal/ConfirmModal";
import Loader from "../../../shared/ui/Loader/Loader";
import styles from "./ActiveTrip.module.scss";

const STATUS_LABELS: Record<TripStatus, string> = {
  waiting: "Очікує завантаження",
  loading: "Завантаження",
  on_road: "В дорозі",
  unloading: "Розвантаження",
  finished: "Завершено",
};

const STATUS_ORDER: TripStatus[] = [
  "waiting",
  "loading",
  "on_road",
  "unloading",
  "finished",
];

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} хв`;
  if (mins === 0) return `${hours} год`;
  return `${hours} год ${mins} хв`;
};

const ActiveTrip = () => {
  const navigate = useNavigate();
  const dispatch = useCustomDispatch();
  const activeRouteDetail = useCustomSelector((state) => state.driver.activeRouteDetail);
  const activeTripId = useCustomSelector((state) => state.driver.activeTripId);
  const currentStopIndex = useCustomSelector((state) => state.driver.currentStopIndex);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<TripStatus>("waiting");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // Sync status from DB on mount
  useEffect(() => {
    const syncStatus = async () => {
      if (!activeTripId) {
        setIsLoadingStatus(false);
        return;
      }
      try {
        const tripDetail = await getTripDetail(activeTripId);
        if (tripDetail?.status) {
          setCurrentStatus(tripDetail.status as TripStatus);
        }
      } catch (err) {
        console.error("Failed to sync trip status:", err);
      } finally {
        setIsLoadingStatus(false);
      }
    };
    syncStatus();
  }, [activeTripId]);

  if (!activeRouteDetail) {
    navigate("/driver");
    return null;
  }

  const currentStop = activeRouteDetail.stops[currentStopIndex];
  const lastStop = activeRouteDetail.stops[activeRouteDetail.stops.length - 1];

  const handleStatusChange = () => {
    setIsStatusModalOpen(true);
  };

  const confirmStatusChange = async () => {
    const currentIndex = STATUS_ORDER.indexOf(currentStatus);
    if (currentIndex < STATUS_ORDER.length - 1) {
      const nextStatus = STATUS_ORDER[currentIndex + 1];

      try {
        setIsUpdating(true);

        if (activeTripId) {
          await updateTripStatus(activeTripId, { status: nextStatus });
        }

        setCurrentStatus(nextStatus);

        // If transitioning out of unloading, advance stop
        if (currentStatus === "unloading") {
          dispatch(advanceStop());
        }
      } catch (err) {
        console.error("Failed to update status:", err);
        alert("Не вдалося змінити статус");
      } finally {
        setIsUpdating(false);
      }
    }
    setIsStatusModalOpen(false);
  };

  const handleConfirmUnloading = () => {
    dispatch(advanceStop());
  };

  const handleDownloadWaybill = () => {
    alert("Завантаження накладної… (функціонал буде доступний після інтеграції)");
  };

  const handleGoogleMaps = () => {
    const stop = currentStop || lastStop;
    if (stop?.warehouse) {
      const { latitude, longitude } = stop.warehouse;
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
        "_blank"
      );
    }
  };

  const handleDeclineTrip = () => {
    setIsDeclineModalOpen(true);
  };

  const confirmDeclineTrip = () => {
    setIsDeclineModalOpen(false);
    dispatch(resetDriverState());
    navigate("/driver");
  };

  if (isLoadingStatus) {
    return <Loader />;
  }

  return (
    <div className={styles.trip}>
      <h2 className={styles.trip__title}>
        РЕЙС №{(activeTripId || activeRouteDetail.id).slice(0, 8).toUpperCase()}
      </h2>

      {/* Current destination */}
      <div className={styles.trip__route}>
        <div className={styles.trip__routeLabel}>Поточна точка прибуття:</div>
        <div className={styles.trip__routeAddress}>
          {currentStop
            ? `${currentStop.warehouse.name} — ${currentStop.warehouse.address}`
            : lastStop
              ? `${lastStop.warehouse.name} — ${lastStop.warehouse.address}`
              : "Маршрут завершено"}
        </div>
        {activeRouteDetail.stops.length > 1 && (
          <div className={styles.trip__routeProgress}>
            Зупинка {currentStopIndex + 1} з {activeRouteDetail.stops.length}
          </div>
        )}
        {currentStop && currentStatus === "unloading" && (
          <button className={styles.trip__confirmUnload} onClick={handleConfirmUnloading}>
            Підтвердити розвантаження
          </button>
        )}
      </div>

      {/* Status */}
      <div className={styles.trip__status}>
        <span className={`${styles.trip__statusBadge} ${styles[`trip__statusBadge--${currentStatus}`]}`}>
          {STATUS_LABELS[currentStatus]}
        </span>
      </div>

      {/* Details Accordion */}
      <div className={styles.trip__details}>
        <button
          className={`${styles.trip__detailsToggle} ${isDetailsOpen ? styles["trip__detailsToggle--open"] : ""}`}
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
        >
          <span>Деталі рейсу</span>
          <svg
            className={`${styles.trip__detailsChevron} ${isDetailsOpen ? styles["trip__detailsChevron--open"] : ""}`}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {isDetailsOpen && (
          <div className={styles.trip__detailsContent}>
            <div className={styles.trip__detailsRow}>
              <strong>Адреса відправлення:</strong>
              <span>{activeRouteDetail.origin_warehouse.name} — {activeRouteDetail.origin_warehouse.address}</span>
            </div>
            <div className={styles.trip__detailsRow}>
              <strong>Загальна дистанція:</strong>
              <span>{activeRouteDetail.total_distance_km.toFixed(1)} км</span>
            </div>
            <div className={styles.trip__detailsRow}>
              <strong>Приблизна тривалість:</strong>
              <span>{formatDuration(activeRouteDetail.estimated_duration_min)}</span>
            </div>
            <div className={styles.trip__detailsRow}>
              <strong>Кількість зупинок:</strong>
              <span>{activeRouteDetail.stops.length}</span>
            </div>

            <div className={styles.trip__cargo}>
              <strong>Вантаж:</strong>
              <span>{activeRouteDetail.total_weight_kg.toFixed(1)} кг</span>
              <span>{activeRouteDetail.total_volume_m3.toFixed(2)} м³</span>
            </div>

            <div className={styles.trip__stopsTitle}>Зупинки маршруту:</div>
            <ul className={styles.trip__stopsList}>
              {activeRouteDetail.stops.map((stop, idx) => (
                <li key={stop.id} className={styles.trip__stopItem}>
                  <span className={styles.trip__stopNumber}>{idx + 1}</span>
                  <span>
                    <strong>{stop.warehouse.name}</strong>
                    <br />
                    {stop.warehouse.address}
                    {stop.cargo_items && stop.cargo_items.length > 0 && (
                      <> — {stop.cargo_items.map(ci => ci.action === "pickup" ? "Забрати" : "Доставити").join(", ")}</>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className={styles.trip__actions}>
        <button
          className={styles.trip__statusBtn}
          onClick={handleStatusChange}
          disabled={isUpdating || currentStatus === "finished"}
        >
          {isUpdating ? "Оновлення..." : "Змінити статус"}
        </button>

        <button className={styles["trip__btn--waybill"]} onClick={handleDownloadWaybill}>
          Завантажити накладну
        </button>

        <button className={styles["trip__btn--maps"]} onClick={handleGoogleMaps}>
          Отримати маршрут на Google Maps
        </button>

        <button className={styles["trip__btn--decline"]} onClick={handleDeclineTrip}>
          Відмовитися від маршруту
        </button>
      </div>

      {/* Status Change Modal */}
      <ConfirmModal
        isOpen={isStatusModalOpen}
        title="Зміна статусу"
        message="Ви впевнені, що хочете змінити статус?"
        onConfirm={confirmStatusChange}
        onCancel={() => setIsStatusModalOpen(false)}
      />

      {/* Decline Trip Modal */}
      <ConfirmModal
        isOpen={isDeclineModalOpen}
        title="Відмова від маршруту"
        message="Ви впевнені, що хочете відмовитися від цього маршруту?"
        onConfirm={confirmDeclineTrip}
        onCancel={() => setIsDeclineModalOpen(false)}
      />
    </div>
  );
};

export default ActiveTrip;
