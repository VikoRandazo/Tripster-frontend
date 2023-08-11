import React, { FC, useEffect } from "react";
import styles from "./Layout.module.scss";
import Main from "./Main/Main";
import Header from "./Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { StoreRootTypes } from "../../store";
import jwtDecode from "jwt-decode";
import { authActions } from "../../slices/authSlice";
import { User } from "../../models/User";

interface LayoutProps {}

const Layout: FC<LayoutProps> = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem(`token`);

  const getUser = async () => {
    if (token) {
      dispatch(authActions.setUser(jwtDecode(token)));
    }
  };

  const user:User = useSelector((state:StoreRootTypes) => state.auth.setUser)

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className={styles.Layout}>
      <div className={user.email ? styles.header : `${styles.header} ${styles.hidden}`}>
        <Header />
      </div>
      <div className={styles.main}>
        <Main />
      </div>
    </div>
  );
};

export default Layout;
