import styles from "./PageHeader.module.scss";

// які пропси очікує наш компонент
interface PageHeaderProps {
  textStart?: string;
  textAccent: string;
  textEnd?: string;
  variant?: "default" | "cabinet";
}

const PageHeader = ({
  textStart,
  textAccent,
  textEnd,
  variant = "default",
}: PageHeaderProps) => {
  // Якщо variant === 'cabinet', додаємо до .header ще й модифікатор .header--cabinet
  const headerClass =
    variant === "cabinet"
      ? `${styles.header} ${styles["header--cabinet"]}`
      : styles.header;

  return (
    <div className={headerClass}>
      <h2 className={styles.title}>
        {textStart && <span>{textStart}</span>}
        <span className={styles.accent}>{textAccent}</span>
        {textEnd && <span>{textEnd}</span>}
      </h2>
    </div>
  );
};

export default PageHeader;
