/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('urbandrip_token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('urbandrip_token') || localStorage.getItem('token');
            const storedUser = localStorage.getItem('urbandrip_user') || localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    const userData = await getCurrentUser(storedToken);
                    setUser(userData.user || JSON.parse(storedUser));
                    setToken(storedToken);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error(error);
                    localStorage.removeItem('urbandrip_token');
                    localStorage.removeItem('urbandrip_user');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                    setToken(null);
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const register = async (userData) => {
        const response = await registerUser(userData);
        const { user: userInfo, token: authToken } = response;

        setUser(userInfo);
        setToken(authToken);
        setIsAuthenticated(true);

        localStorage.setItem('urbandrip_token', authToken);
        localStorage.setItem('urbandrip_user', JSON.stringify(userInfo));

        return { success: true };
    };

    const login = async (credentials) => {
        const response = await loginUser(credentials);
        const { user: userInfo, token: authToken } = response;

        setUser(userInfo);
        setToken(authToken);
        setIsAuthenticated(true);

        localStorage.setItem('urbandrip_token', authToken);
        localStorage.setItem('urbandrip_user', JSON.stringify(userInfo));

        return { user: userInfo, token: authToken };
    };

    const logout = async () => {
        try {
            await logoutUser(token);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
            localStorage.removeItem('urbandrip_token');
            localStorage.removeItem('urbandrip_user');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };

    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        register,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};