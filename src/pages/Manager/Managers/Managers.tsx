import { useState, useEffect, useCallback } from "react";
import UniversalTable, { type TableColumn } from "../../../shared/ui/UniversalTable/UniversalTable";
import UniversalForm, { type FormField } from "../../../shared/ui/UniversalForm/UniversalForm";
import { registerUser } from "../../../shared/api";
import { ERoles } from "../../../shared/api/types/auth/types";
import Loader from "../../../shared/ui/Loader/Loader";

const managerColumns: TableColumn<Manager>[] = [
  {
    header: "ID",
    key: "id",
  },
  {
    header: "ІМ'Я",
    key: "name",
    editable: true,
  },
  {
    header: "ПОШТА",
    key: "email",
    editable: true,
  },
  {
    header: "ПАРОЛЬ",
    render: () => "•••••••••••••••",
  },
];

const managerFields: FormField[] = [
  {
    name: "full_name",
    label: "Прізвище, ім'я, по батькові",
    placeholder: "Швець Ірина Олександрівна",
    rules: {
      required: "Введіть ПІБ менеджера",
      minLength: {
        value: 5,
        message: "Мінімум 5 символів",
      },
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
        message: "Пароль має містити мінімум 8 символів",
      },
    },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "okak@gmail.com",
    rules: {
      required: "Введіть email",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Некоректний формат email адреси",
      },
    },
  },
];

export interface Manager {
  id: string;
  name: string;
  email: string;
}

const Managers = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveEdit = (updatedManager: Manager) => {
    setManagers((prevManagers) =>
      prevManagers.map((m) => (m.id === updatedManager.id ? updatedManager : m))
    );
  };

  const handleDelete = (managerToDelete: Manager) => {
    if (window.confirm(`Ви впевнені, що хочете видалити менеджера ${managerToDelete.name}?`)) {
      setManagers((prevManagers) =>
        prevManagers.filter((m) => m.id !== managerToDelete.id)
      );
    }
  };

  const handleAddManager = async (data: Record<string, string>) => {
    try {
      setError(null);
      await registerUser({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        role: ERoles.MANAGER,
      });

      // Add to local list since there's no dedicated managers list endpoint
      const newManager: Manager = {
        id: `M${Date.now().toString().slice(-8)}`,
        name: data.full_name,
        email: data.email,
      };
      setManagers((prev) => [...prev, newManager]);
    } catch (err) {
      console.error("Failed to add manager:", err);
      setError("Не вдалося додати менеджера. Можливо, email вже зайнятий.");
    }
  };

  return (
    <div style={{ padding: "20px", minHeight: "100vh" }}>
      {error && <p style={{ color: "red", marginBottom: 16 }}>{error}</p>}

      <UniversalTable<Manager>
        title="МЕНЕДЖЕРИ КОМПАНІЇ"
        columns={managerColumns}
        data={managers}
        onSaveEdit={handleSaveEdit}
        onDelete={handleDelete}
        deleteBtnText="ВИДАЛИТИ МЕНЕДЖЕРА"
      />
      <UniversalForm
        title="ДОДАТИ МЕНЕДЖЕРА ДО СИСТЕМИ"
        fields={managerFields}
        submitText="ДОДАТИ МЕНЕДЖЕРА"
        onSubmit={handleAddManager}
      />
    </div>
  );
};

export default Managers;
