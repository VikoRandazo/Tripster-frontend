import React, { FC, ReactNode, useEffect, useState } from "react";
import styles from "./Modal.module.scss";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
  children?: ReactNode;
  isActive: boolean;
  onClose: () => void;
  title: string;
}

const Modal: FC<ModalProps> = ({ children, isActive, onClose, title }) => {
  const [isActiveState, setIsActiveState] = useState<boolean>(isActive);

  useEffect(() => {
    setIsActiveState(isActive);
  }, [isActive]);

  if (!isActiveState) {
    return null;
  }

  const closeModal = () => {
    setIsActiveState(false);
    onClose();
  };

  return (
    <div className={isActiveState ? ` ${styles.active} ${styles.Modal}` : styles.Modal}>
      <div className={styles.children}>{children}</div>
    </div>
  );
};

export default Modal;
