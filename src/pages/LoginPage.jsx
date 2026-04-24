import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'email': {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    newErrors.email = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    newErrors.email = 'Please enter a valid email address';
                } else {
                    delete newErrors.email;
                }
                break;
            }
            case 'password':
                if (!value) {
                    newErrors.password = 'Password is required';
                } else {
                    delete newErrors.password;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        // Validate all fields
        Object.keys(formData).forEach(key => {
            validateField(key, formData[key]);
        });

        if (Object.keys(errors).length > 0) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await login({
                email: formData.email,
                password: formData.password
            });

            toast.success('Welcome back!');
            
            // Check user role and redirect accordingly
            if (result?.user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/shop');
            }
        } catch (error) {
            console.error(error);
            setApiError(error?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const isFieldValid = (fieldName) => {
        return formData[fieldName] && !errors[fieldName];
    };

    return (
        <div className="min-h-screen flex">
            {/* Right Side - Image (swapped for login) */}
            <div className="hidden lg:flex lg:w-1/2 relative order-2">
                <img
                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1000&fit=crop"
                    alt="Fashion editorial"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-12">
                    <h1 className="font-['Playfair_Display'] text-5xl font-bold mb-4">URBAN DRIP</h1>
                    <p className="font-['Inter'] text-lg text-gray-200 max-w-md">
                        Premium Streetwear for the Modern Culture
                    </p>
                </div>
            </div>

            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white order-1">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="font-['Playfair_Display'] text-3xl font-bold text-gray-900 mb-2">
                            Welcome Back
                        </h2>
                        <p className="font-['Inter'] text-gray-600">
                            Sign in to your Urban Drip account
                        </p>
                    </div>

                    {apiError && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm font-medium">{apiError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block font-['Inter'] text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-md font-['Inter'] transition-colors focus:outline-none focus:ring-2 focus:ring-black ${
                                        errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                                    }`}
                                    placeholder="Enter your email"
                                />
                                {isFieldValid('email') && (
                                    <Check className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                                )}
                                {errors.email && (
                                    <X className="absolute right-3 top-3 h-5 w-5 text-red-500" />
                                )}
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block font-['Inter'] text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Link to="/forgot-password" className="font-['Inter'] text-sm text-gray-500 hover:text-black transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 pr-12 border rounded-md font-['Inter'] transition-colors focus:outline-none focus:ring-2 focus:ring-black ${
                                        errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                                    }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                {isFieldValid('password') && (
                                    <Check className="absolute right-10 top-3 h-5 w-5 text-green-500" />
                                )}
                                {errors.password && (
                                    <X className="absolute right-10 top-3 h-5 w-5 text-red-500" />
                                )}
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-3 px-4 rounded-md font-['Inter'] font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing In...' : 'SIGN IN'}
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500 font-['Inter']">— OR —</span>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <button
                            type="button"
                            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md font-['Inter'] text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Sign in with Google
                        </button>

                        {/* Register Link */}
                        <div className="text-center">
                            <p className="font-['Inter'] text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-black hover:underline font-medium">
                                    Register
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;