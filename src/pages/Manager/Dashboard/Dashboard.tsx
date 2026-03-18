import { useEffect, useState, useCallback } from "react";
import DashboardTable from "../../../shared/ui/DashboardTable/DashboardTable";
import StatList from "../../../shared/ui/StatList/StatList";
import styles from "./Dashboard.module.scss";
import { getFleetDashboard, getFleetDashboardRoute } from "../../../shared/api";
import type { IFleetDashboardTrip, IFleetDashboardRoute } from "../../../shared/api";
import Loader from "../../../shared/ui/Loader/Loader";
import RouteModal from "../../../shared/ui/RouteModal/RouteModal";

// Removed STATUS_MAP and DashboardTrip as we use IFleetDashboardTrip directly

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tripsData, setTripsData] = useState<IFleetDashboardTrip[]>([]);
  const [statsData, setStatsData] = useState<{ id: string; title: string; value: string }[]>([]);

  // Modal states
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [routeData, setRouteData] = useState<IFleetDashboardRoute | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

  const fetchData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      
      const trips = await getFleetDashboard();
      setTripsData(trips);

      setStatsData([
        { id: "1", title: "Активні рейси (в дорозі)", value: trips.length.toString() },
      ]);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchData(true);

    // Polling every 30 seconds
    const interval = setInterval(() => {
      fetchData(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRouteClick = async (tripId: string) => {
    setSelectedTripId(tripId);
    setIsRouteLoading(true);
    setRouteError(null);
    setRouteData(null);

    try {
      const data = await getFleetDashboardRoute(tripId);
      setRouteData(data);
    } catch (err) {
      console.error("Failed to fetch route details", err);
      setRouteError("Не вдалося завантажити деталі маршруту.");
    } finally {
      setIsRouteLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedTripId(null);
    setRouteData(null);
    setRouteError(null);
  };

  return (
    <div className={styles["container"]}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DashboardTable
            data={tripsData}
            onRouteClick={handleRouteClick}
          />
          <StatList data={statsData} />

          <RouteModal
            isOpen={!!selectedTripId}
            onClose={handleCloseModal}
            isLoading={isRouteLoading}
            routeData={routeData}
            error={routeError}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;

