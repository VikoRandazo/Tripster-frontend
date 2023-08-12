import React, { FC, useEffect, useState } from "react";
import styles from "./Layout.module.scss";
import Main from "./Main/Main";
import Header from "./Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { StoreRootTypes } from "../../store";
import jwtDecode from "jwt-decode";
import { authActions } from "../../slices/authSlice";
import { User } from "../../models/User";
import MobileMenu from "../MobileMenu/MobileMenu";
import { useResponsive } from "../../styles/responsive/useResponsive";
import { BREAKPOINTS } from "../../styles/responsive/devices";

interface LayoutProps {}

const Layout: FC<LayoutProps> = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const dispatch = useDispatch();
  const token = localStorage.getItem(`token`);

  const getUser = async () => {
    if (token) {
      dispatch(authActions.setUser(jwtDecode(token)));
    }
  };

  const user: User = useSelector((state: StoreRootTypes) => state.auth.setUser);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className={styles.Layout}>
      <div className={user.email ? styles.header : `${styles.header} ${styles.hidden}`}>
        {isMobile ? <MobileMenu /> : <Header />}
      </div>
      <div className={styles.main}>
        <Main />
      </div>
    </div>
  );
};

export default Layout;
