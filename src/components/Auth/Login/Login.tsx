import React, { FC, useEffect, useState } from "react";
import styles from "./Login.module.scss";
import { ReactComponent as Svg } from "../../../styles/assets/svgs/Login.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { User } from "../../../models/User";
import { authActions } from "../../../slices/authSlice";
import { ReactComponent as LogoHorizontal } from "../../../styles/assets/logo/logo_horizontal_Artboard 1_Artboard 1 copy.svg";
import axios from "axios";
import { LoginSchema } from "../../../validations/AuthValidation";
import { useFormik } from "formik";
import Loader from "../../Loader/Loader";
import Alert from "../../CustomElements/Alert/Alert";
import Modal from "../../Modal/Modal";
import jwtDecode from "jwt-decode";

interface LoginProps {}

const Login: FC<LoginProps> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });

  const handleNavigate = () => {
    navigate("/register");
  };

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [isActiveAlertModal, setIsActiveAlertModal] = useState<boolean>(false);
  const { handleChange, values, errors, touched, handleBlur, handleSubmit } = useFormik({
    initialValues: user,
    validationSchema: LoginSchema,
    onSubmit: (values, actions) => {
      setSubmitting(true);
      setTimeout(async () => {
        try {
          const response = await axios.post("http://localhost:5000/api/auth/login", values);
          const token = dispatch(authActions.setToken(response.data.token));

          if (token) {
            dispatch(authActions.isLoggedIn(true));
            localStorage.setItem(`token`, token.payload);
            navigate("/vacations");
            const decode: User = jwtDecode(token.payload);
            dispatch(authActions.setUser(decode));
          }
        } catch (error: any) {
          console.log(error.response.data.error);
          if (error.response.status === 401) {
            setAlertMessage(error.response.data.error);
          }

          setIsActiveAlertModal(true);
        } finally {
          setSubmitting(false);
        }
      }, 3000);
    },
  });

  const onClose = () => {
    setIsActiveAlertModal(false);
  };

  return (
    <div className={styles.Login}>
      <Modal isActive={isActiveAlertModal} onClose={onClose} title={alertMessage}>
        <Alert alertMessage={alertMessage} onClose={onClose} />
      </Modal>
      <div className={styles.container}>
        <div className={styles.svg}>
          <Svg />
        </div>
        <div className={styles.logo}>
          <LogoHorizontal />
        </div>
        <form onSubmit={handleSubmit} className={styles.userInput}>
          <div className={styles.title}>
            <h1>Sign in</h1>
            <p>
              Dont have an account? <a onClick={handleNavigate}>Sign Up</a>
            </p>
          </div>
          <div className={styles.main}>
            <div className={styles.inputContainer}>
              <label htmlFor="email">Email</label>
              <input
                onChange={handleChange}
                onBlur={handleBlur}
                type="email"
                name="email"
                placeholder="user@example.com"
                value={values.email}
                className={errors.email && touched.email ? styles.inputError : ``}
              />
              {errors.email && touched.email && <p className={styles.error}>{errors.email}</p>}
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="password">Password</label>
              <input
                className={errors.password && touched.password ? styles.inputError : ``}
                autoComplete="true"
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                name="password"
                value={values.password}
                placeholder="Password"
              />
              {errors.password && touched.password && (
                <p className={styles.error}>{errors.password}</p>
              )}
            </div>
          </div>
          <div className={styles.footer}>
            <button type="submit" className={submitting ? styles.submittingBtn : styles.primary}>
              {submitting ? <Loader /> : `Log in`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
