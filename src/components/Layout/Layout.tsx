import React, { FC, useEffect, useState } from "react";
import styles from "./Layout.module.scss";
import Main from "./Main/Main";
import Header from "./Header/Header";
import { User } from "../../models/User";
import jwtDecode from "jwt-decode";

interface LayoutProps {}

const Layout: FC<LayoutProps> = () => {
  const [user, setUser] = useState<User>({ firstName: "", lastName: "", email: "", password: "", isAdmin: 0 });
  const getUser = async () => {
    const token = localStorage.getItem(`token`);
    if (token) {
      const decode: User = jwtDecode(token);
      setUser(decode);
    }
  };
  const { firstName, lastName, email, password, isAdmin } = user;

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className={styles.Layout}>
      {isAdmin ? <Header /> : null}
      <div className={styles.main} style={isAdmin ? { height: `90%` } : { height: `100%` }}>
        <Main />
      </div>
    </div>
  );
};

export default Layout;
