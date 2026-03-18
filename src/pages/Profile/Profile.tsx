import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getUserInfo } from "../../shared/api";
import { useCustomDispatch } from "../../store/hooks";
import { logout } from "../../store/userSlice";
import { ROUTES } from "../../shared/config/routes";
import Button from "../../shared/ui/Button/Button";
import { EButtonTypes } from "../../shared/types/button.types";
import Loader from "../../shared/ui/Loader/Loader";
import styles from "./Profile.module.scss";
import type { IUserInfo } from "../../shared/api/types/auth/types";

const Profile = () => {
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useCustomDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const data = await getUserInfo();
        setUserInfo(data);
      } catch (err) {
        console.error("Failed to load user info:", err);
        setError("Помилка завантаження профілю.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  const handleGoBack = () => {
    if (userInfo?.role === "manager") {
      navigate(ROUTES.MANAGER_DASHBOARD);
    } else {
      navigate(ROUTES.DRIVER);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      <button 
        onClick={handleGoBack} 
        style={{ marginBottom: "20px", background: "none", border: "none", color: "#ff4d6d", fontSize: "16px", cursor: "pointer", fontWeight: "bold" }}>
        &larr; Назад до кабінету
      </button>
      
      <div className={styles.profile__card}>
        <h2 className={styles.profile__title}>МІЙ ПРОФІЛЬ</h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {userInfo && (
          <>
            <div className={styles.profile__field}>
              <label>ПІБ</label>
              <span>{userInfo.full_name || userInfo.id}</span>
            </div>
            
            <div className={styles.profile__field}>
              <label>Email</label>
              <span>{userInfo.email}</span>
            </div>

            <div className={styles.profile__field}>
              <label>Роль</label>
              <span>{userInfo.role === "manager" ? "Менеджер" : "Водій"}</span>
            </div>

            <div className={styles.profile__field}>
              <label>Статус</label>
              <span style={{ color: userInfo.is_active ? "green" : "red" }}>
                {userInfo.is_active ? "Активний" : "Неактивний"}
              </span>
            </div>
          </>
        )}

        <div className={styles.profile__actions}>
          <Button onClick={handleLogout} type={EButtonTypes.BUTTON}>Вийти з акаунта</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
