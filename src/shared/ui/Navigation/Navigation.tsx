import { NavLink, useNavigate } from "react-router";
import Button from "../Button/Button";
import styles from "./Navigation.module.scss";
import textData from "../../../textData/ua.json";
import { EButtonVariants } from "../../types/button.types";
import { ROUTES } from "../../config/routes";
import { useCustomDispatch, useCustomSelector } from "../../../store/hooks";
import { logout } from "../../../store/userSlice";

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useCustomDispatch();

  const isAuthChecked = useCustomSelector((state) => state.user.isAuthChecked);
  const isAuth = useCustomSelector((state) => state.user.isAuth);

  const handleAuthAction = () => {
    if (!isAuthChecked) return;

    if (isAuth) {
      dispatch(logout()); // Экшен сам очистит localStorage
      navigate(ROUTES.LOGIN);
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  const buttonText = !isAuthChecked
    ? textData.loading // Или textData.nav.loading, чтобы избежать прыжков верстки
    : isAuth
      ? textData.nav.logout
      : textData.nav.login;

  return (
    <nav className={styles.nav}>
      <ul className={styles.nav__list}>
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

        <li className={`${styles["nav__item"]} ${styles["nav__item--action"]}`}>
          <Button
            variant={EButtonVariants.PRIMARY}
            onClick={handleAuthAction}
            // 3. Блокируем кнопку, пока проверяется токен
            disabled={!isAuthChecked}>
            {buttonText}
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
