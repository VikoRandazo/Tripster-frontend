import React, { FC, useEffect, useState } from "react";
import styles from "./ConfirmContent.module.scss";

interface ConfirmContentProps {
  message: string;
  onClose: () => void;
  onConfirm: (confirmation: boolean) => void;
  data: any;
}

const ConfirmContent: FC<ConfirmContentProps> = ({ message, onClose, onConfirm, data }) => {
  return (
    <div className={styles.ConfirmContent}>
      <div className={styles.title}>
        <h2>Confirmation</h2>
      </div>
      <div className={styles.message}>{message}</div>

      <div className={styles.actions}>
        <button onClick={() => onConfirm(true)} className={styles.warning}>
          Delete {data}
        </button>
        <button onClick={onClose} className={styles.secondary}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmContent;
