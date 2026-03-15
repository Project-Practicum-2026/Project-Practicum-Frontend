import DashboardTable from "../../../shared/ui/DashboardTable/DashboardTable";
import StatList from "../../../shared/ui/StatList/StatList";
import styles from "./Dashboard.module.scss";

const tripsData = [
  {
    id: "R26-030413",
    driver: "Степаненко Ігор Авралович",
    status: "В дорозі",
    modifier: "in-progress",
    dep: "м.Львів, вулиця Київська, 117, 80461",
    depTime: "03.04.2026 7:38:00",
    arr: "м.Київ, вул. Антоновича, 43, 03150",
    arrTime: "03.04.2026 18:38:00",
  },
  {
    id: "R26-030467",
    driver: "Грач Владислав Святогорович",
    status: "Очікує завантаження",
    modifier: "waiting",
    dep: "м.Київ, вул. Антоновича, 43, 03150",
    depTime: "03.04.2026 8:05:00",
    arr: "м.Житомир, проспект Миру, 37, 10004",
    arrTime: "03.04.2026 10:30:00",
  },
  {
    id: "R26-030488",
    driver: "Стукач Єпифаній Ізяславович",
    status: "Прибув. Очікує розвантаження",
    modifier: "arrived",
    dep: "м.Луцьк, проспект Молоді, 9, 43008",
    depTime: "03.04.2026 6:35:00",
    arr: "м.Рівне, вулиця Пасхальна, 28, 33015",
    arrTime: "03.04.2026 8:10:00",
  },
];

const statsData = [
  { id: "1", title: "Кількість ТЗ, які зараз у рейсі", value: "3" },
  { id: "2", title: "Кількість ТЗ, які зараз вільні", value: "7" },
  { id: "3", title: "Загальна завантаженість", value: "30%" },
];

const Dashboard = () => {
  return (
    <div className={styles["container"]}>
      <DashboardTable data={tripsData} />
      <StatList data={statsData} />
    </div>
  );
};

export default Dashboard;
