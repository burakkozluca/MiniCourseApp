import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export const AccountGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}; 