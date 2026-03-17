import { useState, useEffect, useCallback } from "react";
import UniversalForm, { type FormField } from "../../../shared/ui/UniversalForm/UniversalForm";
import type { TableColumn } from "../../../shared/ui/UniversalTable/UniversalTable";
import UniversalTable from "../../../shared/ui/UniversalTable/UniversalTable";
import textData from "../../../textData/ua.json";
import styles from "../../../shared/ui/UniversalTable/UniversalTable.module.scss";
import driverStyles from "./Drivers.module.scss";
import { getDrivers, addDriver, updateDriverStatus, getWarehouses } from "../../../shared/api";
import type { IDriverResponse } from "../../../shared/api";
import type { IWarehouseResponse } from "../../../shared/api/types/driver/types";
import Loader from "../../../shared/ui/Loader/Loader";

const driverFields: FormField[] = [
  {
    name: "full_name",
    label: textData.manager.dashboard.drivers.title,
    placeholder: textData.placeholders.fullName,
    rules: {
      required: "Введіть ПІБ водія",
    },
  },
  {
    name: "password",
    label: "Пароль",
    type: "password",
    placeholder: "••••••••••••••••",
    rules: {
      required: "Введіть пароль",
      minLength: {
        value: 8,
        message: "Мінімум 8 символів",
      },
    },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "kakayapochta@gmail.com",
    rules: {
      required: "Введіть email",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Некоректний формат email",
      },
    },
  },
];

// UI model for the table
export interface Driver {
  id: string;
  name: string;
  status: "В дорозі" | "Очікує завантаження" | "Прибув. Очікує розвантаження" | "Не активний";
  email: string;
  _backendId: string; // store backend UUID
}

// Map backend status to UI status
const mapBackendStatus = (status: string): Driver["status"] => {
  switch (status) {
    case "on_trip":
    case "on_road":
      return "В дорозі";
    case "waiting":
    case "loading":
      return "Очікує завантаження";
    case "unloading":
    case "arrived":
      return "Прибув. Очікує розвантаження";
    default:
      return "Не активний";
  }
};

// Map backend driver to UI model
const mapDriverToUI = (driver: IDriverResponse): Driver => ({
  id: driver.id.slice(0, 12).toUpperCase(),
  name: driver.user.full_name,
  status: mapBackendStatus(driver.status),
  email: driver.user.email,
  _backendId: driver.id,
});

const driverColumns: TableColumn<Driver>[] = [
  {
    header: "ID ВОДІЯ",
    key: "id",
  },
  {
    header: "ІМ'Я",
    key: "name",
    editable: true,
  },
  {
    header: "СТАТУС",
    key: "status",
    render: (driver) => {
      let color = "#ccc";
      switch (driver.status) {
        case "В дорозі":
          color = "#ff4d6d";
          break;
        case "Очікує завантаження":
          color = "#4db8ff";
          break;
        case "Прибув. Очікує розвантаження":
          color = "#42df8e";
          break;
        case "Не активний":
          color = "#a0a0a0";
          break;
      }

      const statusLines = driver.status.split(". ");

      return (
        <div style={{ color, display: "flex", flexDirection: "column" }}>
          {statusLines.map((line, idx) => (
            <span key={idx}>{line}</span>
          ))}
        </div>
      );
    },
    renderEdit: (value, onChange) => (
      <select
        className={styles["universal-table__inline-select"]}
        value={value as string}
        onChange={(e) => onChange(e.target.value as Driver["status"])}
      >
        <option value="В дорозі">В дорозі</option>
        <option value="Очікує завантаження">Очікує завантаження</option>
        <option value="Прибув. Очікує розвантаження">Прибув. Очікує розвантаження</option>
        <option value="Не активний">Не активний</option>
      </select>
    ),
  },
  {
    header: "ПОШТА",
    key: "email",
    editable: true,
  },
  {
    header: "ПАРОЛЬ",
    render: () => "••••••••••••",
  },
];

const Drivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getDrivers();
      setDrivers(data.map(mapDriverToUI));
    } catch (err) {
      console.error("Failed to fetch drivers:", err);
      setError("Не вдалося завантажити список водіїв");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleAddDriver = async (data: Record<string, string>) => {
    try {
      setError(null);
      await addDriver({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
      });
      // Refresh the list after adding
      await fetchDrivers();
    } catch (err) {
      console.error("Failed to add driver:", err);
      setError("Не вдалося додати водія. Перевірте дані та спробуйте знову.");
    }
  };

  const handleSaveEdit = (updatedDriver: Driver) => {
    // Update UI immediately (optimistic update)
    setDrivers((prev) =>
      prev.map((d) => (d._backendId === updatedDriver._backendId ? updatedDriver : d))
    );

    // Try to sync status to backend in background
    const statusMap: Record<string, string> = {
      "В дорозі": "on_trip",
      "Очікує завантаження": "waiting",
      "Прибув. Очікує розвантаження": "arrived",
      "Не активний": "off_duty",
    };
    const backendStatus = statusMap[updatedDriver.status] || "off_duty";
    updateDriverStatus(updatedDriver._backendId, backendStatus).catch((err) => {
      console.error("Failed to sync driver status:", err);
    });
  };

  const handleDelete = (driverToDelete: Driver) => {
    if (window.confirm(`Ви впевнені, що хочете видалити водія ${driverToDelete.name}?`)) {
      setDrivers((prev) => prev.filter((d) => d._backendId !== driverToDelete._backendId));
    }
  };

  if (isLoading) {
    return (
      <div className={driverStyles.drivers} style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={driverStyles.drivers}>
      {error && <p style={{ color: "red", marginBottom: 16 }}>{error}</p>}

      <UniversalTable
        title="ВОДІЇ КОМПАНІЇ"
        columns={driverColumns}
        data={drivers}
        onSaveEdit={handleSaveEdit}
        onDelete={handleDelete}
        deleteBtnText="ВИДАЛИТИ ВОДІЯ"
      />
      <UniversalForm
        title={textData.manager.dashboard.drivers.title}
        submitText={textData.buttons.addDriver}
        fields={driverFields}
        onSubmit={handleAddDriver}
      />
    </div>
  );
};

export default Drivers;
