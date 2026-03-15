import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import textData from "../../../textData/ua.json";
import styles from "./LoginForm.module.scss";
import { loginUser } from "../../api";
import Button from "../Button/Button";
import { EButtonTypes } from "../../types/button.types";
import { useCustomDispatch } from "../../../store/hooks";
import { setAuthData } from "../../../store/userSlice";
import { useNavigate } from "react-router";
import { ROUTES } from "../../config/routes";
import { ERoles } from "../../api/types/auth/types";

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

  const dispatch = useCustomDispatch();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ILoginForm> = async (data) => {
    try {
      const { accessToken, refreshToken, role } = await loginUser({ email: data.email, password: data.password });

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      dispatch(setAuthData({ accessToken, role }));

      switch (role) {
        case ERoles.MANAGER:
          navigate(ROUTES.MANAGER_DASHBOARD);
          break;
        case ERoles.DRIVER:
          navigate(ROUTES.HOME); // change to driver's page
          break;
      }
    } catch (error) {
      console.error("login error:", error);
    }
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
      <Button type={EButtonTypes.SUBMIT}>{textData.login.login}</Button>
    </form>
  );
};

export default LoginForm;
