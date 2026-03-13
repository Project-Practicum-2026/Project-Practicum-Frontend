import styles from "./Footer.module.scss";

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
        <div className={styles["footer__brand"]}>LogicGlobal</div>
      </div>

      {/* НИЖНІЙ РЯДОК: Контакти і Графік */}
      <div className={styles["footer__bottom-row"]}>
        <div className={styles["footer__contacts"]}>
          <h4 className={styles["footer__title"]}>Контакти</h4>
          <p className={styles["footer__text"]}>Email: logicglobal@gmail.com</p>
          <p className={styles["footer__text"]}>Phone: (066) 555-5555</p>
        </div>

        <div className={styles["footer__schedule"]}>
          <h4 className={styles["footer__title"]}>Час роботи офісу</h4>
          <ul className={styles["footer__list"]}>
            <li>
              <span>ПН - ПТ</span>
              <span>5:00 - 23:00</span>
            </li>
            <li>
              <span>СУБОТА</span>
              <span>8:00 - 16:00</span>
            </li>
            <li>
              <span>НЕДІЛЯ</span>
              <span>8:00 - 13:00</span>
            </li>
            <li>
              <span>СВЯТА</span>
              <span>8:00 - 16:00</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
