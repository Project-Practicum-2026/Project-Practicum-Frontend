import { useState } from "react";
import { NavLink } from "react-router";
import Navigation from "../../shared/ui/Navigation/Navigation";
import styles from "./Header.module.scss";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={styles.header}>
      <NavLink to="/" className={styles["header__logo-link"]}>
        <img
          src="/logo-line.png"
          alt="LogicGlobal Logo"
          className={styles["header__logo"]}
        />
      </NavLink>

      {/* Десктопна навігація */}
      <div className={styles["header__nav-desktop"]}>
        <Navigation />
      </div>

      {/* Кнопка бургера / мінуса */}
      <button className={styles["header__burger-btn"]} onClick={toggleMenu}>
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isMobileMenuOpen ? (
            // Іконка мінуса (коли меню відкрите)
            <path
              d="M4 12H20"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            // Іконка бургера (коли меню закрите)
            <path
              d="M4 6H20M4 12H20M4 18H20"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </button>

      {/* Мобільне меню */}
      <div
        className={`${styles["header__mobile-menu"]} ${
          isMobileMenuOpen ? styles["header__mobile-menu--open"] : ""
        }`}
      >
        <Navigation />
      </div>
    </header>
  );
};

export default Header;
