import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading, role } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (role !== 'admin') return <Navigate to="/admin/dashboard" replace />;
  return children;
};

export default AdminRoute;


