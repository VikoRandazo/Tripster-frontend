import React, { FC, useEffect, useState } from "react";
import styles from "./Login.module.scss";
import { ReactComponent as Svg } from "../../../styles/assets/svgs/Login.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { User } from "../../../models/User";
import { authActions } from "../../../slices/authSlice";
import {ReactComponent as LogoHorizontal} from "../../../styles/assets/logo/logo_horizontal_Artboard 1_Artboard 1 copy.svg"
import axios from "axios";

interface LoginProps {}

const Login: FC<LoginProps> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });

  const getUserFromDatabase = async () => {
    const response = await axios.get(`http://localhost:5000/api/auth/${user.email}`);
    dispatch(authActions.setUser(response.data));
    console.log(response.data);
    setUser(response.data[0])
  };


  const handleNavigate = () => {
    navigate("/register");
  };

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prevState) => {
      const { name, value } = e.target;
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", user);
      const token = dispatch(authActions.setToken(response.data.token));
      
      if (token) {
        dispatch(authActions.isLoggedIn(true));
        localStorage.setItem(`token`, token.payload)
        navigate("/vacations");
        if (user.email) {
          getUserFromDatabase();
        }
      }
    } catch (error: any) {
      alert(error.response.data.Error);
    }
  };

  return (
    <div className={styles.Login}>
      <div className={styles.container}>
        <div className={styles.svg}>
          <Svg />
        </div>
        <form className={styles.userInput}>
          <div className={styles.logo}>
          <LogoHorizontal />
          </div>
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
                onChange={handleUserInput}
                type="email"
                name="email"
                placeholder="user@example.com"
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="password">Password</label>
              <input
                autoComplete="true"
                onChange={handleUserInput}
                type="password"
                name="password"
                placeholder="Password"
              />
            </div>
          </div>
          <div className={styles.footer}>
            <button className={styles.primary} onClick={handleLogin}>
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
