import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { getTripDetail, getRouteDetail } from "../../../shared/api";
import type { ITripDetailResponse, IRouteDetailResponse } from "../../../shared/api/types/driver/types";
import Loader from "../../../shared/ui/Loader/Loader";
import styles from "./TripDetail.module.scss";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  waiting: { label: "Очікує завантаження", color: "#f59e0b" },
  loading: { label: "Завантаження", color: "#3b82f6" },
  on_road: { label: "В дорозі", color: "#10b981" },
  unloading: { label: "Розвантаження", color: "#8b5cf6" },
  finished: { label: "Завершено", color: "#6b7280" },
};

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} хв`;
  if (mins === 0) return `${hours} год`;
  return `${hours} год ${mins} хв`;
};

const TripDetail = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [tripDetail, setTripDetail] = useState<ITripDetailResponse | null>(null);
  const [routeDetail, setRouteDetail] = useState<IRouteDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!tripId) return;
    try {
      setIsLoading(true);
      setError(null);
      const trip = await getTripDetail(tripId);
      setTripDetail(trip);

      if (trip?.route_id) {
        const route = await getRouteDetail(trip.route_id);
        setRouteDetail(route);
      }
    } catch (err) {
      console.error("Failed to fetch trip detail:", err);
      setError("Не вдалося завантажити деталі рейсу");
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) return <Loader />;

  if (error || !tripDetail) {
    return (
      <div className={styles.detail}>
        <p className={styles.detail__error}>{error || "Рейс не знайдено"}</p>
        <button className={styles.detail__backBtn} onClick={() => navigate(-1)}>← Назад</button>
      </div>
    );
  }

  const statusInfo = STATUS_MAP[tripDetail.status] || { label: tripDetail.status, color: "#6b7280" };

  return (
    <div className={styles.detail}>
      <button className={styles.detail__backBtn} onClick={() => navigate(-1)}>
        ← Назад до дашборду
      </button>

      <h2 className={styles.detail__title}>
        ДЕТАЛІ РЕЙСУ №{tripDetail.id.slice(0, 12).toUpperCase()}
      </h2>

      {/* Status */}
      <div className={styles.detail__statusRow}>
        <span className={styles.detail__statusBadge} style={{ background: statusInfo.color }}>
          {statusInfo.label}
        </span>
      </div>

      {/* Info cards */}
      <div className={styles.detail__cards}>
        <div className={styles.detail__card}>
          <div className={styles.detail__cardLabel}>Транспортний засіб</div>
          <div className={styles.detail__cardValue}>
            {tripDetail.vehicle?.plate_number || "—"}
          </div>
          <div className={styles.detail__cardSub}>
            {tripDetail.vehicle?.vehicle_type?.name || ""}
          </div>
        </div>

        <div className={styles.detail__card}>
          <div className={styles.detail__cardLabel}>Екіпаж</div>
          <div className={styles.detail__cardValue}>
            {tripDetail.crew?.length
              ? `${tripDetail.crew.length} водій(-ів)`
              : "Не призначено"}
          </div>
          {tripDetail.crew?.map(c => (
            <div key={c.id} className={styles.detail__cardSub}>
              {c.role}: {c.driver_id.slice(0, 8)}…
            </div>
          ))}
        </div>

        {routeDetail && (
          <>
            <div className={styles.detail__card}>
              <div className={styles.detail__cardLabel}>Дистанція</div>
              <div className={styles.detail__cardValue}>
                {routeDetail.total_distance_km.toFixed(1)} км
              </div>
            </div>
            <div className={styles.detail__card}>
              <div className={styles.detail__cardLabel}>Тривалість</div>
              <div className={styles.detail__cardValue}>
                {formatDuration(routeDetail.estimated_duration_min)}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Route stops */}
      {routeDetail && (
        <div className={styles.detail__route}>
          <h3 className={styles.detail__sectionTitle}>Маршрут</h3>

          {/* Origin */}
          <div className={styles.detail__stop}>
            <div className={styles.detail__stopMarker} style={{ background: "#10b981" }}>A</div>
            <div className={styles.detail__stopInfo}>
              <strong>{routeDetail.origin_warehouse.name}</strong>
              <span>{routeDetail.origin_warehouse.address}</span>
              <span className={styles.detail__stopMeta}>Відправлення</span>
            </div>
          </div>

          {/* Stops */}
          {routeDetail.stops.map((stop, idx) => (
            <div key={stop.id} className={styles.detail__stop}>
              <div className={styles.detail__stopMarker}>{idx + 1}</div>
              <div className={styles.detail__stopInfo}>
                <strong>{stop.warehouse.name}</strong>
                <span>{stop.warehouse.address}</span>
                {stop.estimated_arrival && (
                  <span className={styles.detail__stopMeta}>
                    Прибуття: {new Date(stop.estimated_arrival).toLocaleString("uk-UA")}
                  </span>
                )}
                {stop.distance_from_prev_km > 0 && (
                  <span className={styles.detail__stopMeta}>
                    Відстань від попередньої: {stop.distance_from_prev_km.toFixed(1)} км
                  </span>
                )}
                {stop.cargo_items?.length > 0 && (
                  <div className={styles.detail__stopCargo}>
                    {stop.cargo_items.map(ci => (
                      <span key={ci.id}>
                        {ci.action === "pickup" ? "📦 Забрати" : "📤 Доставити"}: {ci.cargo.description} ({ci.cargo.weight_kg} кг)
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dates */}
      <div className={styles.detail__dates}>
        <div>
          <strong>Створено:</strong> {new Date(tripDetail.created_at).toLocaleString("uk-UA")}
        </div>
        {tripDetail.started_at && (
          <div>
            <strong>Розпочато:</strong> {new Date(tripDetail.started_at).toLocaleString("uk-UA")}
          </div>
        )}
        {tripDetail.finished_at && (
          <div>
            <strong>Завершено:</strong> {new Date(tripDetail.finished_at).toLocaleString("uk-UA")}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetail;
