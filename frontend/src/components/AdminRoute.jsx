import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, token, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!token || !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/shop" replace />;
    }

    return children;
};

export default AdminRoute;
