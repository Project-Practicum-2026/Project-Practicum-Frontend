import LoginForm from "../../shared/ui/loginForm/LoginForm";
import styles from "./Login.module.scss";

const Login = () => {
  return (
    <div className={styles["login"]}>
      <div className={styles["login__title"]}>
        <h1>
          БУДЬ ЛАСКА, ОБЕРІТЬ СВОЮ <span>ПРОФЕСІЮ</span>
        </h1>
      </div>
      <div style={{ marginTop: 50, marginBottom: 50 }}>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
