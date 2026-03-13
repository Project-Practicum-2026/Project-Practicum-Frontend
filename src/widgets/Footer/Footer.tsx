import styles from "./Footer.module.scss";
import textData from "../../textData/ua.json";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* ВЕРХНІЙ РЯДОК: Логотип і Назва */}
      <div className={styles["footer__top-row"]}>
        <img
          src="/logo.png"
          alt="LogicGlobal Logo"
          className={styles["footer__logo"]}
        />
        <div className={styles["footer__brand"]}>{textData.company.name}</div>
      </div>

      {/* НИЖНІЙ РЯДОК: Контакти і Графік */}
      <div className={styles["footer__bottom-row"]}>
        <div className={styles["footer__contacts"]}>
          <h4 className={styles["footer__title"]}>
            {textData.company.contacts}
          </h4>

          {/* Проходимося циклом по масиву contactItems */}
          {textData.company.contactItems.map((item, index) => (
            <p key={index} className={styles["footer__text"]}>
              {item.label}: {item.value}
            </p>
          ))}
        </div>

        <div className={styles["footer__schedule"]}>
          <h4 className={styles["footer__title"]}>
            {textData.company.workTime}
          </h4>
          <ul className={styles["footer__list"]}>
            {/* Проходимося циклом по масиву schedule */}
            {textData.company.schedule.map((item, index) => (
              <li key={index}>
                <span>{item.days}</span>
                <span>{item.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
