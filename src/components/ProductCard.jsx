import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom'; // 1. Import Link

const ProductCard = ({ product }) => {
    // Handle different image formats
    const getImageUrl = (product) => {
        // First try the images array (from API)
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            return product.images[0];
        }
        // Then try image_url (legacy format)
        if (product.image_url) {
            return product.image_url;
        }
        // Then try image (transformed format)
        if (product.image) {
            return product.image;
        }
        // Fallback to stock photo
        return 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop';
    };

    return (
        // 2. We wrap the whole card in a Link that points to the product ID
        <Link to={`/product/${product.id}`} className="bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden hover:shadow-2xl transition-all duration-500 group block hover:scale-[1.02]">
            <div className="relative h-80 overflow-hidden">
                <img 
                    src={getImageUrl(product)} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Visual "Add" indicator */}
                <div className="absolute bottom-4 right-4 bg-accent text-white p-3 rounded-full shadow-2xl group-hover:bg-accent2 group-hover:scale-110 transition-all duration-300">
                    <ShoppingCart size={20} />
                </div>
            </div>
            <div className="p-6">
                <span className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-bold">{product.category}</span>
                <h3 className="font-bold text-lg mt-1 group-hover:text-accent transition-colors duration-300 uppercase tracking-tight">{product.name}</h3>
                <p className="text-primary font-black mt-2 text-xl">${product.price}</p>
            </div>
        </Link>
    );
};

export default ProductCard;