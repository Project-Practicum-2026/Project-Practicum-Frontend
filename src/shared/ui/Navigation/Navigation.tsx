import { NavLink, useNavigate } from "react-router";
import Button from "../Button/Button";
import styles from "./Navigation.module.scss";
import textData from "../../../textData/ua.json";

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <ul className={styles.nav__list}>
        {/* Звичайні текстові посилання */}
        <li className={styles.nav__item}>
          <NavLink to="/" className={styles.nav__link}>
            {textData.nav.home}
          </NavLink>
        </li>
        <li className={styles.nav__item}>
          <NavLink to="/about" className={styles.nav__link}>
            {textData.nav.about}
          </NavLink>
        </li>

        {/* кнопка авторизації */}
        <li className={`${styles["nav__item"]} ${styles["nav__item--action"]}`}>
          <Button
            variant="primary"
            onClick={() => {
              navigate("/login");
            }}
          >
            {textData.nav.login}
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
