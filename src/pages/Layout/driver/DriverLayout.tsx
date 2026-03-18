import { Outlet } from "react-router";
import styles from "./DriverLayout.module.scss";

const DriverLayout = () => {
    return (
        <div className={styles.driver}>
            <div className={styles.driver__header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <span className={styles.driver__label}>КАБІНЕТ</span>{" "}
                    <span className={styles.driver__accent}>ВОДІЯ</span>
                </div>
            </div>
            <div className={styles.driver__content}>
                <Outlet />
            </div>
        </div>
    );
};

export default DriverLayout;
