import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Import Flutterwave
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

const NIGERIAN_STATES = [
    'Lagos', 'Abuja', 'Kano', 'Rivers', 'Oyo', 'Delta', 'Katsina', 'Kebbi',
    'Kaduna', 'Jigawa', 'Sokoto', 'Bauchi', 'Gombe', 'Borno', 'Yobe', 'Taraba',
    'Adamawa', 'Plateau', 'Nassarawa', 'Edo', 'Ekiti', 'Osun', 'Ogun', 'Ondo',
    'Cross River', 'Akwa Ibom', 'Abia', 'Imo', 'Ebonyi', 'Anambra', 'Enugu', 'Niger', 'Kwara'
];

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { token } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        streetAddress: '',
        city: '',
        state: '',
        lga: '',
        postalCode: '',
        deliveryMethod: 'standard'
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [txRef] = useState(() => `URBANDRIP-${Date.now()}`);

    const cartTotal = getCartTotal();
    const shipping = cartTotal > 50000 ? 0 : (formData.deliveryMethod === 'express' ? 5000 : 2500);
    const subtotal = cartTotal;
    const total = subtotal + shipping;

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';

        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.lga.trim()) newErrors.lga = 'LGA is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Configure Flutterwave at component level
    const config = {
        public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST',
        tx_ref: txRef,
        amount: Math.max(total, 100),
        currency: 'NGN',
        payment_options: 'card,banktransfer,ussd',
        customer: {
            email: formData.email || 'customer@urbandrip.com',
            phone_number: formData.phone || '+234800000000',
            name: formData.fullName || 'Customer',
        },
        customizations: {
            title: 'Urban Drip',
            description: 'Payment for your Urban Drip order',
            logo: '/assets/urban-drip-logo.png',
        },
    };

    const handleFlutterPayment = useFlutterwave(config);

    // Handle payment processing
    const handlePlaceOrder = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            handleFlutterPayment({
                callback: async (response) => {
                    if (response.status === 'successful') {
                        try {
                            const orderData = {
                                customer_name: formData.fullName,
                                customer_email: formData.email,
                                customer_phone: formData.phone,
                                delivery_address: {
                                    street: formData.streetAddress,
                                    city: formData.city,
                                    state: formData.state,
                                    lga: formData.lga,
                                    postal_code: formData.postalCode,
                                },
                                items: cartItems,
                                subtotal: subtotal,
                                shipping_fee: shipping,
                                total_amount: total,
                                delivery_method: formData.deliveryMethod,
                                tx_ref: response.transaction_id || config.tx_ref,
                                flutterwave_ref: response.flutterwave_reference || response.reference,
                                payment_status: 'successful',
                            };

                            const orderHeaders = { 'Content-Type': 'application/json' };
                                    if (token) orderHeaders['Authorization'] = `Bearer ${token}`;

                                    const apiResponse = await fetch(`${API_URL}/api/orders/create`, {
                                        method: 'POST',
                                        headers: orderHeaders,
                                        body: JSON.stringify(orderData),
                                    });

                            if (apiResponse.ok) {
                                clearCart();
                                closePaymentModal();
                                navigate('/order-success', { state: { txRef: response.transaction_id || config.tx_ref } });
                            } else {
                                toast.error('Order creation failed. Please contact support.');
                                setIsLoading(false);
                            }
                        } catch (error) {
                            console.error('Error saving order:', error);
                            toast.error('Failed to save order. Please contact support.');
                            setIsLoading(false);
                        }
                    } else {
                        toast.error('Payment failed. Please try again.');
                        setIsLoading(false);
                    }
                },
                onClose: () => {
                    setIsLoading(false);
                },
            });
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Payment failed. Please try again.');
            setIsLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white pt-20 pb-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="font-['Inter'] text-gray-600 text-lg">Your cart is empty. Please add items before checking out.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-20 pb-20">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="font-['Playfair_Display'] text-4xl font-bold text-gray-900 mb-12">CHECKOUT</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Checkout Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Contact Information */}
                        <section>
                            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-6">CONTACT INFORMATION</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="checkout-fullName" className="block font-['Inter'] text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        id="checkout-fullName"
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        aria-invalid={!!errors.fullName}
                                        aria-describedby={errors.fullName ? 'checkout-fullName-error' : undefined}
                                        className={`w-full px-4 py-3 border rounded-md font-['Inter'] focus:outline-none focus:ring-2 focus:ring-black ${
                                            errors.fullName ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.fullName && <p id="checkout-fullName-error" className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
                                </div>

                                <div>
                                    <label htmlFor="checkout-email" className="block font-['Inter'] text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        id="checkout-email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        aria-invalid={!!errors.email}
                                        aria-describedby={errors.email ? 'checkout-email-error' : undefined}
                                        className={`w-full px-4 py-3 border rounded-md font-['Inter'] focus:outline-none focus:ring-2 focus:ring-black ${
                                            errors.email ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your email"
                                    />
                                    {errors.email && <p id="checkout-email-error" className="text-red-600 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="checkout-phone" className="block font-['Inter'] text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                                            +234
                                        </span>
                                        <input
                                            id="checkout-phone"
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            aria-invalid={!!errors.phone}
                                            aria-describedby={errors.phone ? 'checkout-phone-error' : undefined}
                                            className={`flex-1 px-4 py-3 border rounded-r-md font-['Inter'] focus:outline-none focus:ring-2 focus:ring-black ${
                                                errors.phone ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="800XXXXXXX"
                                        />
                                    </div>
                                    {errors.phone && <p id="checkout-phone-error" className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                                </div>
                            </div>
                        </section>

                        {/* Delivery Address */}
                        <section>
                            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-6">DELIVERY ADDRESS</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="checkout-street" className="block font-['Inter'] text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <input
                                        id="checkout-street"
                                        type="text"
                                        name="streetAddress"
                                        value={formData.streetAddress}
                                        onChange={handleInputChange}
                                        aria-invalid={!!errors.streetAddress}
                                        aria-describedby={errors.streetAddress ? 'checkout-street-error' : undefined}
                                        className={`w-full px-4 py-3 border rounded-md font-['Inter'] focus:outline-none focus:ring-2 focus:ring-black ${
                                            errors.streetAddress ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Street address"
                                    />
                                    {errors.streetAddress && <p id="checkout-street-error" className="text-red-600 text-sm mt-1">{errors.streetAddress}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="checkout-city" className="block font-['Inter'] text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            id="checkout-city"
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            aria-invalid={!!errors.city}
                                            aria-describedby={errors.city ? 'checkout-city-error' : undefined}
                                            className={`w-full px-4 py-3 border rounded-md font-['Inter'] focus:outline-none focus:ring-2 focus:ring-black ${
                                                errors.city ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="City"
                                        />
                                        {errors.city && <p id="checkout-city-error" className="text-red-600 text-sm mt-1">{errors.city}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="checkout-state" className="block font-['Inter'] text-sm font-medium text-gray-700 mb-1">State</label>
                                        <select
                                            id="checkout-state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            aria-invalid={!!errors.state}
                                            aria-describedby={errors.state ? 'checkout-state-error' : undefined}
                                            className={`w-full px-4 py-3 border rounded-md font-['Inter'] focus:outline-none focus:ring-2 focus:ring-black ${
                                                errors.state ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Select State</option>
                                            {NIGERIAN_STATES.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                        {errors.state && <p id="checkout-state-error" className="text-red-600 text-sm mt-1">{errors.state}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="checkout-lga" className="block font-['Inter'] text-sm font-medium text-gray-700 mb-1">LGA</label>
                                        <input
                                            id="checkout-lga"
                                            type="text"
                                            name="lga"
                                            value={formData.lga}
                                            onChange={handleInputChange}
                                            aria-invalid={!!errors.lga}
                                            aria-describedby={errors.lga ? 'checkout-lga-error' : undefined}
                                            className={`w-full px-4 py-3 border rounded-md font-['Inter'] focus:outline-none focus:ring-2 focus:ring-black ${
                                                errors.lga ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="LGA"
                                        />
                                        {errors.lga && <p id="checkout-lga-error" className="text-red-600 text-sm mt-1">{errors.lga}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="checkout-postalCode" className="block font-['Inter'] text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                        <input
                                            id="checkout-postalCode"
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md font-['Inter'] focus:outline-none focus:ring-2 focus:ring-black"
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Delivery Method */}
                        <section>
                            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-6">DELIVERY METHOD</h2>
                            <div className="space-y-3">
                                <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="deliveryMethod"
                                        value="standard"
                                        checked={formData.deliveryMethod === 'standard'}
                                        onChange={handleInputChange}
                                        className="mr-3"
                                    />
                                    <div className="flex-1">
                                        <p className="font-['Inter'] font-medium text-gray-900">Standard Delivery (3–5 days)</p>
                                        <p className="font-['Inter'] text-sm text-gray-600">₦2,500</p>
                                    </div>
                                </label>

                                <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="deliveryMethod"
                                        value="express"
                                        checked={formData.deliveryMethod === 'express'}
                                        onChange={handleInputChange}
                                        className="mr-3"
                                    />
                                    <div className="flex-1">
                                        <p className="font-['Inter'] font-medium text-gray-900">Express Delivery (1–2 days)</p>
                                        <p className="font-['Inter'] text-sm text-gray-600">₦5,000</p>
                                    </div>
                                </label>

                                {cartTotal > 20000 && (
                                    <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="deliveryMethod"
                                            value="pickup"
                                            checked={formData.deliveryMethod === 'pickup'}
                                            onChange={handleInputChange}
                                            className="mr-3"
                                        />
                                        <div className="flex-1">
                                            <p className="font-['Inter'] font-medium text-gray-900">Free Pickup</p>
                                            <p className="font-['Inter'] text-sm text-gray-600">Available (Order above ₦20,000)</p>
                                        </div>
                                    </label>
                                )}
                            </div>
                        </section>

                        {/* Payment */}
                        <section>
                            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-6">PAYMENT</h2>
                            <div className="border border-gray-300 p-4 rounded-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-md flex items-center justify-center">
                                        <span className="text-sm font-bold text-purple-700">FW</span>
                                    </div>
                                    <div>
                                        <p className="font-['Inter'] font-medium text-gray-900">Pay with Flutterwave</p>
                                        <p className="font-['Inter'] text-sm text-gray-600">Card, Bank Transfer, USSD</p>
                                    </div>
                                </div>
                                <p className="font-['Inter'] text-xs text-gray-500 mt-4">
                                    You will be redirected to Flutterwave's secure payment page
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 p-6 rounded-md sticky top-24">
                            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-6">ORDER SUMMARY</h2>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                                {cartItems.map((item, index) => (
                                    <div key={`${item.id}-${item.size}-${index}`} className="flex gap-3 pb-3 border-b border-gray-200">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            loading="lazy"
                                            width="64"
                                            height="64"
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-['Inter'] text-sm font-medium text-gray-900">{item.name}</p>
                                            <p className="font-['Inter'] text-xs text-gray-600">Size: {item.size}</p>
                                            <p className="font-['Inter'] text-xs text-gray-600">Qty: {item.quantity}</p>
                                            <p className="font-['Inter'] text-sm font-medium text-gray-900 mt-1">
                                                ₦{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pb-6 border-b border-gray-200">
                                <div className="flex justify-between">
                                    <span className="font-['Inter'] text-gray-600">Subtotal</span>
                                    <span className="font-['Inter'] font-medium text-gray-900">₦{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-['Inter'] text-gray-600">Shipping</span>
                                    <span className="font-['Inter'] font-medium text-gray-900">
                                        {shipping === 0 ? 'FREE' : `₦${shipping.toLocaleString()}`}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6 flex justify-between">
                                <span className="font-['Playfair_Display'] text-lg font-bold text-gray-900">TOTAL</span>
                                <span className="font-['Playfair_Display'] text-2xl font-bold text-gray-900">₦{total.toLocaleString()}</span>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isLoading}
                                className="w-full bg-black text-white py-3 px-4 rounded-md font-['Inter'] font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'PROCESSING...' : 'PLACE ORDER & PAY'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
