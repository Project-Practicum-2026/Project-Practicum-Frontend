import { NavLink, useNavigate } from "react-router";
import Button from "../Button/Button";
import styles from "./Navigation.module.scss";
import textData from "../../../textData/ua.json";
import { EButtonVariants } from "../../types/button.types";
import { ROUTES } from "../../config/routes";
import { useCustomDispatch, useCustomSelector } from "../../../store/hooks";
import { logout } from "../../../store/userSlice";
import { ERoles } from "../../api/types/auth/types";

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useCustomDispatch();

  const isAuthChecked = useCustomSelector((state) => state.user.isAuthChecked);
  const isAuth = useCustomSelector((state) => state.user.isAuth);
  const role = useCustomSelector((state) => state.user.role);

  let navigateTo;
  switch (role) {
    case ERoles.MANAGER:
      navigateTo = ROUTES.MANAGER_DASHBOARD;
      break;
    case ERoles.DRIVER:
      navigateTo = ROUTES.DRIVER;
      break;
    default:
      navigateTo = ROUTES.MANAGER_DASHBOARD;
  }

  const handleAuthAction = () => {
    if (!isAuthChecked) return;

    if (isAuth) {
      dispatch(logout());
      navigate(ROUTES.LOGIN);
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  const buttonText = !isAuthChecked ? textData.loading : isAuth ? textData.nav.logout : textData.nav.login;

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
        {isAuth && (
          <li className={styles.nav__item}>
            <NavLink
              to={navigateTo}
              className={styles.nav__link}>
              {textData.nav.cabinet}
            </NavLink>
          </li>
        )}

        <li className={`${styles["nav__item"]} ${styles["nav__item--action"]}`}>
          <Button
            variant={EButtonVariants.PRIMARY}
            onClick={handleAuthAction}
            disabled={!isAuthChecked}>
            {buttonText}
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
