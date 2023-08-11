import React, { FC, useEffect } from "react";
import styles from "./Router.module.scss";
import { Route, Routes } from "react-router-dom";
import Login from "../Auth/Login/Login";
import Register from "../Auth/Register/Register";
import Vacations from "../Vacations/Vacations";
import AdminReport from "../AdminReport/AdminReport";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { StoreRootTypes } from "../../store";
import { authActions } from "../../slices/authSlice";

interface RouterProps {}

const Router: FC<RouterProps> = () => {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path={"/login"} element={<Login />} />
      <Route path={"/register"} element={<Register />} />

      <Route path={"/vacations"} element={token ? <Vacations /> : <Navigate to="/login" />} />
      <Route path={"/report"} element={token ? <AdminReport /> : <Navigate to="/login" />} />

      {/* Default */}
      <Route path={"/"} element={<Login />} />
    </Routes>
  );
};

export default Router;
