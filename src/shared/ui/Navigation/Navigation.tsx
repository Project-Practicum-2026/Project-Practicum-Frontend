import { NavLink, useNavigate } from "react-router";
import Button from "../Button/Button";
import styles from "./Navigation.module.scss";

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <ul className={styles.nav__list}>
        {/* Звичайні текстові посилання */}
        <li className={styles.nav__item}>
          <NavLink to="/" className={styles.nav__link}>
            Головна
          </NavLink>
        </li>
        <li className={styles.nav__item}>
          <NavLink to="/about" className={styles.nav__link}>
            Про нас
          </NavLink>
        </li>

        {/* кнопка авторизації */}
        <li className={`${styles["nav__item"]} ${styles["nav__item--action"]}`}>
          <Button
            variant="primary"
            onClick={() => {
              navigate("/login"); // Шлях до сторінки авторизації
            }}
          >
            Авторизація
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
