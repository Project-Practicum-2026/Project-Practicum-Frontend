import { useEffect, useState } from "react";
import { getCargos } from "../../../shared/api";
import type { ICargoResponse } from "../../../shared/api/types/manager/types";
import Loader from "../../../shared/ui/Loader/Loader";
import styles from "./Cargo.module.scss";

const Cargo = () => {
  const [cargos, setCargos] = useState<ICargoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "IN_TRANSIT" | "DELIVERED">("ALL");

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        setIsLoading(true);
        const data = await getCargos();
        setCargos(data);
      } catch (err) {
        console.error("Failed to load cargos:", err);
        setError("Помилка завантаження вантажів.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCargos();
  }, []);

  const filteredCargos = cargos.filter(c => filter === "ALL" || c.status === filter);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>ВАНТАЖІ</h2>
        <div className={styles.filters}>
          <button className={filter === "ALL" ? styles.activeFilter : ""} onClick={() => setFilter("ALL")}>Всі</button>
          <button className={filter === "PENDING" ? styles.activeFilter : ""} onClick={() => setFilter("PENDING")}>Очікують</button>
          <button className={filter === "IN_TRANSIT" ? styles.activeFilter : ""} onClick={() => setFilter("IN_TRANSIT")}>В дорозі</button>
          <button className={filter === "DELIVERED" ? styles.activeFilter : ""} onClick={() => setFilter("DELIVERED")}>Доставлені</button>
        </div>
      </div>

      {error && <p style={{ color: "red", marginTop: 20 }}>{error}</p>}

      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Опис</th>
                <th>Вага (кг)</th>
                <th>Об'єм (м³)</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {filteredCargos.map((cargo) => (
                <tr key={cargo.id}>
                  <td>{cargo.external_id || cargo.id.substring(0, 8)}</td>
                  <td>{cargo.description || "-"}</td>
                  <td>{cargo.weight_kg.toFixed(2)}</td>
                  <td>{cargo.volume_m3.toFixed(2)}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[`status_${cargo.status}`]}`}>
                      {cargo.status === "PENDING" ? "Очікує" : cargo.status === "IN_TRANSIT" ? "В дорозі" : "Доставлено"}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredCargos.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                    Вантажів не знайдено
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Cargo;
