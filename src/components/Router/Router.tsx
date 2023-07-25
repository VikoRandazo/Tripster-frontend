import React, { FC } from "react";
import styles from "./Router.module.scss";
import { Route, Routes } from "react-router-dom";
import Login from "../Auth/Login/Login";
import Register from "../Auth/Register/Register";
import Vacations from "../Vacations/Vacations";
import AdminReport from "../AdminReport/AdminReport";

interface RouterProps {}

const Router: FC<RouterProps> = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path={"/login"} element={<Login />} />
      <Route path={"/register"} element={<Register />} />
      <Route path={"/vacations"} element={<Vacations />} />
      <Route path={"/report"} element={<AdminReport />} />


      {/* Default */}
      <Route path={"/"} element={<Login />} />
    </Routes>
  );
};

export default Router;
