import React, { FC, useEffect, useState } from "react";
import styles from "./MobileMenu.module.scss";
import { HiBars3 } from "react-icons/hi2";
import { ReactComponent as LogoHorizontal } from "../../styles/assets/logo/logo_horizontal_Artboard 1_Artboard 1 copy.svg";
import MobileSideBar from "../MobileSideBar/MobileSideBar";
interface MobileMenuProps {
}

const MobileMenu: FC<MobileMenuProps> = () => {
  const [isOpenSideBar, setIsOpenSideBar] = useState<boolean>(false);

  const openSideBar = () => {
    setIsOpenSideBar(true);
  };

  const onClose = () => {
    setIsOpenSideBar(false)
  }

  useEffect(()=> {
console.log(isOpenSideBar);

  },[isOpenSideBar])

  return (
    <div className={styles.MobileMenu}>
      <div className={isOpenSideBar ? `${styles.sideBar} ${styles.active}` : styles.sideBar}>
        <MobileSideBar onClose={onClose} />
      </div>
      <div className={styles.menuIcon} onClick={openSideBar}>
        <HiBars3 />
      </div>
      <div className={styles.logo}>
        <LogoHorizontal />
      </div>
    </div>
  );
};

export default MobileMenu;
