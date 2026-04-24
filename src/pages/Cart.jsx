import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold mb-4">Your bag is empty</h2>
                <Link to="/shop" className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-accent transition">
                    GO SHOPPING
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-black mb-10 tracking-tighter">YOUR BAG</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Items List */}
                <div className="lg:col-span-2 space-y-6">
                    {cart.map((item) => (
                        <div key={`${item.id}-${item.size}`} className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <img src={item.image_url} alt={item.name} className="w-24 h-32 object-cover rounded-lg" />
                            
                            <div className="flex-1">
                                <h3 className="font-bold text-xl uppercase">{item.name}</h3>
                                <p className="text-gray-500 text-sm mb-4">Size: {item.size}</p>
                                
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border rounded-full px-2">
                                        <button onClick={() => updateQuantity(item.id, item.size, -1)} className="p-2 hover:text-accent"><Minus size={16}/></button>
                                        <span className="font-bold w-8 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.size, 1)} className="p-2 hover:text-accent"><Plus size={16}/></button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id, item.size)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="text-right">
                                <p className="font-black text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Section */}
                <div className="bg-white p-8 rounded-2xl shadow-md border h-fit sticky top-24">
                    <h2 className="text-2xl font-bold mb-6 uppercase tracking-tight">Summary</h2>
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Estimated Delivery</span>
                            <span className="text-green-600 font-medium">FREE</span>
                        </div>
                        <div className="border-t pt-4 flex justify-between font-black text-2xl">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <Link to="/checkout" className="w-full bg-black text-white flex items-center justify-center gap-2 py-4 rounded-full font-bold hover:bg-accent transition-all">
                        CHECKOUT <ArrowRight size={20}/>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;