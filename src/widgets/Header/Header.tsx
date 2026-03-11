import Navigation from "../../shared/ui/Navigation";
import styles from "./Header.module.scss";

const Header = () => {
  return (
    <div className={styles.header}>
      <img
        src=""
        alt="Logo"
      />
      <Navigation />
    </div>
  );
};

export default Header;
