import React, { FC, useEffect, useState } from "react";
import styles from "./Register.module.scss";
import { ReactComponent as Svg } from "../../../styles/assets/svgs/Register.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { User } from "../../../models/User";
import axios from "axios";
import { authActions } from "../../../slices/authSlice";
import { RegisterSchema } from "../../../validations/AuthValidation";
import { useFormik } from "formik";
import Loader from "../../Loader/Loader";
import Modal from "../../Modal/Modal";
import Alert from "../../CustomElements/Alert/Alert";

interface RegisterProps {}

const Register: FC<RegisterProps> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [alertMessage, setAlertMessage] = useState<string>("");
  const [isActiveAlertModal, setIsActiveAlertModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleNavigate = () => {
    navigate("/login");
  };

  

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prevState) => {
      const { name, value } = e.target;
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  // const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   const response = await axios.post("http://localhost:5000/api/auth/register", userData);
  //   console.log(response);
  //   navigate("/vacations");
  //   dispatch(authActions.setUser(userData));
  // };

  const { handleChange, values, handleSubmit, errors, touched, handleBlur } = useFormik({
    initialValues: userData,
    validationSchema: RegisterSchema,
    onSubmit: async (values, actions) => {
      setSubmitting(true);
      setTimeout(async () => {
        try {
          const response = await axios.post("http://localhost:5000/api/auth/register", values);
          console.log(response);
          if (response.status === 201) {
            navigate("/vacations");
            dispatch(authActions.setUser(userData));
          }
        } catch (error:any) {
          setAlertMessage(error.message);
          setIsActiveAlertModal(true);
        } finally {
          setSubmitting(false);
        }
      }, 3000);
    },
  });

  const onClose = () => {
    setIsActiveAlertModal(false)
  }

  return (
    <div className={styles.Register}>
      <Modal isActive={isActiveAlertModal} onClose={onClose} title={alertMessage}>
        <Alert alertMessage={alertMessage} onClose={onClose} />
      </Modal>
      <div className={styles.container}>
        <div className={styles.svg}>
          <Svg />
        </div>
        <form onSubmit={handleSubmit} className={styles.userInput}>
          <div className={styles.title}>
            <h1>Register</h1>
            <p>
              Already have an account? <a onClick={handleNavigate}>Sign in</a>
            </p>
          </div>
          <div className={styles.main}>
            <div className={styles.inputContainer}>
              <label htmlFor="firstName">First name</label>
              <input
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstName}
                type="text"
                name="firstName"
                placeholder="First name"
                required
                className={errors.firstName && touched.firstName ? styles.inputError : ``}
              />
              {errors.firstName && touched.firstName && <p className={styles.error}>{errors.firstName}</p>}
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="lastName">Last name</label>
              <input
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastName}
                type="text"
                name="lastName"
                placeholder="Last name"
                required
                className={errors.lastName && touched.lastName ? styles.inputError : ``}
              />
              {errors.lastName && touched.lastName && <p className={styles.error}>{errors.lastName}</p>}
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="email">Email</label>
              <input
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                type="email"
                name="email"
                placeholder="user@example.com"
                required
                className={errors.email && touched.email ? styles.inputError : ``}
              />
              {errors.email && touched.email && <p className={styles.error}>{errors.email}</p>}
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="password">Password</label>
              <input
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                name="password"
                placeholder="Password"
                required
                className={errors.password && touched.password ? styles.inputError : ``}
              />
              {errors.password && touched.password && <p className={styles.error}>{errors.password}</p>}
            </div>
          </div>
          <div className={styles.footer}>
            <button type="submit" className={submitting ? styles.submittingBtn : styles.primary}>
              {submitting ? <Loader /> : `Sign up  `}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
