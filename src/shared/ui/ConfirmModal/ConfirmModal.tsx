import type { FC } from "react";
import styles from "./ConfirmModal.module.scss";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.modal__title}>{title}</h3>
                <p className={styles.modal__message}>{message}</p>
                <div className={styles.modal__actions}>
                    <button className={styles["modal__btn--cancel"]} onClick={onCancel}>
                        Скасувати
                    </button>
                    <button className={styles["modal__btn--confirm"]} onClick={onConfirm}>
                        Підтвердити
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
