import React, { FC } from 'react';
import styles from './ProtectedRoute.module.scss';
import { useSelector } from 'react-redux';
import { StoreRootTypes } from '../../../store';
import { Navigate, Route } from 'react-router-dom';

interface ProtectedRouteProps {
  path: string;
  element: React.ReactElement
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({path, element}) => {
const token = useSelector((state:StoreRootTypes) => state.auth.setToken)

return token ? <Route path={path} element={element} /> : <Navigate to="/login"/>
};

export default ProtectedRoute;
