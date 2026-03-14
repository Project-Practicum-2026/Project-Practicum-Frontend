import { Outlet } from "react-router";
import styles from "./Layout.module.scss";
import Footer from "../../../widgets/Footer/Footer";
import Header from "../../../widgets/Header/Header";
import { useCustomDispatch } from "../../../store/hooks";
import { useEffect } from "react";
import { setAuthChecked, setAuthData } from "../../../store/userSlice";

const Layout = () => {
  const dispatch = useCustomDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      dispatch(setAuthData({ accessToken }));
    }

    dispatch(setAuthChecked(true));
  }, [dispatch]);

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
