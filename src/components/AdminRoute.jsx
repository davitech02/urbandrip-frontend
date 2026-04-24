import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, token, isAuthenticated } = useAuth();

    // Check if user is authenticated
    if (!token || !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has admin role
    if (!user || user.role !== 'admin') {
        return <Navigate to="/shop" replace />;
    }

    return children;
};

export default AdminRoute;
