import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
    ShoppingBag,
    Minus,
    Plus,
    Trash2,
    ArrowRight,
    CreditCard,
    Truck,
    Shield,
    Tag
} from 'lucide-react';

const CartPage = () => {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleQuantityChange = (id, size, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(id, size, newQuantity);
    };

    const handleRemoveItem = (id, size) => {
        removeFromCart(id, size);
    };

    const handleApplyPromoCode = () => {
        // TODO: Implement promo code logic
        if (promoCode.toLowerCase() === 'urban10') {
            setDiscount(getCartTotal() * 0.1); // 10% discount
        } else {
            setDiscount(0);
        }
    };

    const subtotal = getCartTotal();
    const shipping = subtotal > 50000 ? 0 : 2500; // Free shipping over ₦50,000
    const total = subtotal + shipping - discount;

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/cart');
            return;
        }
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-8" />
                        <h1 className="font-['Playfair_Display'] text-3xl font-bold text-gray-900 mb-4">
                            Your cart is empty
                        </h1>
                        <p className="text-gray-600 text-lg mb-8">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center px-8 py-4 bg-black text-white text-lg font-medium rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <ShoppingBag className="h-6 w-6 mr-3" />
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-['Playfair_Display'] text-3xl font-bold text-gray-900 mb-2">
                        YOUR CART
                    </h1>
                    <p className="text-gray-600">
                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div key={`${item.id}-${item.size}`} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex gap-6">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                loading="lazy"
                                                width="96"
                                                height="96"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <ShoppingBag className="h-12 w-12 text-gray-400" />
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-['Playfair_Display'] text-lg font-bold text-gray-900 mb-1">
                                                    {item.name}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-2">
                                                    Size: {item.size}
                                                </p>
                                                <p className="text-gray-600 text-sm">
                                                    Category: {item.category}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(item.id, item.size)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-900">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {formatCurrency(item.price)} each
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Clear Cart Button */}
                        <div className="flex justify-between items-center">
                            <button
                                onClick={clearCart}
                                className="text-red-600 hover:text-red-800 font-medium transition-colors"
                            >
                                Clear Cart
                            </button>
                            <Link
                                to="/shop"
                                className="text-black hover:text-gray-600 font-medium transition-colors"
                            >
                                Continue Shopping →
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                            <h2 className="font-['Playfair_Display'] text-xl font-bold text-gray-900 mb-6">
                                Order Summary
                            </h2>

                            {/* Promo Code */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Discount Code
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Enter code"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    />
                                    <button
                                        onClick={handleApplyPromoCode}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {discount > 0 && (
                                    <p className="text-green-600 text-sm mt-2">
                                        Code applied! You saved {formatCurrency(discount)}
                                    </p>
                                )}
                            </div>

                            {/* Order Breakdown */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-{formatCurrency(discount)}</span>
                                    </div>
                                )}

                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>{formatCurrency(total)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Info */}
                            {subtotal < 50000 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-center gap-2 text-blue-800 mb-2">
                                        <Truck className="h-4 w-4" />
                                        <span className="font-medium">Free Shipping</span>
                                    </div>
                                    <p className="text-blue-700 text-sm">
                                        Add {formatCurrency(50000 - subtotal)} more for free shipping
                                    </p>
                                </div>
                            )}

                            {/* Checkout Button */}
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-black text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mb-4"
                            >
                                <CreditCard className="h-5 w-5" />
                                PROCEED TO CHECKOUT
                                <ArrowRight className="h-5 w-5" />
                            </button>

                            {/* Trust Badges */}
                            <div className="space-y-3 text-center text-sm text-gray-600">
                                <div className="flex items-center justify-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    <span>Secure Checkout</span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <Truck className="h-4 w-4" />
                                    <span>Fast Delivery</span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <Tag className="h-4 w-4" />
                                    <span>Easy Returns</span>
                                </div>
                            </div>

                            {!isAuthenticated && (
                                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-yellow-800 text-sm text-center">
                                        Please log in to proceed with checkout
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
