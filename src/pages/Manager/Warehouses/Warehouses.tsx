import React, { useState } from "react";
import UniversalTable, { type TableColumn } from "../../../shared/ui/UniversalTable/UniversalTable";
import UniversalForm, { type FormField } from "../../../shared/ui/UniversalForm/UniversalForm";

export interface Warehouse {
  id: string;
  name: string;
  address: string;
}

const Warehouses: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    { id: "S34-057413", name: "Київський логістичний хаб", address: "м.Київ, вул. Антоновича, 43, 03150" },
    { id: "S48-028467", name: "Житомирський логістичний хаб", address: "м.Житомир, проспект Миру, 37, 10004" },
    { id: "S56-031488", name: "Львівський логістичний хаб", address: "м.Львів, вулиця Київська, 117, 80461" },
    { id: "S86-035888", name: "Рівенський логістичний хаб", address: "м.Рівне, вулиця Пасхальна, 28, 33015" },
    { id: "S86-035488", name: "Луцький логістичний хаб", address: "м.Луцьк, проспект Молоді, 9, 43008" },
  ]);

  const warehouseColumns: TableColumn<Warehouse>[] = [
    {
      header: "ID СКЛАДУ",
      key: "id",
    },
    {
      header: "НАЗВА",
      key: "name",
      editable: true,
    },
    {
      header: "АДРЕСА",
      key: "address",
      editable: true,
    },
  ];

  const addWarehouseFields: FormField[] = [
    {
      name: "name",
      label: "Назва",
      placeholder: "Харківський логістичний термінал",
      rules: {
        required: "Введіть назву складу",
        minLength: { value: 3, message: "Мінімум 3 символи" },
      },
    },
    {
      name: "address",
      label: "АДРЕСА",
      placeholder: "м.Харків, вулиця Українських героїв, 28, 10344",
      rules: {
        required: "Введіть повну адресу складу",
      },
    },
  ];

  const handleSaveEdit = (updatedWarehouse: Warehouse) => {
    console.log("Оновлено дані складу:", updatedWarehouse);
    setWarehouses((prev) => prev.map((w) => (w.id === updatedWarehouse.id ? updatedWarehouse : w)));
  };

  const handleDelete = (warehouse: Warehouse) => {
    if (window.confirm(`Ви дійсно хочете видалити склад "${warehouse.name}"?`)) {
      setWarehouses((prev) => prev.filter((w) => w.id !== warehouse.id));
    }
  };

  const handleAddWarehouse = (data: Record<string, string>) => {
    console.log("Дані нового складу для відправки:", data);

    const newWarehouse: Warehouse = {
      id: `S${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 900000 + 100000)}`,
      name: data.name,
      address: data.address,
    };

    setWarehouses((prev) => [...prev, newWarehouse]);
  };

  return (
    <div style={{ padding: 20 }}>
      <UniversalTable<Warehouse>
        title="СКЛАДИ ПАРТНЕРІВ"
        columns={warehouseColumns}
        data={warehouses}
        onSaveEdit={handleSaveEdit}
        onDelete={handleDelete}
        deleteBtnText="ВИДАЛИТИ СКЛАД"
      />

      <UniversalForm
        title="ДОДАТИ СКЛАД ДО СИСТЕМИ"
        fields={addWarehouseFields}
        submitText="ДОДАТИ СКЛАД"
        onSubmit={handleAddWarehouse}
      />
    </div>
  );
};

export default Warehouses;
