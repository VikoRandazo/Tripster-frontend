import React, { FC, useEffect, useRef, useState } from "react";
import styles from "./Vacations.module.scss";
import { VacationType, vacationStatus } from "../../models/Vacation";
import Vacation from "../Vacation/Vacation";
import Loader from "../Loader/Loader";
import Alert from "../CustomElements/Alert/Alert";
import Modal from "../Modal/Modal";
import Pagination from "../CustomElements/Pagination/Pagination";
import instance from "../../api/AxiosInstance";
import { FaTrashAlt } from "react-icons/fa";
import { vacationSearchSchema } from "../../validations/VacationValidation";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { vacationsActions } from "../../slices/vacationsSlice";
import { StoreRootTypes } from "../../store";
import { HiRocketLaunch } from "react-icons/hi2";
import { authActions } from "../../slices/authSlice";
import { Follower } from "../../models/Follower";
import { User } from "../../models/User";
import jwtDecode from "jwt-decode";

interface VacationsProps {}

const Vacations: FC<VacationsProps> = () => {
  const [alertMessage, setAlertMessage] = useState<string>("");
  const user: User = useSelector((state: StoreRootTypes) => state.auth.setUser);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const dispatch = useDispatch();
  const [isActiveAlertModal, setIsActiveAlertModal] = useState<boolean>(false);
  const allLikes = useSelector((state: StoreRootTypes) => state.auth.allLikes);
  const [slicedData, setSlicedData] = useState<VacationType[]>([]);
  const [vacationObj, setVacationObj] = useState<VacationType>({
    vacation_id: 0,
    destination: "",
    description: "",
    start_date: "",
    end_date: "",
    price: 0,
    image_path: "",
  });
  const vacations = useSelector((state: StoreRootTypes) => state.vacations.setVacations);
  const [filteredVacations, setFilteredVacations] = useState<VacationType[]>([]);
  const [perPage, setPerPage] = useState<number>(10);
  const token = localStorage.getItem(`token`);
  const vacationStatusRef = useRef<HTMLSelectElement>(null);

  const getUser = () => {
    if (token) {
      dispatch(authActions.setUser(jwtDecode(token)));
    }
  };

  useEffect(() => {
    getUser();
    setTimeout(() => {
      getVacations();
    }, 3000);
  }, []);

  useEffect(() => {
    getLikes();
  }, [user]);

  useEffect(() => {
    setFilteredVacations(vacations);
  }, [vacations]);

  useEffect(() => {
    sortAndSetSlicedData(filteredVacations);
  }, [filteredVacations, currentPage]);

  const getVacations = async () => {
    try {
      const response = await instance.get(`/vacations/all`);
      const data = response.data;
      const formatStartDate = data.map(
        (vacation: VacationType) =>
          (vacation.start_date = new Date(vacation.start_date).toISOString().split(`T`)[0])
      );
      const formatEndDate = data.map(
        (vacation: VacationType) =>
          (vacation.end_date = new Date(vacation.end_date).toISOString().split(`T`)[0])
      );

      dispatch(vacationsActions.setVacations(data));
    } catch (error: any) {
      setAlertMessage(error.message);
      setIsActiveAlertModal(true);
      console.log(error);
    }
  };

  const getLikes = async () => {
    if (!user.isAdmin) {
      try {
        const response = await instance.get(`/like/all`);
        const data = response.data;

        const likedVacations = data
          .filter((like: Follower) => like.user_id === user.user_id)
          .map((like: Follower) => ({
            vacation_id: like.vacation_id,
            user_id: like.user_id,
          }));

        dispatch(authActions.allLikes(data));
      } catch (error: any) {
        console.log(error);
        setAlertMessage(error.response.data.message);
        setIsActiveAlertModal(true);
      }
    }
  };

  const onClose = () => {
    setIsActiveAlertModal(false);
  };

  const handleVacationStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(1);
    const { value } = e.currentTarget;
    const filteredVacations = [...vacations].filter((vacation: VacationType) => {
      if (value === String(vacationStatus.ALL)) {
        return vacations;
      } else if (value === String(vacationStatus.UP_COMING)) {
        return new Date(vacation.start_date).getTime() > new Date().getTime();
      } else if (value === String(vacationStatus.ON_GOING)) {
        return (
          new Date(vacation.start_date).getTime() < new Date().getTime() &&
          new Date(vacation.end_date).getTime() > new Date().getTime()
        );
      } else if (value === String(vacationStatus.FAVORITES)) {
        return allLikes.some(
          (like: Follower) =>
            vacation.vacation_id === like.vacation_id && user.user_id === like.user_id
        );
      }
    });
    setFilteredVacations(filteredVacations);
  };

  const resetFilters = () => {
    resetForm();
    setCurrentPage(1);
    setFilteredVacations(vacations);
    if (vacationStatusRef.current) {
      vacationStatusRef.current.value = String(vacationStatus.ALL);
    }
  };

  const { handleChange, values, handleSubmit, errors, touched, handleBlur, resetForm } = useFormik({
    initialValues: vacationObj,
    validationSchema: vacationSearchSchema,
    onSubmit: (values: VacationType, actions) => {
      const data = filteredVacations.length > 0 ? [...filteredVacations] : [...vacations];
      const formikVacations = data.filter((vacation: VacationType) => {
        const start_date = new Date(vacation.start_date).setHours(0, 0, 0, 0);
        const start_date_user = new Date(values.start_date).setHours(0, 0, 0, 0);
        const end_date_user = new Date(values.end_date).setHours(0, 0, 0, 0);

        return (
          (!values.destination || vacation.destination === values.destination) &&
          (!values.start_date || start_date >= start_date_user) &&
          (!values.end_date || start_date <= end_date_user) &&
          (!values.price || vacation.price <= values.price)
        );
      });
      setFilteredVacations(formikVacations);
      setVacationObj(values);
    },
  });

  const sortAndSetSlicedData = (data: VacationType[]) => {
    const sortedData = data.slice().sort((a: VacationType, b: VacationType) => {
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    });

    const startIndex = (currentPage - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, sortedData.length);
    const dataInPage = sortedData.slice(startIndex, endIndex);

    setSlicedData(dataInPage);
  };

  return (
    <div className={styles.Vacations}>
      <Modal isActive={isActiveAlertModal} onClose={onClose} title={alertMessage}>
        <Alert onClose={onClose} alertMessage={alertMessage} />
      </Modal>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Explore the World: Discover the Best Destinations for Your Next Vacation!</h1>
        </div>
        <form onSubmit={handleSubmit} className={styles.SearchFilterPanel}>
          <div className={styles.section}>
            <p className={styles.title}>Destination</p>
            <div className={styles.details}>
              <select
                value={values.destination}
                onChange={handleChange}
                onBlur={handleBlur}
                name="destination"
                className={errors.destination && touched.destination ? styles.inputError : ""}
              >
                {errors.destination && touched.destination && (
                  <p className={styles.error}>{errors.destination}</p>
                )}

                <option value="" disabled>
                  Select Destination
                </option>
                {vacations.map((vacation: VacationType, index) => {
                  return (
                    <option key={index} value={vacation.destination}>
                      {vacation.destination}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <hr />
          <div className={styles.section}>
            <p className={styles.title}>Start Date Between</p>
            <div className={styles.details}>
              <input
                value={values.start_date}
                onChange={handleChange}
                onBlur={handleBlur}
                type="date"
                name="start_date"
                className={errors.start_date && touched.start_date ? styles.inputError : ""}
              />
              {errors.start_date && touched.start_date && (
                <p className={styles.error}>{errors.start_date}</p>
              )}
              <p> & </p>
              <input
                value={values.end_date}
                onChange={handleChange}
                onBlur={handleBlur}
                type="date"
                name="end_date"
                className={errors.end_date && touched.end_date ? styles.inputError : ""}
              />
              {errors.end_date && touched.end_date && (
                <p className={styles.error}>{errors.end_date}</p>
              )}
            </div>
          </div>
          <hr />
          <div className={styles.section}>
            <p className={styles.title}>Max Price</p>
            <div className={styles.details}>
              <input
                value={values.price}
                onChange={handleChange}
                onBlur={handleBlur}
                type="number"
                placeholder="250$"
                name="price"
                id=""
              />
              {errors.price && touched.price && <p className={styles.error}>{errors.price}</p>}
            </div>
          </div>
          <hr />
          <div className={styles.section}>
            <div className={styles.details}>
              <button type="button" className={styles.outline} onClick={resetFilters}>
                <FaTrashAlt />
              </button>
              <button type="submit" className={styles.primary}>
                Find Vactions
                <HiRocketLaunch />
              </button>
            </div>
          </div>
          <div className={styles.infoBar}>
            <p>Showing {filteredVacations.length} results</p>
            <select ref={vacationStatusRef} onChange={handleVacationStatus}>
              <option value={vacationStatus.ALL}>All Vacations</option>
              <option value={vacationStatus.UP_COMING}>Upcoming Vacations</option>
              <option value={vacationStatus.ON_GOING}>Ongoing Vacations</option>
              <option value={vacationStatus.FAVORITES}>Favorites</option>
            </select>
          </div>
        </form>
      </div>
      <div className={styles.main}>
        {slicedData.length > 0 ? (
          <div className={styles.vacations}>
            {slicedData.map((vacation: VacationType) => {
              return (
                <Vacation
                  key={vacation.vacation_id}
                  vacation={vacation}
                  user={user}
                  likes={allLikes}
                />
              );
            })}
          </div>
        ) : (
          <div className={styles.loader}>
            <Loader />
          </div>
        )}
      </div>
      <div className={styles.footer}>
        <div className={styles.paginateVacations}>
          <Pagination
            perPage={10}
            data={filteredVacations}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Vacations;
