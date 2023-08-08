import React, { FC, useEffect, useState } from "react";
import styles from "./Vacations.module.scss";
import { VacationType, vacationStatus } from "../../models/Vacation";
import Vacation from "../Vacation/Vacation";
import { User } from "../../models/User";
import jwtDecode from "jwt-decode";
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

interface VacationsProps {}

const Vacations: FC<VacationsProps> = () => {
  const [alertMessage, setAlertMessage] = useState<string>("");
  // const [vacations, setVacations] = useState<VacationType[]>([]);
  const vacations = useSelector((state: StoreRootTypes) => state.vacations.setVacations);
  const [likes, setLikes] = useState<[]>([]);
  const [user, setUser] = useState<User>({
    user_id: 0,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    isAdmin: 0,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const dispatch = useDispatch();
  const getUser = async () => {
    const token = localStorage.getItem(`token`);
    if (token) {
      const decode: User = jwtDecode(token);
      setUser(decode);
    }
  };

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

  useEffect(() => {
    getUser();
    getVacations();
  }, []);

  const getLikes = async () => {
    if (!user.isAdmin) {
      try {
        const response = await instance.get(`/like/all`);

        setLikes(response.data);
      } catch (error: any) {
        console.log(error);

        setAlertMessage(error.response.data.message);
        setIsActiveAlertModal(true);
      }
    }
  };

  useEffect(() => {
    getLikes();
  }, [user]);

  const [isActiveAlertModal, setIsActiveAlertModal] = useState<boolean>(false);

  const onClose = () => {
    setIsActiveAlertModal(false);
  };

  const [slicedData, setSlicedData] = useState<VacationType[]>([]);

  // const paginationData = useSelector((state: StoreRootTypes) => state.filterVacations.setVacations);

  const [vacationObj, setVacationObj] = useState<VacationType>({
    vacation_id: 0,
    destination: "",
    description: "",
    start_date: "",
    end_date: "",
    price: 0,
    image_path: "",
  });

  const [filteredVacations, setFilteredVacations] = useState<VacationType[]>([]);

  useEffect(() => {
    setSlicedData(vacations);
    setFilteredVacations(vacations);
  }, [vacations]);

  const handleVacationStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        return likes.some((like: any) => vacation.vacation_id === like.vacation_id);
      }
    });
    setFilteredVacations(filteredVacations);
  };

  const { handleChange, values, handleSubmit, errors, touched, handleBlur, resetForm } = useFormik({
    initialValues: vacationObj,
    validationSchema: vacationSearchSchema,
    onSubmit: (values: VacationType) => {
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

  const resetFilters = () => {
    resetForm();
    setFilteredVacations(vacations);
  };
  const [pages, setPages] = useState<number[]>([]);
  const [lastPage, setLastPage] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);

  const paginateData = () => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, filteredVacations.length);
    const dataInPage = [...filteredVacations]
      .slice(startIndex, endIndex)
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

    setSlicedData(dataInPage);
  };

  useEffect(() => {
    paginateData();
  }, [filteredVacations, currentPage]);

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
              </button>
            </div>
          </div>
          <div className={styles.infoBar}>
            <p>Showing {filteredVacations.length} results</p>
            <select onChange={handleVacationStatus}>
              <option selected value={vacationStatus.ALL}>
                All Vacations
              </option>
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
              return <Vacation key={vacation.vacation_id} vacation={vacation} user={user} />;
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
