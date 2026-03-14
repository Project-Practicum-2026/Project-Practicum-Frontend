import { NavLink, useNavigate } from "react-router";
import Button from "../Button/Button";
import styles from "./Navigation.module.scss";
import textData from "../../../textData/ua.json";
import { EButtonVariants } from "../../types/button.types";
import { ROUTES } from "../../config/routes";

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <ul className={styles.nav__list}>
        {/* Звичайні текстові посилання */}
        <li className={styles.nav__item}>
          <NavLink
            to={ROUTES.ROOT}
            className={styles.nav__link}>
            {textData.nav.home}
          </NavLink>
        </li>
        <li className={styles.nav__item}>
          <NavLink
            to={ROUTES.ABOUT}
            className={styles.nav__link}>
            {textData.nav.about}
          </NavLink>
        </li>

        {/* кнопка авторизації */}
        <li className={`${styles["nav__item"]} ${styles["nav__item--action"]}`}>
          <Button
            variant={EButtonVariants.PRIMARY}
            onClick={() => {
              navigate(ROUTES.LOGIN);
            }}>
            {textData.nav.login}
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
