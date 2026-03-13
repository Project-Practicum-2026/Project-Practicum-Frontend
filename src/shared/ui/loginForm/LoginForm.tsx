import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import textData from "../../../textData/ua.json";
import styles from "./LoginForm.module.scss";
import { loginUser } from "../../api";

interface ILoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>();
  const onSubmit: SubmitHandler<ILoginForm> = async (data) => {
    const loginData = await loginUser({
      email: data.email,
      password: data.password,
    });

    console.log(loginData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles["form"]}>
      <div className={styles["form__row"]}>
        <label htmlFor="email">{textData.login.email}</label>
        <input
          className={errors.email && styles["form__error"]}
          placeholder={textData.login.placeholders.email}
          {...register("email", { required: true })}
        />
        {errors.email && <span className={styles["form__error"]}>{textData.error.required}</span>}
      </div>
      <div className={styles["form__row"]}>
        <label htmlFor="password">{textData.login.password}</label>
        <input
          className={errors.password && styles["form__error"]}
          placeholder={textData.login.placeholders.password}
          type="password"
          {...register("password", { required: true })}
        />
        {errors.password && <span className={styles["form__error"]}>{textData.error.required}</span>}
      </div>
      {/* <div className={styles["form__checkbox-row"]}>
        <input
          type="checkbox"
          id="rememberMe"
          {...register("rememberMe")}
        />
        <label htmlFor="rememberMe">{textData.login.rememberMe}</label>
      </div> */}
      <button type="submit">{textData.login.login}</button>
    </form>
  );
};

export default LoginForm;
