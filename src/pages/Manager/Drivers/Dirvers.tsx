import { useState, useEffect, useCallback } from "react";
import UniversalForm, { type FormField } from "../../../shared/ui/UniversalForm/UniversalForm";
import type { TableColumn } from "../../../shared/ui/UniversalTable/UniversalTable";
import UniversalTable from "../../../shared/ui/UniversalTable/UniversalTable";
import textData from "../../../textData/ua.json";
import styles from "../../../shared/ui/UniversalTable/UniversalTable.module.scss";
import driverStyles from "./Drivers.module.scss";
import { getDrivers, addDriver, updateDriverStatus, getAllWarehouses, updateDriver, deleteDriver } from "../../../shared/api";
import type { IDriverResponse } from "../../../shared/api";
import type { IWarehouseResponse } from "../../../shared/api/types/driver/types";
import Loader from "../../../shared/ui/Loader/Loader";

const baseDriverFields: FormField[] = [
  {
    name: "full_name",
    label: textData.manager.drivers.fields.fullName.label,
    placeholder: textData.manager.drivers.fields.fullName.placeholder,
    rules: {
      required: textData.manager.drivers.fields.fullName.errorReq,
    },
  },
  {
    name: "password",
    label: textData.manager.drivers.fields.password.label,
    type: "password",
    placeholder: textData.manager.drivers.fields.password.placeholder,
    rules: {
      required: textData.manager.drivers.fields.password.errorReq,
      minLength: {
        value: 8,
        message: textData.manager.drivers.fields.password.errorMin,
      },
    },
  },
  {
    name: "email",
    label: textData.manager.drivers.fields.email.label,
    type: "email",
    placeholder: textData.manager.drivers.fields.email.placeholder,
    rules: {
      required: textData.manager.drivers.fields.email.errorReq,
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: textData.manager.drivers.fields.email.errorFormat,
      },
    },
  },
  {
    name: "phone",
    label: textData.manager.drivers.fields.phone.label,
    placeholder: textData.manager.drivers.fields.phone.placeholder,
    rules: {
      pattern: {
        value: /^\+?[0-9]{10,14}$/,
        message: textData.manager.drivers.fields.phone.errorFormat,
      },
    },
  },
  {
    name: "home_warehouse_id",
    label: textData.manager.drivers.fields.homeWarehouse.label,
    type: "select",
    placeholder: textData.manager.drivers.fields.homeWarehouse.placeholder,
    options: [], 
    rules: { required: "Будь ласка, оберіть склад" }
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
    header: textData.manager.drivers.columns.id,
    key: "id",
  },
  {
    header: textData.manager.drivers.columns.name,
    key: "name",
    editable: true,
  },
  {
    header: textData.manager.drivers.columns.status,
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
        <option value="В дорозі">{textData.manager.drivers.statuses.onTrip}</option>
        <option value="Очікує завантаження">{textData.manager.drivers.statuses.waiting}</option>
        <option value="Прибув. Очікує розвантаження">{textData.manager.drivers.statuses.arrived}</option>
        <option value="Не активний">{textData.manager.drivers.statuses.inactive}</option>
      </select>
    ),
  },
  {
    header: textData.manager.drivers.columns.email,
    key: "email",
    editable: true,
  },
];

const Drivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driverFields, setDriverFields] = useState<FormField[]>(baseDriverFields);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [driversData, warehousesData] = await Promise.all([
        getDrivers(),
        getAllWarehouses()
      ]);
      setDrivers(driversData.map(mapDriverToUI));
      
      const whOptions = warehousesData.map((wh: IWarehouseResponse) => ({
        value: wh.id,
        label: wh.name
      }));
      setDriverFields((prev) => 
        prev.map(f => f.name === "home_warehouse_id" ? { ...f, options: whOptions } : f)
      );
    } catch (err) {
      console.error("Failed to fetch drivers data:", err);
      setError(textData.manager.drivers.errors.fetch);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddDriver = async (data: Record<string, string>) => {
    try {
      setError(null);
      const phoneVal = data.phone?.trim() ? data.phone.trim() : null;
      const whIdVal = data.home_warehouse_id?.trim() ? data.home_warehouse_id.trim() : null;
      await addDriver({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        phone: phoneVal,
        home_warehouse_id: whIdVal,
      });
      // Refresh the list after adding
      await fetchData();
    } catch (err: any) {
      console.error("Failed to add driver, API Error:", err.response?.data || err);
      setError(textData.manager.drivers.errors.add);
    }
  };

  const handleSaveEdit = async (updatedDriver: Driver) => {
    const originalDriver = drivers.find(d => d._backendId === updatedDriver._backendId);
    
    // Update UI immediately (optimistic update)
    setDrivers((prev) =>
      prev.map((d) => (d._backendId === updatedDriver._backendId ? updatedDriver : d))
    );

    try {
      const promises = [];
      const statusMap: Record<string, string> = {
        "В дорозі": "on_trip",
        "Очікує завантаження": "waiting",
        "Прибув. Очікує розвантаження": "arrived",
        "Не активний": "off_duty",
      };

      if (originalDriver && originalDriver.status !== updatedDriver.status) {
        const backendStatus = statusMap[updatedDriver.status] || "off_duty";
        promises.push(updateDriverStatus(updatedDriver._backendId, backendStatus));
      }

      const nameChanged = originalDriver && originalDriver.name !== updatedDriver.name;
      const emailChanged = originalDriver && originalDriver.email !== updatedDriver.email;

      if (nameChanged || emailChanged) {
        promises.push(updateDriver(updatedDriver._backendId, {
          full_name: updatedDriver.name,
          email: updatedDriver.email
        }));
      }

      await Promise.all(promises);
    } catch (err) {
      console.error("Failed to sync driver:", err);
      if (originalDriver) {
        setDrivers((prev) =>
          prev.map((d) => (d._backendId === originalDriver._backendId ? originalDriver : d))
        );
      }
      alert("Помилка збереження даних водія");
    }
  };

  const handleDelete = async (driverToDelete: Driver) => {
    if (window.confirm(`${textData.manager.drivers.confirmDelete} ${driverToDelete.name}?`)) {
      try {
        await deleteDriver(driverToDelete._backendId);
        setDrivers((prev) => prev.filter((d) => d._backendId !== driverToDelete._backendId));
      } catch (err) {
        console.error("Failed to delete driver:", err);
        alert("Помилка при видаленні водія");
      }
    }
  };

  if (isLoading) {
    return (
      <div className={driverStyles.wrapper} style={{ display: "flex", justifyContent: "center" }}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={driverStyles.wrapper}>
      {error && <p style={{ color: "red", marginBottom: 16 }}>{error}</p>}

      <UniversalTable
        title={textData.manager.drivers.pageTitle}
        columns={driverColumns}
        data={drivers}
        onSaveEdit={handleSaveEdit}
        onDelete={handleDelete}
        deleteBtnText={textData.manager.drivers.deleteBtn}
      />
      <UniversalForm
        title={textData.manager.drivers.addTitle}
        submitText={textData.manager.drivers.addBtn}
        fields={driverFields}
        onSubmit={handleAddDriver}
      />
    </div>
  );
};

export default Drivers;
