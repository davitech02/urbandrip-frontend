import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccessPage = () => {
    const location = useLocation();
    const [txRef] = useState(() => location.state?.txRef || 'URBANDRIP-' + Date.now());

    useEffect(() => {
        // Create confetti animation
        const colors = ['#FFD700', '#FFA500', '#FF6347', '#00CED1', '#90EE90', '#FFB6C1'];
        const confetti = () => {
            const container = document.getElementById('confetti-container');
            if (!container) return;
            
            for (let i = 0; i < 50; i++) {
                const dot = document.createElement('div');
                dot.className = 'confetti-dot';
                const color = colors[Math.floor(Math.random() * colors.length)];
                dot.style.backgroundColor = color;
                dot.style.left = Math.random() * 100 + '%';
                dot.style.setProperty('--delay', Math.random() * 0.5 + 's');
                dot.style.setProperty('--duration', (Math.random() * 2 + 2) + 's');
                container.appendChild(dot);

                setTimeout(() => dot.remove(), 2500);
            }
        };

        confetti();
        const interval = setInterval(confetti, 600);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-white pt-20 pb-20 relative overflow-hidden">
            {/* Confetti Container */}
            <div id="confetti-container" className="fixed inset-0 pointer-events-none"></div>

            <div className="max-w-2xl mx-auto px-4 text-center">
                {/* Animated Checkmark */}
                <div className="mb-8 flex justify-center">
                    <div className="animate-scale-in">
                        <CheckCircle size={80} className="text-green-500" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="font-['Playfair_Display'] text-5xl font-bold text-gray-900 mb-4">
                    Order Placed Successfully!
                </h1>

                <p className="font-['Inter'] text-lg text-gray-600 mb-8 max-w-md mx-auto">
                    Thank you for shopping with Urban Drip. Your order is being processed.
                </p>

                {/* Order Reference */}
                <div className="bg-gray-50 p-6 rounded-md mb-12 max-w-md mx-auto">
                    <p className="font-['Inter'] text-sm text-gray-600 mb-2">Order Reference Number</p>
                    <p className="font-['Inter'] text-xl font-bold text-gray-900 break-all">{txRef}</p>
                </div>

                {/* Subtext */}
                <p className="font-['Inter'] text-gray-600 mb-12 max-w-md mx-auto">
                    A confirmation email has been sent to your email address. You can track your order using the reference number above.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/track-order"
                        className="inline-block bg-black text-white px-8 py-3 rounded-md font-['Inter'] font-medium hover:bg-gray-800 transition-colors"
                    >
                        TRACK MY ORDER
                    </Link>
                    <Link
                        to="/shop"
                        className="inline-block border border-black text-black px-8 py-3 rounded-md font-['Inter'] font-medium hover:bg-gray-50 transition-colors"
                    >
                        CONTINUE SHOPPING
                    </Link>
                </div>
            </div>

            {/* Animations */}
            <style>{`
                @keyframes scaleIn {
                    from {
                        transform: scale(0);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes confetti-fall {
                    to {
                        transform: translateY(100vh) rotateZ(720deg);
                        opacity: 0;
                    }
                }

                .animate-scale-in {
                    animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .confetti-dot {
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    animation: confetti-fall var(--duration, 2.5s) var(--delay, 0s) ease-in forwards;
                    top: -10px;
                }

                @keyframes fadeInOut {
                    0%, 100% {
                        opacity: 0;
                    }
                    50% {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default OrderSuccessPage;
