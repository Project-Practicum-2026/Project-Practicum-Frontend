import React, { useState, useEffect, useCallback } from "react";
import UniversalTable, { type TableColumn } from "../../../shared/ui/UniversalTable/UniversalTable";
import UniversalForm, { type FormField } from "../../../shared/ui/UniversalForm/UniversalForm";
import { getAllWarehouses, addWarehouse } from "../../../shared/api";
import type { IWarehouseResponse } from "../../../shared/api/types/driver/types";
import Loader from "../../../shared/ui/Loader/Loader";

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  _backendId: string;
}

const Warehouses: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWarehouses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllWarehouses();
      setWarehouses(
        data.map((w) => ({
          id: w.id.slice(0, 12).toUpperCase(),
          name: w.name,
          address: w.address,
          _backendId: w.id,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch warehouses:", err);
      setError("Не вдалося завантажити список складів");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

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
    {
      name: "contact_email",
      label: "Контактний Email",
      type: "email",
      placeholder: "warehouse@company.com",
      rules: {
        required: "Введіть контактний email",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Некоректний формат email",
        },
      },
    },
    {
      name: "latitude",
      label: "Широта",
      placeholder: "49.9935",
      rules: {
        required: "Введіть широту",
      },
    },
    {
      name: "longitude",
      label: "Довгота",
      placeholder: "36.2304",
      rules: {
        required: "Введіть довготу",
      },
    },
  ];

  const handleSaveEdit = (updatedWarehouse: Warehouse) => {
    setWarehouses((prev) =>
      prev.map((w) => (w._backendId === updatedWarehouse._backendId ? updatedWarehouse : w))
    );
  };

  const handleDelete = (warehouse: Warehouse) => {
    if (window.confirm(`Ви дійсно хочете видалити склад "${warehouse.name}"?`)) {
      setWarehouses((prev) => prev.filter((w) => w._backendId !== warehouse._backendId));
    }
  };

  const handleAddWarehouse = async (data: Record<string, string>) => {
    try {
      setError(null);
      await addWarehouse({
        name: data.name,
        address: data.address,
        contact_email: data.contact_email,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      });
      await fetchWarehouses();
    } catch (err) {
      console.error("Failed to add warehouse:", err);
      setError("Не вдалося додати склад. Перевірте дані.");
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
