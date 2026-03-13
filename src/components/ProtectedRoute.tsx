import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, type Role } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  fallback?: React.ReactNode;
}

export const ProtectedRoute = ({ allowedRoles, fallback }: ProtectedRouteProps) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    if (fallback) return <>{fallback}</>;
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect based on role if they try to access something they shouldn't
    switch (currentUser.role) {
      case 'Admin': return <Navigate to="/admin" replace />;
      case 'Baker': return <Navigate to="/baker" replace />;
      case 'Delivery': return <Navigate to="/delivery-mode" replace />;
      case 'Customer': default: return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

// Also an InitialRedirect component to handle sending users to the right start page from '/'
export const RoleBasedRedirect = () => {
    const { currentUser } = useAuth();
    if (!currentUser) return <Navigate to="/login" replace />;
    
    switch (currentUser.role) {
        case 'Admin': return <Navigate to="/admin" replace />;
        case 'Baker': return <Navigate to="/baker" replace />;
        case 'Delivery': return <Navigate to="/delivery-mode" replace />;
        case 'Customer': default: return <Navigate to="/dashboard" replace />;
    }
};
