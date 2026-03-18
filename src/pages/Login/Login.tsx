import LoginForm from "../../shared/ui/loginForm/LoginForm";
import styles from "./Login.module.scss";
import PageHeader from "../../shared/ui/PageHeader/PageHeader";
import textData from "../../textData/ua.json";

const Login = () => {
  return (
    <div className={styles["login"]}>
      {/* <div className={styles["login__title"]}>
        <h1>
          БУДЬ ЛАСКА, ОБЕРІТЬ СВОЮ <span>ПРОФЕСІЮ</span>
        </h1>
      </div> */}
      <div>
        <PageHeader
          textStart={textData.homePage.authPromo.textStart}
          textAccent={textData.homePage.authPromo.textAccent}
          textEnd={textData.homePage.authPromo.textEnd}
        />
      </div>

      <div style={{ marginTop: 30, marginBottom: 50 }}>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
