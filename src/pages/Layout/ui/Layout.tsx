import { Outlet } from "react-router";
import styles from "./Layout.module.scss";
import Footer from "../../../widgets/Footer/Footer";
import Header from "../../../widgets/Header/Header";

const Layout = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
