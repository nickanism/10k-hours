import React from 'react';
import { 
  useLocation,
  Navigate } from 'react-router-dom';
import { 
  useSelector
} from 'react-redux';

import setAuthToken from '../../utils/setAuthToken';

const PrivateRoute = ({ children }) => {
  setAuthToken(localStorage.token)
  const auth = useSelector((state) => state.auth);
  let location = useLocation();  

  if (!auth.isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} />;
  }

  return children;
}

export default PrivateRoute;