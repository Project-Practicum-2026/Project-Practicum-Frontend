import LoginForm from "../../shared/ui/loginForm/LoginForm";
import { useNavigate } from "react-router";
import { ROUTES } from "../../shared/config/routes";
import textData from "../../textData/ua.json";
import Button from "../../shared/ui/Button/Button";
import { EButtonVariants } from "../../shared/types/button.types";
import styles from "./Home.module.scss";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <section className={styles.hero}>
        {/* Зображення (змінюється залежно від екрана) */}
        <picture className={styles["hero__image-wrapper"]}>
          <source
            media={`(max-width: ${styles.mobileBreakpoint})`}
            srcSet="/home/AFTRANS_MOBILE.png"
          />
          <img
            src="/home/AFTRANS_DESKTOP.png"
            alt="LogicGlobal Trucks"
            className={styles["hero__image"]}
          />
        </picture>

        <div className={styles["hero__content"]}>
          <h1 className={styles["hero__title"]}>
            {textData.homePage.hero.title}
          </h1>
          <p className={styles["hero__text"]}>
            {textData.homePage.hero.description}
          </p>

          <Button
            variant={EButtonVariants.DEFAULT}
            onClick={() => navigate(ROUTES.ABOUT)}
          >
            {textData.homePage.hero.button}
          </Button>
        </div>
      </section>

      {/* 2. Секція заклику до авторизації */}
      <section className={styles["auth-promo"]}>
        <div className={styles["auth-promo__content"]}>
          <p className={styles["auth-promo__text"]}>
            {textData.homePage.authPromo.textStart}
            <span className={styles["auth-promo__text-accent"]}>
              {textData.homePage.authPromo.textAccent}
            </span>
            {textData.homePage.authPromo.textEnd}
          </p>
        </div>

        <picture className={styles["auth-promo__image-wrapper"]}>
          <source
            media={`(max-width: ${styles.mobileBreakpoint})`}
            srcSet="/home/Roles-MOBILE-UA.png"
          />
          <img
            src="/home/Roles-DESKTOP-UA.png"
            alt="Roles"
            className={styles["auth-promo__image"]}
          />
        </picture>
      </section>

      {/* Форма авторизації */}
      <div className={styles["form-holder"]}>
        <LoginForm />
      </div>
    </div>
  );
};

export default Home;
