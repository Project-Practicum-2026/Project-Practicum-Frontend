import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DashboardTable from "../../../shared/ui/DashboardTable/DashboardTable";
import StatList from "../../../shared/ui/StatList/StatList";
import styles from "./Dashboard.module.scss";
import { getFleetDashboard, getTrips, getTripDetail, getRouteDetail } from "../../../shared/api";
import Loader from "../../../shared/ui/Loader/Loader";

const STATUS_MAP: Record<string, { label: string; modifier: string }> = {
  waiting: { label: "Очікує завантаження", modifier: "waiting" },
  loading: { label: "Завантаження", modifier: "waiting" },
  on_road: { label: "В дорозі", modifier: "in-progress" },
  unloading: { label: "Розвантаження", modifier: "arrived" },
  finished: { label: "Завершено", modifier: "arrived" },
};

interface DashboardTrip {
  id: string;
  fullId: string;
  driver: string;
  status: string;
  modifier: string;
  dep: string;
  depTime: string;
  arr: string;
  arrTime: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [tripsData, setTripsData] = useState<DashboardTrip[]>([]);
  const [statsData, setStatsData] = useState<{ id: string; title: string; value: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [dashboardData, trips] = await Promise.all([
          getFleetDashboard().catch(() => null),
          getTrips().catch(() => []),
        ]);

        // Build stats from fleet dashboard
        if (dashboardData) {
          const total = dashboardData.total_vehicles || 0;
          const available = dashboardData.available_vehicles || 0;
          const inTransit = dashboardData.in_transit_vehicles || 0;
          let loadPercentage = 0;
          if (total > 0) {
            loadPercentage = Math.round((inTransit / total) * 100);
          }
          setStatsData([
            { id: "1", title: "Кількість ТЗ, які зараз у рейсі", value: inTransit.toString() },
            { id: "2", title: "Кількість ТЗ, які зараз вільні", value: available.toString() },
            { id: "3", title: "Загальна завантаженість автопарку", value: `${loadPercentage}%` },
          ]);
        }

        // For each trip, fetch trip detail + route detail to get addresses
        const enrichedTrips: DashboardTrip[] = [];

        for (const trip of trips.slice(0, 10)) {
          try {
            const [tripDetail, routeDetail] = await Promise.all([
              getTripDetail(trip.id).catch(() => null),
              getRouteDetail(trip.route_id).catch(() => null),
            ]);

            const statusInfo = STATUS_MAP[trip.status] || { label: trip.status, modifier: "waiting" };
            const originName = routeDetail?.origin_warehouse?.name || "—";
            const originAddr = routeDetail?.origin_warehouse?.address || "";
            const firstStop = routeDetail?.stops?.[0];
            const arrName = firstStop?.warehouse?.name || "—";
            const arrAddr = firstStop?.warehouse?.address || "";

            const driverName = tripDetail?.crew?.[0]
              ? `Водій ${tripDetail.crew[0].driver_id.slice(0, 8)}`
              : tripDetail?.vehicle?.plate_number || "—";

            enrichedTrips.push({
              id: trip.id.slice(0, 12).toUpperCase(),
              fullId: trip.id,
              driver: driverName,
              status: statusInfo.label,
              modifier: statusInfo.modifier,
              dep: originName + (originAddr ? `, ${originAddr}` : ""),
              depTime: trip.started_at
                ? new Date(trip.started_at).toLocaleString("uk-UA")
                : new Date(trip.created_at).toLocaleString("uk-UA"),
              arr: arrName + (arrAddr ? `, ${arrAddr}` : ""),
              arrTime: firstStop?.estimated_arrival
                ? new Date(firstStop.estimated_arrival).toLocaleString("uk-UA")
                : "—",
            });
          } catch {
            // Skip problematic trips
          }
        }

        setTripsData(enrichedTrips);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles["container"]}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DashboardTable
            data={tripsData}
            onRouteClick={(tripFullId) => navigate(`/manager-dashboard/trip/${tripFullId}`)}
          />
          <StatList data={statsData} />
        </>
      )}
    </div>
  );
};

export default Dashboard;

