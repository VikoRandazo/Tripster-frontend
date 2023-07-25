import React, { FC } from "react";
import styles from "./Main.module.scss";
import Router from "../../Router/Router";

interface MainProps {}

const Main: FC<MainProps> = () => {

  return (
    <div className={styles.Main}><Router /></div>
  );
};

export default Main;
