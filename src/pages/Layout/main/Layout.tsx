import { Outlet } from "react-router";
import styles from "./Layout.module.scss";
import Footer from "../../../widgets/Footer/Footer";
import Header from "../../../widgets/Header/Header";
import { useCustomDispatch } from "../../../store/hooks";
import { useEffect } from "react";
import { setAuthChecked, setAuthData } from "../../../store/userSlice";
import { getUserInfo } from "../../../shared/api";

const Layout = () => {
  const dispatch = useCustomDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        try {
          const user = await getUserInfo();
          dispatch(setAuthData({ accessToken, role: user.role }));
        } catch (error) {
          console.error("Failed to initialize auth:", error);
        }
      }
      dispatch(setAuthChecked(true));
    };
    initAuth();
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
