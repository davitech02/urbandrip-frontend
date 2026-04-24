import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { CreditCard, Truck, Wallet } from 'lucide-react';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('Pay on Delivery');
    const [addressData, setAddressData] = useState({
        address: '', city: '', state: '', phone_number: ''
    });

    if (!user) {
        navigate('/login');
        return null;
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        try {
            const orderPayload = {
                items: cart,
                total_price: cartTotal,
                payment_method: paymentMethod,
                ...addressData
            };
            
            await API.post('/orders', orderPayload);
            toast.success("Order Placed! Preparing for delivery.");
            clearCart();
            navigate('/'); // We'll build the tracking page later
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.msg || "Failed to place order.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-black mb-10 tracking-tighter uppercase">Checkout</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Left Side: Forms */}
                <form onSubmit={handlePlaceOrder} className="space-y-10">
                    <section>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Truck size={24}/> 1. DELIVERY ADDRESS
                        </h2>
                        <div className="grid gap-4">
                            <input type="text" placeholder="Street Address" required className="p-3 border rounded-lg w-full" onChange={(e) => setAddressData({...addressData, address: e.target.value})} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="City" required className="p-3 border rounded-lg w-full" onChange={(e) => setAddressData({...addressData, city: e.target.value})} />
                                <input type="text" placeholder="State" required className="p-3 border rounded-lg w-full" onChange={(e) => setAddressData({...addressData, state: e.target.value})} />
                            </div>
                            <input type="tel" placeholder="Phone Number" required className="p-3 border rounded-lg w-full" onChange={(e) => setAddressData({...addressData, phone_number: e.target.value})} />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <CreditCard size={24}/> 2. PAYMENT METHOD
                        </h2>
                        <div className="grid gap-3">
                            {['Pay on Delivery', 'Credit/Debit Card', 'PayPal', 'Paystack'].map((method) => (
                                <label key={method} className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition ${paymentMethod === method ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="w-4 h-4 accent-black" />
                                        <span className="font-bold">{method}</span>
                                    </div>
                                    {method === 'Credit/Debit Card' && <div className="flex gap-1 text-[10px] text-gray-400">VISA / MASTERCARD</div>}
                                </label>
                            ))}
                        </div>
                    </section>

                    <button type="submit" className="w-full bg-black text-white py-5 rounded-full font-black text-xl hover:bg-accent transition shadow-2xl active:scale-95">
                        PLACE ORDER - ${cartTotal.toFixed(2)}
                    </button>
                </form>

                {/* Right Side: Summary */}
                <div className="bg-white p-8 rounded-3xl border shadow-sm h-fit">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 uppercase">
                        <Wallet size={24}/> Your Bag
                    </h2>
                    <div className="space-y-4 mb-8">
                        {cart.map(item => (
                            <div key={`${item.id}-${item.size}`} className="flex justify-between items-center text-sm border-b pb-4">
                                <div>
                                    <p className="font-bold">{item.name}</p>
                                    <p className="text-gray-400 text-xs uppercase">Size: {item.size} | Qty: {item.quantity}</p>
                                </div>
                                <span className="font-black">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center font-black text-3xl tracking-tighter pt-4">
                        <span>TOTAL</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;