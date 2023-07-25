import React, { FC, useEffect, useState } from "react";
import styles from "./Vacations.module.scss";
import axios from "axios";
import { VacationType } from "../../models/Vacation";
import Vacation from "../Vacation/Vacation";
import { User } from "../../models/User";
import jwtDecode from "jwt-decode";
import Loader from "../Loader/Loader";

interface VacationsProps {}

const Vacations: FC<VacationsProps> = () => {
  const [inputValue, setinputValue] = useState<string>("");

  const [vacations, setVacations] = useState<VacationType[]>([]);
  const [filteredVacations, setFilteredVacations] = useState<VacationType[]>([]);
  const [user, setUser] = useState<User>({
    user_id: 0,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    isAdmin: 0,
  });

  const getUser = async () => {
    const token = localStorage.getItem(`token`);
    if (token) {
      const decode: User = jwtDecode(token);
      setUser(decode);
    }
  };

  const getVacations = async () => {
    const response = await axios.get(`http://localhost:5000/api/vacations/all`);
    const data = response.data;

    setVacations(data);
  };

  useEffect(() => {
    getUser();
    setTimeout(() => {
      getVacations();
    }, 3000);
  }, [vacations]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const targetElement = e.currentTarget;
    setinputValue(targetElement.value);
  };

  const filterData = () => {
    const requiredMatch = inputValue.toLowerCase();
    if (inputValue) {
      return [...vacations].filter((vacation: VacationType) => vacation.destination.toLowerCase().includes(requiredMatch));
    } else {
      return [...vacations].sort((a: VacationType, b: VacationType) => {
        return String(a.start_date).localeCompare(String(b.start_date));
      });
    }
  };

  return (
    <div className={styles.Vacations}>
      <div className={styles.main}>
        <div className={styles.searchSection}>
          <input onChange={handleChangeInput} type="text" name="searchVacation" id="searchVacation" placeholder="Search vacation..." />
        </div>
        <div className={styles.vacations}>
          {filterData().length > 0 ? (
            filterData().map((vacation: VacationType) => {
              const startDateFormat = new Date(vacation.start_date).toISOString().split(`T`)[0];
              const endDateFormat = new Date(vacation.end_date).toISOString().split(`T`)[0];
              return (
                <Vacation
                  key={vacation.vacation_id}
                  vacation={{ ...vacation, start_date: startDateFormat, end_date: endDateFormat }}
                  user={user}
                />
              );
            })
          ) : (
            <div className={styles.loader}>
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vacations;
