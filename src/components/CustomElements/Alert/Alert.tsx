import React, { FC } from "react";
import styles from "./Alert.module.scss";
import { HiExclamationTriangle } from "react-icons/hi2";

interface AlertProps {
  alertMessage: string;
  onClose: () => void;
}

const Alert: FC<AlertProps> = ({ alertMessage, onClose }) => {
  return (
    <div className={styles.Alert}>
      <div className={styles.title}>
        <div className={styles.creative}>
          <HiExclamationTriangle />
        </div>
        <div className={styles.message}>
          <span>{alertMessage} </span>
        </div>
      </div>
      <div className={styles.actions}>
        <button onClick={onClose} className={styles.primary}>
          ok
        </button>
      </div>
    </div>
  );
};

export default Alert;
