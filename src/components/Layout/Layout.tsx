import React, { FC } from "react";
import styles from "./Layout.module.scss";
import Main from "./Main/Main";
import Header from "./Header/Header";
import { useSelector } from "react-redux";
import { StoreRootTypes } from "../../store";

interface LayoutProps {}

const Layout: FC<LayoutProps> = () => {
  const token = useSelector((state: StoreRootTypes) => state.auth.setToken);

  return (
    <div className={styles.Layout}>
      <div className={token ? styles.header : `${styles.header} ${styles.hidden}`}>
        <Header />
      </div>
      <div className={styles.main}>
        <Main />
      </div>
    </div>
  );
};

export default Layout;
