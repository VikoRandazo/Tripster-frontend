import React, { FC, useEffect, useState } from "react";
import styles from "./Vacations.module.scss";
import axios from "axios";
import { VacationType } from "../../models/Vacation";
import Vacation from "../Vacation/Vacation";
import { User } from "../../models/User";
import jwtDecode from "jwt-decode";
import Loader from "../Loader/Loader";
import Dropdown from "../CustomElements/Dropdown/Dropdown";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { Follower } from "../../models/Follower";
import Alert from "../CustomElements/Alert/Alert";
import Modal from "../Modal/Modal";
import Pagination from "../CustomElements/Pagination/Pagination";
import { current } from "@reduxjs/toolkit";

interface VacationsProps {}

const Vacations: FC<VacationsProps> = () => {
  const [inputValue, setinputValue] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>("");

  const [vacations, setVacations] = useState<VacationType[]>([]);
  const [likes, setLikes] = useState<[]>([]);
  const [user, setUser] = useState<User>({
    user_id: 0,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    isAdmin: 0,
  });

  const filterBy = [`Followed Vacations`, `Ongoing Vacations`, `Upcoming Vacations`];

  const getUser = async () => {
    const token = localStorage.getItem(`token`);
    if (token) {
      const decode: User = jwtDecode(token);
      setUser(decode);
    }
  };

  const getVacations = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/vacations/all`);
      const data = response.data;
      setVacations(data);
    } catch (error: any) {
      setAlertMessage(error.message);
      setIsActiveAlertModal(true);
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
    getVacations();
  }, []);

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

  const [perPage, setPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [pages, setPages] = useState<number>(1);

  const [lastPage, setLastPage] = useState<number>(1);
  const [isActiveDropdown, setIsActiveDropdown] = useState<boolean>(false);
  const [selectedOptions, setSelectedoptions] = useState<string[]>([]);

  const toggleDropdown = () => {
    setIsActiveDropdown((prevstate) => !prevstate);
  };

  const getLikes = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/like/all`);
      setLikes(response.data);
    } catch (error: any) {
      setAlertMessage(error.message);
      setIsActiveAlertModal(true);
    }
  };

  useEffect(() => {
    if (!user.isAdmin) {
      getLikes();
    }
  }, [user.isAdmin]);

  // useEffect(() => {
  //   setPages(vacations.map((vacation:VacationType, index) => index + 1 ));

  // }, [vacations]);

  useEffect(() => {
    if (vacations) {
      setPages(Math.round(vacations.length / perPage));
      setLastPage(vacations.length);
    }
  }, [vacations]);

  const filterResults: () => any = () => {
    return [...filterData()].filter((vacation: VacationType) => {
      const isFollowing = likes.some((follow: Follower) => follow.vacation_id === vacation.vacation_id);
      const upComingVacations = new Date(vacation.start_date) > new Date();
      const onGoingVacations = new Date() > new Date(vacation.start_date) && new Date() < new Date(vacation.end_date);

      const isSelectedOption = (filterMethod: string) => selectedOptions.includes(filterMethod);

      if (isSelectedOption("Followed Vacations") && isFollowing) {
        return true;
      } else if (isSelectedOption("Upcoming Vacations") && upComingVacations) {
        return true;
      } else if (isSelectedOption("Ongoing Vacations") && onGoingVacations) {
        return true;
      } else if (selectedOptions.length <= 0) {
        return filterData();
      }
    });
  };
  const [isActiveAlertModal, setIsActiveAlertModal] = useState<boolean>(false);

  const onClose = () => {
    setIsActiveAlertModal(false);
  };

  useEffect(() => {}, []);

  useEffect(() => {
    filterResults();
    console.log(selectedOptions);
  }, [selectedOptions]);

  return (
    <div className={styles.Vacations}>
      <Modal isActive={isActiveAlertModal} onClose={onClose} title={alertMessage}>
        <Alert onClose={onClose} alertMessage={alertMessage} />
      </Modal>
      <div className={styles.header}>
        <div className={styles.title}>
          <h2>Hello {user.firstName}, </h2>
          <p>Your next vacation is around the corner!</p>
        </div>
        <div className={styles.SearchFilterPanel}>
          <div className={styles.searchSection}>
            <input onChange={handleChangeInput} type="text" name="searchVacation" id="searchVacation" placeholder="Search vacation..." />
          </div>
          <div className={isActiveDropdown ? `${styles.filter} ${styles.isActive}` : `${styles.filter}`}>
            <button
              onClick={toggleDropdown}
              className={isActiveDropdown ? `${styles.dropdownTrigger} ${styles.isActive}` : `${styles.dropdownTrigger}`}
            >
              <HiAdjustmentsHorizontal />
              {isActiveDropdown && <span>Filter By:</span>}
            </button>
            <Dropdown
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedoptions}
              onClose={() => toggleDropdown}
              list={filterBy}
              isActive={isActiveDropdown}
            />
          </div>
        </div>
      </div>
      <div className={styles.main}>
        {filterResults().length > 0 ? (
          <div className={styles.vacations}>
            {filterResults().map((vacation: VacationType) => {
              const startDateFormat = new Date(vacation.start_date).toISOString().split(`T`)[0];
              const endDateFormat = new Date(vacation.end_date).toISOString().split(`T`)[0];
              return (
                <Vacation
                  key={vacation.vacation_id}
                  vacation={{ ...vacation, start_date: startDateFormat, end_date: endDateFormat }}
                  user={user}
                />
              );
            })}
            <div className={styles.paginateVacations}>
              <Pagination
                data={vacations}
                pages={pages}
                currentPage={0}
                currentPageData = {vacations[currentPage]}
                lastPage={lastPage}
                perPage={perPage}
                setCurrentPage={(currentPage) => {
                  return currentPage + 1;
                }}
                setData={[]}
              />
            </div>
          </div>
        ) : (
          <div className={styles.loader}>
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Vacations;
