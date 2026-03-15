import { useState } from "react";
import UniversalTable, { type TableColumn } from "../../../shared/ui/UniversalTable/UniversalTable";
import UniversalForm, { type FormField } from "../../../shared/ui/UniversalForm/UniversalForm";

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
    name: "fullName",
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
  const [managers, setManagers] = useState<Manager[]>([
    {
      id: "M34-042413",
      name: "Шевченко Ігор Миколайович",
      email: "igorpatriot@gmail.com",
    },
    {
      id: "M67-032453",
      name: "Шевченко Антон Миколайович",
      email: "anton@gmail.com",
    },
  ]);

  const handleSaveEdit = (updatedManager: Manager) => {
    console.log("Відправляємо оновлені дані менеджера на бекенд:", updatedManager);

    setManagers((prevManagers) => prevManagers.map((m) => (m.id === updatedManager.id ? updatedManager : m)));
  };

  const handleDelete = (managerToDelete: Manager) => {
    if (window.confirm(`Ви впевнені, що хочете видалити менеджера ${managerToDelete.name}?`)) {
      console.log("Видалення менеджера з ID:", managerToDelete.id);
      setManagers((prevManagers) => prevManagers.filter((m) => m.id !== managerToDelete.id));
    }
  };

  const handleAddManager = (data: Record<string, string>) => {
    console.log("Дані нового менеджера готові до відправки:", data);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#e6ffe6", minHeight: "100vh" }}>
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
