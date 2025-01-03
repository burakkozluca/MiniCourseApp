import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthGuard = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  console.log('AuthGuard Check:', {
    isAuthenticated: isAuthenticated(),
    currentPath: location.pathname,
  });

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export const AccountGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}; 