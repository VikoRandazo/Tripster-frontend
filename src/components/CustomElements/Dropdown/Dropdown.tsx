import React, { FC, useEffect, useState } from "react";
import styles from "./Dropdown.module.scss";
import { HiAdjustmentsHorizontal, HiAdjustmentsVertical } from "react-icons/hi2";

interface DropdownProps {
  onClose: () => void;
  list: string[];
  isActive: boolean;
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
}

const Dropdown: FC<DropdownProps> = ({ onClose, list, isActive, setSelectedOptions, selectedOptions }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const selectOption = (e: React.MouseEvent<HTMLLabelElement>) => {
    const { innerText } = e.currentTarget;
    if (innerText) {
      setSelectedOption(innerText);
      setSelectedOptions((prevstate) => {
        const repliedOption = innerText.trim();
        if (!prevstate.includes(repliedOption)) {
          return [...prevstate, repliedOption];
        } else {
          return prevstate.filter((option) => option !== repliedOption);
        }
      });
    }
  };

  // useEffect(() => {
  //   console.log(selectedOptions);
  // }, [selectedOptions]);

  return (
    <div className={styles.Dropdown}>
      <ul className={styles.dropdown}>
        {list &&
          isActive &&
          list.map((listItem, index) => {
            return (
              <li key={index} className={selectedOptions.includes(listItem) ? `${styles.option} ${styles.isActive}` : `${styles.option}`}>
                <div className={styles.item}>
                  <label className={styles.label} onClick={selectOption} htmlFor={`checkbox${index}`}>
                    {listItem}
                  </label>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Dropdown;
