import type { FC } from "react";
import styles from "./StatItem.module.scss";
import type { IStatItem } from "../StatList/types";

const StatItem: FC<IStatItem> = ({ title, value }) => {
  return (
    <div className={styles["stat-item"]}>
      <div className={styles["stat-item__header"]}>{title}</div>

      <div className={styles["stat-item__body"]}>{value}</div>
    </div>
  );
};

export default StatItem;
