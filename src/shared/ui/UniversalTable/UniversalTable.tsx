import React, { useState } from "react";
import styles from "./UniversalTable.module.scss";

export interface TableColumn<T> {
  header: string;
  key?: keyof T;
  render?: (item: T) => React.ReactNode;
  editable?: boolean;
  renderEdit?: (
    value: T[keyof T] | undefined,
    onChange: (newValue: T[keyof T]) => void,
    rowData: Partial<T>,
  ) => React.ReactNode;
}

interface UniversalTableProps<T> {
  title: string;
  columns: TableColumn<T>[];
  data: T[];
  onSaveEdit: (item: T) => void;
  onDelete: (item: T) => void;
  deleteBtnText: string;
}

function UniversalTable<T extends { id: string | number }>({
  title,
  columns,
  data,
  onSaveEdit,
  onDelete,
  deleteBtnText,
}: UniversalTableProps<T>) {
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<T>>({});

  const handleStartEdit = (item: T) => {
    setEditingId(item.id);
    setEditFormData(item);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSave = () => {
    onSaveEdit(editFormData as T);
    setEditingId(null);
  };

  const handleInputChange = (key: keyof T, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [key]: value as T[keyof T],
    }));
  };

  return (
    <div className={styles["universal-table"]}>
      <h2 className={styles["universal-table__header-title"]}>{title}</h2>

      <table className={styles["universal-table__table"]}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={styles["universal-table__th"]}>
                {col.header}
              </th>
            ))}
            <th
              className={styles["universal-table__th"]}
              style={{ border: "none", background: "transparent" }}
            />
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const isEditing = editingId === item.id;

            return (
              <tr key={item.id}>
                {columns.map((col, index) => {
                  if (isEditing) {
                    if (col.renderEdit) {
                      return (
                        <td
                          key={index}
                          className={styles["universal-table__td"]}>
                          {col.renderEdit(
                            col.key ? editFormData[col.key] : undefined,
                            (val: T[keyof T]) => {
                              if (col.key) {
                                setEditFormData((prev) => ({ ...prev, [col.key as keyof T]: val }));
                              }
                            },
                            editFormData,
                          )}
                        </td>
                      );
                    }
                    if (col.editable && col.key) {
                      const cellValue = editFormData[col.key];

                      return (
                        <td
                          key={index}
                          className={styles["universal-table__td"]}>
                          <input
                            type="text"
                            className={styles["universal-table__inline-input"]}
                            value={cellValue !== undefined ? String(cellValue) : ""}
                            onChange={(e) => handleInputChange(col.key as keyof T, e.target.value)}
                          />
                        </td>
                      );
                    }
                  }

                  return (
                    <td
                      key={index}
                      className={styles["universal-table__td"]}>
                      {col.render ? col.render(item) : String(col.key ? item[col.key] : "")}
                    </td>
                  );
                })}

                <td className={`${styles["universal-table__td"]} ${styles["universal-table__td--actions"]}`}>
                  <div className={styles["universal-table__actions"]}>
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          className={`${styles["universal-table__btn"]} ${styles["universal-table__btn--save"]}`}>
                          ЗБЕРЕГТИ
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className={`${styles["universal-table__btn"]} ${styles["universal-table__btn--cancel"]}`}>
                          СКАСУВАТИ
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(item)}
                          className={`${styles["universal-table__btn"]} ${styles["universal-table__btn--edit"]}`}>
                          РЕДАГУВАТИ ДАНІ
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className={`${styles["universal-table__btn"]} ${styles["universal-table__btn--delete"]}`}>
                          {deleteBtnText}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default UniversalTable;
