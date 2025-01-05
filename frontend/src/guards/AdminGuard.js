import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminGuard = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  console.log('AdminGuard Check:');
  console.log('Is Authenticated:', isAuthenticated());
  console.log('Is Admin:', isAdmin());
  console.log('Current Location:', location.pathname);

  if (!isAuthenticated()) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAdmin()) {
    console.log('Not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};