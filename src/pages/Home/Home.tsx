import LoginForm from "../../shared/ui/loginForm/LoginForm";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={styles["home"]}>
      <LoginForm />
    </div>
  );
};

export default Home;
