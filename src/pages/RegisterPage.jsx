import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'full_name':
                if (!value.trim()) {
                    newErrors.full_name = 'Full name is required';
                } else if (value.trim().length < 2) {
                    newErrors.full_name = 'Full name must be at least 2 characters';
                } else {
                    delete newErrors.full_name;
                }
                break;
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
            case 'phone':
                if (!value) {
                    newErrors.phone = 'Phone number is required';
                } else if (value.length < 10) {
                    newErrors.phone = 'Phone number must be at least 10 digits';
                } else {
                    delete newErrors.phone;
                }
                break;
            case 'password':
                if (!value) {
                    newErrors.password = 'Password is required';
                } else if (value.length < 8) {
                    newErrors.password = 'Password must be at least 8 characters';
                } else {
                    delete newErrors.password;
                }
                break;
            case 'confirmPassword':
                if (!value) {
                    newErrors.confirmPassword = 'Please confirm your password';
                } else if (value !== formData.password) {
                    newErrors.confirmPassword = 'Passwords do not match';
                } else {
                    delete newErrors.confirmPassword;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        validateField(name, newValue);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        // Validate all fields
        Object.keys(formData).forEach(key => {
            if (key !== 'agreeToTerms') {
                validateField(key, formData[key]);
            }
        });

        if (!formData.agreeToTerms) {
            setErrors(prev => ({ ...prev, agreeToTerms: 'You must agree to the terms' }));
            return;
        }

        if (Object.keys(errors).length > 0) {
            return;
        }

        setIsLoading(true);

        try {
            await register({
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });

            toast.success('Account created! Welcome to Urban Drip');
            navigate('/shop');
        } catch (error) {
            console.error(error);
            setApiError(error?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const isFieldValid = (fieldName) => {
        return formData[fieldName] && !errors[fieldName];
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative">
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

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="font-['Playfair_Display'] text-3xl font-bold text-gray-900 mb-2">
                            Create Account
                        </h2>
                        <p className="font-['Inter'] text-gray-600">
                            Join the Urban Drip community
                        </p>
                    </div>

                    {apiError && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm font-medium">{apiError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block font-['Inter'] text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-md font-['Inter'] transition-colors focus:outline-none focus:ring-2 focus:ring-black ${
                                        errors.full_name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                                    }`}
                                    placeholder="Enter your full name"
                                />
                                {isFieldValid('full_name') && (
                                    <Check className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                                )}
                                {errors.full_name && (
                                    <X className="absolute right-3 top-3 h-5 w-5 text-red-500" />
                                )}
                            </div>
                            {errors.full_name && (
                                <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                            )}
                        </div>

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

                        {/* Phone */}
                        <div>
                            <label className="block font-['Inter'] text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <div className="relative">
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                                        +234
                                    </span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`flex-1 px-4 py-3 border rounded-r-md font-['Inter'] transition-colors focus:outline-none focus:ring-2 focus:ring-black ${
                                            errors.phone ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                                        }`}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                {isFieldValid('phone') && (
                                    <Check className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                                )}
                                {errors.phone && (
                                    <X className="absolute right-3 top-3 h-5 w-5 text-red-500" />
                                )}
                            </div>
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block font-['Inter'] text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 pr-12 border rounded-md font-['Inter'] transition-colors focus:outline-none focus:ring-2 focus:ring-black ${
                                        errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                                    }`}
                                    placeholder="Create a password"
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

                        {/* Confirm Password */}
                        <div>
                            <label className="block font-['Inter'] text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 pr-12 border rounded-md font-['Inter'] transition-colors focus:outline-none focus:ring-2 focus:ring-black ${
                                        errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                                    }`}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                {isFieldValid('confirmPassword') && (
                                    <Check className="absolute right-10 top-3 h-5 w-5 text-green-500" />
                                )}
                                {errors.confirmPassword && (
                                    <X className="absolute right-10 top-3 h-5 w-5 text-red-500" />
                                )}
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleInputChange}
                                className="mt-1 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                            />
                            <label className="font-['Inter'] text-sm text-gray-600">
                                I agree to the{' '}
                                <a href="#" className="text-black hover:underline">Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="text-black hover:underline">Privacy Policy</a>
                            </label>
                        </div>
                        {errors.agreeToTerms && (
                            <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-3 px-4 rounded-md font-['Inter'] font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Account...' : 'CREATE ACCOUNT'}
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

                        {/* Google Sign Up */}
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
                            Sign up with Google
                        </button>

                        {/* Login Link */}
                        <div className="text-center">
                            <p className="font-['Inter'] text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="text-black hover:underline font-medium">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;