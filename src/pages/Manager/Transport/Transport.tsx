import { useState } from "react";
import UniversalTable, { type TableColumn } from "../../../shared/ui/UniversalTable/UniversalTable";
import UniversalForm, { type FormField } from "../../../shared/ui/UniversalForm/UniversalForm";
import styles from "../../../shared/ui/UniversalTable/UniversalTable.module.scss"; // Для стилів інлайн-селекту

export interface Transport {
  id: string;
  dimensions: string;
  status: "В дорозі" | "Очікує завантаження" | "Прибув. Очікує розвантаження" | "Не активний";
  locationData: string;
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
    <circle
      cx="12"
      cy="10"
      r="3"></circle>
  </svg>
);

const Transport = () => {
  const [vehicles, setVehicles] = useState<Transport[]>([
    { id: "T34-057413", dimensions: "90 м³, 20 тон", status: "В дорозі", locationData: "hidden" },
    { id: "T48-028467", dimensions: "45 м³, 10 тон", status: "Очікує завантаження", locationData: "hidden" },
    { id: "T56-031488", dimensions: "90 м³, 20 тон", status: "Прибув. Очікує розвантаження", locationData: "hidden" },
    { id: "T86-035888", dimensions: "90 м³, 20 тон", status: "Не активний", locationData: "hidden" },
    { id: "T12-023487", dimensions: "90 м³, 20 тон", status: "Не активний", locationData: "hidden" },
  ]);

  const transportColumns: TableColumn<Transport>[] = [
    {
      header: "ID ТЗ",
      key: "id",
    },
    {
      header: "ГАБАРИТИ",
      key: "dimensions",
      editable: true,
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

        const statusLines = vehicle.status.split(". ");
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
          onChange={(e) => onChange(e.target.value as Transport["status"])}>
          <option value="В дорозі">В дорозі</option>
          <option value="Очікує завантаження">Очікує завантаження</option>
          <option value="Прибув. Очікує розвантаження">Прибув. Очікує розвантаження</option>
          <option value="Не активний">Не активний</option>
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
      name: "dimensions",
      label: "Габарити",
      placeholder: "45 м³, 10 тон",
      rules: { required: "Вкажіть габарити ТЗ" },
    },
    {
      name: "location",
      label: "Геолокація",
      type: "password",
      placeholder: "••••••••••••••••••",
      rules: { required: "Додайте дані геолокації" },
    },
  ];

  const handleSaveEdit = (updatedVehicle: Transport) => {
    console.log("Оновлено ТЗ:", updatedVehicle);
    setVehicles((prev) => prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v)));
  };

  const handleDelete = (vehicle: Transport) => {
    if (window.confirm(`Видалити транспорт ${vehicle.id}?`)) {
      setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
    }
  };

  const handleAddTransport = (data: Record<string, string>) => {
    console.log("Дані нового ТЗ для бекенду:", data);
    const newVehicle: Transport = {
      id: `T${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 900000 + 100000)}`,
      dimensions: data.dimensions,
      status: "Не активний",
      locationData: data.location,
    };
    setVehicles((prev) => [...prev, newVehicle]);
  };

  return (
    <div style={{ padding: 20 }}>
      {/* <div style={{ backgroundColor: "#caffda", padding: "20px", flex: 1 }}> */}
      <UniversalTable<Transport>
        title="ТРАНСПОРТ КОМПАНІЇ"
        columns={transportColumns}
        data={vehicles}
        onSaveEdit={handleSaveEdit}
        onDelete={handleDelete}
        deleteBtnText="ВИДАЛИТИ ТЗ"
      />
      {/* </div> */}
      {/* 
      <hr
        style={{
          border: "none",
          borderTop: "2px dotted #4db8ff",
          margin: 0,
        }}
      /> */}

      {/* <div style={{ backgroundColor: "#baf3ff", padding: "20px", paddingBottom: "60px" }}> */}
      <UniversalForm
        title="ДОДАТИ ТЗ ДО СИСТЕМИ"
        fields={addTransportFields}
        submitText="ДОДАТИ ТЗ"
        onSubmit={handleAddTransport}
      />
      {/* </div> */}
    </div>
  );
};

export default Transport;
