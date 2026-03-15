import type { FC } from "react";
import StatItem from "../StatItem/StatItem";
import type { IStatItem } from "./types";
import styles from "./StatList.module.scss";
import textData from "../../../textData/ua.json";

interface IStatList {
  data: IStatItem[];
}

const StatList: FC<IStatList> = ({ data }) => {
  return (
    <div className={styles["stats"]}>
      <h1>{textData.managerDashboard.title}</h1>
      <div className={styles["stats__list"]}>
        {data.map((stat) => (
          <StatItem
            key={stat.id}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>
    </div>
  );
};

export default StatList;
