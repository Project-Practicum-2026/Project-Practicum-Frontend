import React from "react";
import { useForm, type SubmitHandler, type RegisterOptions } from "react-hook-form";
import styles from "./UniversalForm.module.scss";
import textData from "../../../textData/ua.json";
import Button from "../Button/Button";
import { EButtonTypes, EButtonVariants } from "../../types/button.types";

export interface FormField {
  name: string;
  label: string;
  type?: "text" | "password" | "email";
  placeholder?: string;
  rules?: RegisterOptions;
}

interface UniversalFormProps {
  title: string;
  fields: FormField[];
  submitText: string;
  onSubmit: SubmitHandler<Record<string, string>>;
}

const UniversalForm: React.FC<UniversalFormProps> = ({ title, fields, submitText, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<Record<string, string>>({
    mode: "onBlur",
  });

  //   const hasErrors = Object.keys(errors).length > 0;
  //   const isSubmitDisabled = !isValid && hasErrors;
  const isSubmitDisabled = !isDirty || !isValid;

  return (
    <div className={styles["universal-form"]}>
      <h2 className={styles["universal-form__title"]}>{title}</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles["universal-form__grid"]}>
          {fields.map((field) => {
            const hasFieldError = !!errors[field.name];

            return (
              <div
                key={field.name}
                className={styles["universal-form__group"]}>
                <label
                  htmlFor={field.name}
                  className={styles["universal-form__label"]}>
                  {field.label}
                </label>

                <input
                  id={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder || ""}
                  {...register(field.name, field.rules)}
                  className={`${styles["universal-form__input"]} ${hasFieldError ? styles["universal-form__input--error"] : ""}`}
                />

                {hasFieldError && (
                  <span className={styles["universal-form__error-message"]}>
                    {(errors[field.name]?.message as string) || textData.error.invalidField}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <Button
          type={EButtonTypes.SUBMIT}
          variant={EButtonVariants.PRIMARY}
          disabled={isSubmitDisabled}>
          {submitText}
        </Button>
      </form>
    </div>
  );
};

export default UniversalForm;
