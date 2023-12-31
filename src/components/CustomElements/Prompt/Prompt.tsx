import React, { FC, useEffect, useState } from "react";
import styles from "./Prompt.module.scss";
import { HiExclamationTriangle } from "react-icons/hi2";
import { useResponsive } from "../../../styles/responsive/useResponsive";

interface PromptProps {
  message: string;
  onClose: () => void;
  onConfirm: (confirmation: boolean) => void;
  data: any;
}

const Prompt: FC<PromptProps> = ({ message, onClose, onConfirm, data }) => {

  const responsive = useResponsive()
  const {isMobile} = responsive
  return (
    <div className={styles.Prompt}>
     {isMobile ? <div className={styles.creative}>
      <HiExclamationTriangle />
      </div> : null} 
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

export default Prompt;
