import React, { FC, useEffect, useRef, useState } from "react";
import styles from "./Header.module.scss";
import { useNavigate } from "react-router-dom";
import { User } from "../../../models/User";
import jwtDecode from "jwt-decode";
import { ReactComponent as LogoVertical } from "../../../styles/assets/logo/logo_horizontal_Artboard 1_Artboard 1 copy.svg";
import Modal from "../../Modal/Modal";
import CreateVacationContent from "../../Vacation/CreateVacationContent/CreateVacationContent";
import { FaDoorOpen } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { authActions } from "../../../slices/authSlice";
interface HeaderProps {
}

const Header: FC<HeaderProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<User>({ firstName: "", lastName: "", email: "", password: "", isAdmin: 0 });
  
  const getUser = async () => {
    const token = localStorage.getItem(`token`);
    if (token) {
      const decode: User = jwtDecode(token);
      setUser(decode);
      setToken(token)
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  const { firstName, lastName, email, password, isAdmin } = user;
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const categoryRef = useRef<HTMLLIElement>(null);
  const [isSelected, setIsSelected] = useState<HTMLLIElement | null>();
  const [prevSelected, setPrevSelected] = useState<HTMLLIElement | null>();

  const handleSelectedCategory = (e: React.MouseEvent<HTMLLIElement>) => {
    if (isSelected) {
      setPrevSelected(isSelected);
    }
    setIsSelected(e.currentTarget);
    navigate(`/${e.currentTarget.innerText.toLowerCase()}`);
  };
  useEffect(() => {
    categoryRef.current?.classList.add(styles.active);
    setIsSelected(categoryRef.current);
  }, []);

  useEffect(() => {
    if (prevSelected?.classList.contains(styles.active)) {
      prevSelected.classList.remove(styles.active);
    }

    if (isSelected) {
      isSelected.classList.add(styles.active);
    }
  }, [isSelected, prevSelected]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const logout = () => {
    localStorage.removeItem(`token`)
    setToken("")
    dispatch(authActions.isLoggedIn(false))
    dispatch(authActions.setToken(""))
    navigate(`/login`)
  }

  useEffect(() => {
console.log(token);

  },[token])

  return (
    <nav className={token ? styles.Header : styles.hidden}>
      <Modal isActive={isOpen} onClose={closeModal} title="Create new vacation">
        <CreateVacationContent onClose={closeModal} />
      </Modal>
     <ul className={styles.tabs}>
        <li ref={categoryRef} className={styles.category} onClick={handleSelectedCategory}>
          Vacations
        </li>
        <li className={styles.category} onClick={handleSelectedCategory}>
          Report
        </li>
      </ul>
      <div className={styles.logo}>
        <LogoVertical />
      </div>
      <div className={styles.buttons}>
        <button onClick={openModal} className={styles.primary}>
          New Vacation
        </button>
        <button onClick={logout} className={styles.logoutBtn}>
          <FaDoorOpen />
        </button>
      </div>
    </nav>
  );
};

export default Header;
