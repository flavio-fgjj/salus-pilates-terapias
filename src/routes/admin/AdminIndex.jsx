import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminIndex = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/admin/login" replace />;
};

export default AdminIndex;


