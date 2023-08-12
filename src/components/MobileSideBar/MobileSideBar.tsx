import React, { FC, useEffect, useState } from "react";
import styles from "./MobileSideBar.module.scss";
import { HiPower, HiXMark } from "react-icons/hi2";
import jwtDecode from "jwt-decode";
import { authActions } from "../../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { StoreRootTypes } from "../../store";
import { vacationsActions } from "../../slices/vacationsSlice";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import CreateVacationContent from "../Vacation/CreateVacationContent/CreateVacationContent";

interface MobileSideBarProps {
  onClose: () => void;
}

const MobileSideBar: FC<MobileSideBarProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getUser = () => {
    const token = localStorage.getItem(`token`);
    if (token) {
      dispatch(authActions.setToken(jwtDecode(token)));
    }
  };

  const user = useSelector((state: StoreRootTypes) => state.auth.setUser);
  const { email, firstName, lastName } = user;
  useEffect(() => {
    getUser();
  }, []);

  const logout = () => {
    localStorage.removeItem(`token`);
    dispatch(vacationsActions.resetState());
    dispatch(authActions.resetState());
    navigate(`/login`);
  };
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleNavigation = (e: React.MouseEvent<HTMLLIElement>) => {
    const route = e.currentTarget.innerText;
    console.log(route);
    navigate(`/${route}`);
    onClose();
  };

  const tabs = [`vacations`, `report`];
  return (
    <div className={styles.MobileSideBar}>
      <Modal isActive={isOpen} onClose={closeModal} title="Create new vacation">
        <CreateVacationContent onClose={closeModal} />
      </Modal>

      <div className={styles.header}>
        <div className={styles.userInfo}>
          <h2>
            {firstName} <br /> {lastName}
          </h2>
          <p>{email}</p>
        </div>
        <span className={styles.close} onClick={onClose}>
          <HiXMark />
        </span>
      </div>
      <div className={styles.main}>
        <div className={styles.buttons}>
          <button className={styles.primary} onClick={openModal}>
            Create Vacation
          </button>
        </div>
        <ul className={styles.tabs}>
          {tabs.map((tab: string) => {
            return (
              <li className={styles.tab} onClick={handleNavigation}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </li>
            );
          })}
        </ul>
        <div className={styles.logout}>
          <button className={styles.logoutBtn} onClick={logout}>
            <HiPower />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileSideBar;
