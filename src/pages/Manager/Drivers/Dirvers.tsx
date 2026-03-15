// import { DriversTable } from "../../../shared/ui/DriversTable/DriversTable";
import { useState } from "react";
import UniversalForm, { type FormField } from "../../../shared/ui/UniversalForm/UniversalForm";
import type { TableColumn } from "../../../shared/ui/UniversalTable/UniversalTable";
import UniversalTable from "../../../shared/ui/UniversalTable/UniversalTable";
import textData from "../../../textData/ua.json";
import styles from "../../../shared/ui/UniversalTable/UniversalTable.module.scss";
import driverStyles from "./Drivers.module.scss";

const driverFields: FormField[] = [
  {
    name: "fullName",
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
  {
    name: "warehouseAddress",
    label: "Склад, до якого буде приписаний",
    placeholder: "м.Київ, вул. Антоновича, 43",
    rules: {
      required: "Вкажіть адресу складу",
    },
  },
];

// 1. Інтерфейс даних
export interface Driver {
  id: string;
  name: string;
  status: "В дорозі" | "Очікує завантаження" | "Прибув. Очікує розвантаження" | "Не активний";
  email: string;
}

const driverColumns: TableColumn<Driver>[] = [
  {
    header: "ID ВОДІЯ",
    key: "id",
    // ID зазвичай не редагується, тому editable: false (за замовчуванням)
  },
  {
    header: "ІМ'Я",
    key: "name",
    editable: true, // Буде звичайний текстовий інпут
  },
  {
    header: "СТАТУС",
    key: "status",
    // Рендер для режиму читання
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
    // Рендер для режиму редагування (випадаючий список)
    renderEdit: (value, onChange) => (
      <select
        className={styles["universal-table__inline-select"]}
        value={value as string}
        // Явно вказуємо TS, що рядок з value відповідає нашому юніон-типу статусів
        onChange={(e) => onChange(e.target.value as Driver["status"])}>
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
  const [drivers, setDrivers] = useState<Driver[]>([
    { id: "D34-057413", name: "Степаненко Ігор Авралович", status: "В дорозі", email: "stepanenko@gmail.com" },
    {
      id: "D48-028467",
      name: "Грач Владислав Святогорович",
      status: "Очікує завантаження",
      email: "grach1337@gmail.com",
    },
    {
      id: "D56-031488",
      name: "Стукач Єпифаній Ізяславович",
      status: "Прибув. Очікує розвантаження",
      email: "stukach228@gmail.com",
    },
    { id: "D86-035888", name: "Прядко Олексій Татьянович", status: "Не активний", email: "psismylife@gmail.com" },
  ]);
  const handleAddDriver = (data: Record<string, string>) => {
    console.log("Дані нового водія:", data);
  };
  const handleSaveEdit = (updatedDriver: Driver) => {
    // Тут у майбутньому буде твій PUT/PATCH запит до Java бекенду
    console.log("Дані для оновлення на сервері:", updatedDriver);

    // Оновлюємо UI
    setDrivers((prevDrivers) => prevDrivers.map((d) => (d.id === updatedDriver.id ? updatedDriver : d)));
  };

  const handleDelete = (driverToDelete: Driver) => {
    // В реальному житті тут краще додати вікно підтвердження
    console.log("Видалення водія з ID:", driverToDelete.id);

    if (window.confirm(`Ви впевнені, що хочете видалити водія ${driverToDelete.name}?`)) {
      setDrivers((prevDrivers) => prevDrivers.filter((d) => d.id !== driverToDelete.id));
    }
  };
  return (
    <div className={driverStyles.drivers}>
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
