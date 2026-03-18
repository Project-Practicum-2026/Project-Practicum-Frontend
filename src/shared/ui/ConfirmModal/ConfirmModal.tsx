import type { FC, ReactNode } from "react";
import styles from "./ConfirmModal.module.scss";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    icon?: ReactNode;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: "danger" | "default";
}

const ConfirmModal: FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    icon,
    confirmText = "Підтвердити",
    cancelText = "Скасувати",
    confirmVariant = "default",
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {icon && <div className={styles.modal__icon}>{icon}</div>}
                <h3 className={styles.modal__title}>{title}</h3>
                <p className={styles.modal__message}>{message}</p>
                <div className={styles.modal__actions}>
                    <button className={styles["modal__btn--cancel"]} onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button
                        className={
                            confirmVariant === "danger"
                                ? styles["modal__btn--danger"]
                                : styles["modal__btn--confirm"]
                        }
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
