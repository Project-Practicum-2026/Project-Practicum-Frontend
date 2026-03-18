import { useState, useEffect, useCallback } from "react";
import UniversalTable, { type TableColumn } from "../../../shared/ui/UniversalTable/UniversalTable";
import UniversalForm, { type FormField } from "../../../shared/ui/UniversalForm/UniversalForm";
import styles from "../../../shared/ui/UniversalTable/UniversalTable.module.scss";
import {
  getVehicles,
  addVehicle,
  getVehicleTypes,
  addVehicleType,
  updateVehicle,
  deleteVehicle,
  updateVehicleStatus,
  updateVehicleType,
  deleteVehicleType,
  getAllWarehouses,
} from "../../../shared/api";
import type { IVehicleResponse, IVehicleTypeResponse } from "../../../shared/api";
import type { IWarehouseResponse } from "../../../shared/api/types/driver/types";
import Loader from "../../../shared/ui/Loader/Loader";
import localStyles from "./Transport.module.scss";
import textData from "../../../textData/ua.json";

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
  const [addTransportFields, setAddTransportFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [vehiclesData, typesData, warehousesData] = await Promise.all([
        getVehicles(),
        getVehicleTypes(),
        getAllWarehouses(),
      ]);
      setVehicles(vehiclesData.map(mapVehicleToUI));
      setVehicleTypes(typesData);
      
      const typeOptions = typesData.map(t => ({ value: t.id, label: t.name }));
      const whOptions = warehousesData.map((wh: IWarehouseResponse) => ({ value: wh.id, label: wh.name }));
      
      // We will define baseAddTransportFields down below, but we need to set state here.
      // So we map it inline or reference it. We'll reference a local constant inside fetchData.
      const updatedFields: FormField[] = [
        {
          name: "plate_number",
          label: textData.manager.transport.fields.plateNumber.label,
          placeholder: textData.manager.transport.fields.plateNumber.placeholder,
          rules: { required: textData.manager.transport.fields.plateNumber.errorReq },
        },
        {
          name: "vehicle_type_id",
          label: textData.manager.transport.fields.vehicleTypeId.label,
          type: "select",
          placeholder: textData.manager.transport.fields.vehicleTypeId.placeholderDefault,
          options: typeOptions,
          rules: { required: textData.manager.transport.fields.vehicleTypeId.errorReq },
        },
        {
          name: "current_warehouse_id",
          label: textData.manager.transport.fields.currentWarehouse.label,
          type: "select",
          placeholder: textData.manager.transport.fields.currentWarehouse.placeholder,
          options: whOptions,
        },
      ];
      setAddTransportFields(updatedFields);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
      setError(textData.manager.transport.errors.fetch);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const transportColumns: TableColumn<TransportUI>[] = [
    {
      header: textData.manager.transport.columns.plateNumber,
      key: "plateNumber",
      editable: true,
    },
    {
      header: textData.manager.transport.columns.dimensions,
      key: "dimensions",
    },
    {
      header: textData.manager.transport.columns.status,
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
          <option value="В дорозі">{textData.manager.transport.statuses.onTrip}</option>
          <option value="Доступний">{textData.manager.transport.statuses.available}</option>
          <option value="На обслуговуванні">{textData.manager.transport.statuses.maintenance}</option>
        </select>
      ),
    },
    {
      header: textData.manager.transport.columns.location,
      render: () => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <MapPinIcon />
        </div>
      ),
    },
  ];

  const vehicleTypeColumns: TableColumn<IVehicleTypeResponse>[] = [
    { header: "Назва", key: "name", editable: true },
    { header: "Макс. вага (кг)", key: "max_weight_kg", editable: true },
    { header: "Макс. об'єм (м³)", key: "max_volume_m3", editable: true },
    { header: "ORS Профіль", key: "ors_profile", editable: true },
  ];

  const addVehicleTypeFields: FormField[] = [
    { name: "name", label: "Назва типу (напр. 'Вантажівка 5т')", placeholder: "Введіть назву", rules: { required: "Введіть назву" } },
    { name: "max_weight_kg", label: "Макс. вага (кг)", placeholder: "5000", rules: { required: "Обов'язково" } },
    { name: "max_volume_m3", label: "Макс. об'єм (м³)", placeholder: "25", rules: { required: "Обов'язково" } },
    { name: "ors_profile", label: "ORS Профіль (driving-hgv / driving-car)", placeholder: "driving-hgv", rules: { required: "Обов'язково" } },
  ];

  const handleSaveEdit = async (updatedVehicle: TransportUI) => {
    const originalVehicle = vehicles.find((v) => v._backendId === updatedVehicle._backendId);
    
    // Update UI immediately (optimistic update)
    setVehicles((prev) =>
      prev.map((v) => (v._backendId === updatedVehicle._backendId ? updatedVehicle : v))
    );

    try {
      const promises = [];
      const statusMap: Record<string, "available" | "on_trip" | "maintenance"> = {
        "В дорозі": "on_trip",
        "Доступний": "available",
        "На обслуговуванні": "maintenance",
      };

      if (originalVehicle && originalVehicle.status !== updatedVehicle.status) {
        const backendStatus = statusMap[updatedVehicle.status] || "available";
        promises.push(updateVehicleStatus(updatedVehicle._backendId, backendStatus));
      }

      if (originalVehicle && originalVehicle.plateNumber !== updatedVehicle.plateNumber) {
        promises.push(updateVehicle(updatedVehicle._backendId, {
          plate_number: updatedVehicle.plateNumber
        }));
      }

      await Promise.all(promises);
    } catch (err) {
      console.error("Failed to sync vehicle:", err);
      if (originalVehicle) {
        setVehicles((prev) =>
          prev.map((v) => (v._backendId === originalVehicle._backendId ? originalVehicle : v))
        );
      }
      alert("Помилка збереження даних транспортного засобу");
    }
  };

  const handleDelete = async (vehicleToDelete: TransportUI) => {
    if (window.confirm(`Ви дійсно бажаєте видалити транспортний засіб "${vehicleToDelete.plateNumber}"?`)) {
      try {
        await deleteVehicle(vehicleToDelete._backendId);
        setVehicles(prev => prev.filter(v => v._backendId !== vehicleToDelete._backendId));
      } catch (err) {
        console.error("Failed to delete vehicle:", err);
        alert("Помилка при видаленні транспортного засобу");
      }
    }
  };

  const handleAddTransport = async (data: Record<string, string>) => {
    try {
      setError(null);
      const whIdVal = data.current_warehouse_id?.trim() ? data.current_warehouse_id.trim() : null;
      await addVehicle({
        plate_number: data.plate_number,
        vehicle_type_id: data.vehicle_type_id,
        current_warehouse_id: whIdVal,
      });
      await fetchData();
    } catch (err: any) {
      console.error("Failed to add vehicle:", err.response?.data || err);
      setError(textData.manager.transport.errors.add);
    }
  };

  const handleAddVehicleType = async (data: Record<string, string>) => {
    try {
      setError(null);
      await addVehicleType({
        name: data.name,
        max_weight_kg: Number(data.max_weight_kg),
        max_volume_m3: Number(data.max_volume_m3),
        ors_profile: data.ors_profile,
      });
      await fetchData();
    } catch (err: any) {
      console.error("Failed to add vehicle type:", err.response?.data || err);
      setError("Не вдалося додати тип транспорту");
    }
  };

  const handleSaveEditType = async (updatedType: IVehicleTypeResponse) => {
    const original = vehicleTypes.find(t => t.id === updatedType.id);
    setVehicleTypes(prev => prev.map(t => t.id === updatedType.id ? updatedType : t));
    try {
      await updateVehicleType(updatedType.id, {
        name: updatedType.name,
        max_weight_kg: Number(updatedType.max_weight_kg),
        max_volume_m3: Number(updatedType.max_volume_m3),
        ors_profile: updatedType.ors_profile,
      });
    } catch (err) {
      console.error("Failed to update vehicle type:", err);
      if (original) {
        setVehicleTypes(prev => prev.map(t => t.id === original.id ? original : t));
      }
      alert("Помилка збереження типу транспорту");
    }
  };

  const handleDeleteType = async (typeToDelete: IVehicleTypeResponse) => {
    if (window.confirm(`Ви дійсно бажаєте видалити тип "${typeToDelete.name}"?`)) {
      try {
        await deleteVehicleType(typeToDelete.id);
        setVehicleTypes(prev => prev.filter(t => t.id !== typeToDelete.id));
      } catch (err) {
        console.error("Failed to delete vehicle type:", err);
        alert("Помилка при видаленні типу транспорту");
      }
    }
  };

  if (isLoading) {
    return (
      <div className={localStyles.wrapper} style={{ display: "flex", justifyContent: "center" }}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={localStyles.wrapper}>
      {error && <p style={{ color: "red", marginBottom: 16 }}>{error}</p>}

      <UniversalTable<TransportUI>
        title={textData.manager.transport.pageTitle}
        columns={transportColumns}
        data={vehicles}
        onSaveEdit={handleSaveEdit}
        onDelete={handleDelete}
        deleteBtnText="Видалити"
      />

      <UniversalForm
        title={textData.manager.transport.addTitle}
        fields={addTransportFields}
        submitText={textData.manager.transport.addBtn}
        onSubmit={handleAddTransport}
      />

      <div style={{ marginTop: "40px" }}></div>

      <UniversalTable<IVehicleTypeResponse>
        title="Типи транспортних засобів"
        columns={vehicleTypeColumns}
        data={vehicleTypes}
        onDelete={handleDeleteType}
        onSaveEdit={handleSaveEditType}
        deleteBtnText="Видалити тип"
      />

      <UniversalForm
        title="Додати новий тип транспорту"
        fields={addVehicleTypeFields}
        submitText="ДОДАТИ ТИП ТЗ"
        onSubmit={handleAddVehicleType}
      />
    </div>
  );
};

export default Transport;
