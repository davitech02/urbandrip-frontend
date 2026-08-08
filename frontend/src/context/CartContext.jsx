/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        try {
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Cart parsing error", error);
            return [];
        }
    });

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const showCartToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const addToCart = (product, size, quantity = 1) => {
        setCartItems((prevCart) => {
            // Check if item with SAME ID and SAME SIZE already exists
            const existingItem = prevCart.find(
                item => item.id === product.id && item.size === size
            );

            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id && item.size === size
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                );
            }
            // Otherwise add as new item
            return [...prevCart, { ...product, size, quantity }];
        });
        showCartToast('Item added to cart ✓');
    };

    const removeFromCart = (id, size) => {
        setCartItems(prevCart => prevCart.filter(item => !(item.id === id && item.size === size)));
    };

    const updateQuantity = (id, size, newQty) => {
        if (newQty <= 0) {
            removeFromCart(id, size);
            return;
        }
        setCartItems(prevCart => prevCart.map(item => {
            if (item.id === id && item.size === size) {
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCartItems([]);

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const cartCount = getCartCount();

    return (
        <CartContext.Provider value={{
            cartItems,
            cartCount,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount,
            showToast,
            toastMessage
        }}>
            {children}

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-4 right-4 bg-black text-white px-6 py-3 rounded-md shadow-lg font-['Inter'] text-sm z-50 animate-fade-in-out">
                    {toastMessage}
                </div>
            )}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};