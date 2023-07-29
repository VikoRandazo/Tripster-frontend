import React, { FC, useEffect } from "react";
import styles from "./Router.module.scss";
import { Route, Routes } from "react-router-dom";
import Login from "../Auth/Login/Login";
import Register from "../Auth/Register/Register";
import Vacations from "../Vacations/Vacations";
import AdminReport from "../AdminReport/AdminReport";
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from "react-redux";
import { StoreRootTypes } from "../../store";

interface RouterProps {}

const Router: FC<RouterProps> = () => {

const token = useSelector((state:StoreRootTypes) => state.auth.setToken)


  const PrivateRoutes = () => {
  let auth = {'token':token}
return (
    auth.token ? <Outlet/> : <Navigate to='/login'/>
  )

}

useEffect(() => {
console.log(token);

},[token])


  return (
    <Routes>
      {/* Auth Routes */}
      <Route path={"/login"} element={<Login />} />
      <Route path={"/register"} element={<Register />} />

      <Route element={<PrivateRoutes />} >
      <Route path={"/vacations"} element={<Vacations />} />
      <Route path={"/report"} element={<AdminReport />} />
      </Route>
      

      {/* Default */}
      <Route path={"/"} element={<Login />} />
    </Routes>
  );
};

export default Router;
