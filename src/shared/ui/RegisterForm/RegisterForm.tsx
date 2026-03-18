import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import textData from "../../../textData/ua.json";
import styles from "../loginForm/LoginForm.module.scss";
import { registerUser } from "../../api";
import Button from "../Button/Button";
import { EButtonTypes } from "../../types/button.types";
import { useCustomDispatch } from "../../../store/hooks";
import { setAuthData } from "../../../store/userSlice";
import { useNavigate } from "react-router";
import { ROUTES } from "../../config/routes";
import { ERoles } from "../../api/types/auth/types";
import type { IRegisterData } from "../../api/types/auth/types";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterData>();

  const dispatch = useCustomDispatch();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IRegisterData> = async (data) => {
    try {
      const { accessToken, refreshToken, role } = await registerUser(data);

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      dispatch(setAuthData({ accessToken, role }));

      switch (role) {
        case ERoles.MANAGER:
          navigate(ROUTES.MANAGER_DASHBOARD);
          break;
        case ERoles.DRIVER:
          navigate(ROUTES.DRIVER);
          break;
      }
    } catch (error) {
      console.error("register error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles["form"]}>
      <div className={styles["form__row"]}>
        <label htmlFor="full_name">ПІБ</label>
        <input
          className={errors.full_name && styles["form__error"]}
          placeholder="Бандера Степан Андрійович"
          {...register("full_name", { required: true })}
        />
        {errors.full_name && <span className={styles["form__error"]}>{textData.error.required}</span>}
      </div>

      <div className={styles["form__row"]}>
        <label htmlFor="email">{textData.login.email}</label>
        <input
          className={errors.email && styles["form__error"]}
          placeholder={textData.login.placeholders.email}
          type="email"
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
          {...register("password", { required: true, minLength: 8 })}
        />
        {errors.password && <span className={styles["form__error"]}>Мінімум 8 символів</span>}
      </div>

      <div className={styles["form__row"]}>
        <label htmlFor="role">Роль</label>
        <select
          className={errors.role && styles["form__error"]}
          style={{ width: "100%", height: "3rem", fontSize: "1.2rem", borderRadius: "8px", paddingLeft: "16px" }}
          {...register("role", { required: true })}
        >
          <option value={ERoles.MANAGER}>Менеджер</option>
          <option value={ERoles.DRIVER}>Водій</option>
        </select>
        {errors.role && <span className={styles["form__error"]}>{textData.error.required}</span>}
      </div>

      <Button type={EButtonTypes.SUBMIT}>Зареєструватися</Button>
    </form>
  );
};

export default RegisterForm;
