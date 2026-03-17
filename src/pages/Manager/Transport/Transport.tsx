import { useState, useEffect, useCallback } from "react";
import UniversalTable, { type TableColumn } from "../../../shared/ui/UniversalTable/UniversalTable";
import UniversalForm, { type FormField } from "../../../shared/ui/UniversalForm/UniversalForm";
import styles from "../../../shared/ui/UniversalTable/UniversalTable.module.scss";
import {
  getVehicles,
  addVehicle,
  getVehicleTypes,
  updateVehicleStatus,
} from "../../../shared/api";
import type { IVehicleResponse, IVehicleTypeResponse } from "../../../shared/api";
import Loader from "../../../shared/ui/Loader/Loader";

export interface TransportUI {
  id: string;
  plateNumber: string;
  dimensions: string;
  status: "В дорозі" | "Доступний" | "На обслуговуванні";
  _backendId: string;
}

const MapPinIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const mapVehicleStatus = (status: string): TransportUI["status"] => {
  switch (status) {
    case "on_trip":
      return "В дорозі";
    case "maintenance":
      return "На обслуговуванні";
    default:
      return "Доступний";
  }
};

const mapVehicleToUI = (v: IVehicleResponse): TransportUI => ({
  id: v.plate_number,
  plateNumber: v.plate_number,
  dimensions: `${v.vehicle_type.max_volume_m3} м³, ${v.vehicle_type.max_weight_kg / 1000} тон`,
  status: mapVehicleStatus(v.status),
  _backendId: v.id,
});

const Transport = () => {
  const [vehicles, setVehicles] = useState<TransportUI[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<IVehicleTypeResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [vehiclesData, typesData] = await Promise.all([
        getVehicles(),
        getVehicleTypes(),
      ]);
      setVehicles(vehiclesData.map(mapVehicleToUI));
      setVehicleTypes(typesData);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
      setError("Не вдалося завантажити список транспорту");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const transportColumns: TableColumn<TransportUI>[] = [
    {
      header: "НОМЕРНИЙ ЗНАК",
      key: "plateNumber",
    },
    {
      header: "ГАБАРИТИ",
      key: "dimensions",
    },
    {
      header: "СТАТУС",
      key: "status",
      render: (vehicle) => {
        let color = "#ccc";
        switch (vehicle.status) {
          case "В дорозі":
            color = "#ff4d6d";
            break;
          case "Доступний":
            color = "#42df8e";
            break;
          case "На обслуговуванні":
            color = "#a0a0a0";
            break;
        }
        return <span style={{ color, fontWeight: 600 }}>{vehicle.status}</span>;
      },
      renderEdit: (value, onChange) => (
        <select
          className={styles["universal-table__inline-select"]}
          value={value as string}
          onChange={(e) => onChange(e.target.value as TransportUI["status"])}
        >
          <option value="В дорозі">В дорозі</option>
          <option value="Доступний">Доступний</option>
          <option value="На обслуговуванні">На обслуговуванні</option>
        </select>
      ),
    },
    {
      header: "МІСЦЕЗНАХОДЖЕННЯ",
      render: () => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <MapPinIcon />
        </div>
      ),
    },
  ];

  const addTransportFields: FormField[] = [
    {
      name: "plate_number",
      label: "Номерний знак",
      placeholder: "АА 1234 ВВ",
      rules: { required: "Вкажіть номерний знак" },
    },
    {
      name: "vehicle_type_id",
      label: "Тип транспорту (ID)",
      placeholder: vehicleTypes.length > 0
        ? `Наприклад: ${vehicleTypes[0].name} (${vehicleTypes[0].id.slice(0, 8)}...)`
        : "Завантажте типи...",
      rules: { required: "Вкажіть тип транспорту" },
    },
  ];

  const handleSaveEdit = (updatedVehicle: TransportUI) => {
    // Update UI immediately (optimistic update)
    setVehicles((prev) =>
      prev.map((v) => (v._backendId === updatedVehicle._backendId ? updatedVehicle : v))
    );

    // Try to sync status to backend in background
    const statusMap: Record<string, "available" | "on_trip" | "maintenance"> = {
      "В дорозі": "on_trip",
      "Доступний": "available",
      "На обслуговуванні": "maintenance",
    };
    const backendStatus = statusMap[updatedVehicle.status] || "available";
    updateVehicleStatus(updatedVehicle._backendId, backendStatus).catch((err) => {
      console.error("Failed to sync vehicle status:", err);
    });
  };

  const handleDelete = (vehicle: TransportUI) => {
    if (window.confirm(`Видалити транспорт ${vehicle.plateNumber}?`)) {
      setVehicles((prev) => prev.filter((v) => v._backendId !== vehicle._backendId));
    }
  };

  const handleAddTransport = async (data: Record<string, string>) => {
    try {
      setError(null);
      await addVehicle({
        plate_number: data.plate_number,
        vehicle_type_id: data.vehicle_type_id,
      });
      await fetchData();
    } catch (err) {
      console.error("Failed to add vehicle:", err);
      setError("Не вдалося додати ТЗ. Перевірте дані (тип ТЗ має бути валідним UUID).");
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
    <div style={{ padding: 20 }}>
      {error && <p style={{ color: "red", marginBottom: 16 }}>{error}</p>}

      <UniversalTable<TransportUI>
        title="ТРАНСПОРТ КОМПАНІЇ"
        columns={transportColumns}
        data={vehicles}
        onSaveEdit={handleSaveEdit}
        onDelete={handleDelete}
        deleteBtnText="ВИДАЛИТИ ТЗ"
      />

      <UniversalForm
        title="ДОДАТИ ТЗ ДО СИСТЕМИ"
        fields={addTransportFields}
        submitText="ДОДАТИ ТЗ"
        onSubmit={handleAddTransport}
      />
    </div>
  );
};

export default Transport;
