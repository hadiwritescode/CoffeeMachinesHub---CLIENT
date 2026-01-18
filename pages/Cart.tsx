import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { BEST_COFFEES } from '../constants';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const Cart: React.FC = () => {
  // Use first 3 best sellers as recommendations
  const recommendations = BEST_COFFEES.slice(0, 3);

  return (
    <div className="min-h-screen bg-nomad-paper pt-40 pb-20 animate-fade-in">
      
      {/* Empty State */}
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center fade-up">
        
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8 relative">
            <ShoppingBag size={32} className="text-gray-400" strokeWidth={1.5} />
            <div className="absolute top-0 right-0 w-8 h-8 bg-nomad-gold rounded-full flex items-center justify-center text-white text-xs font-bold">0</div>
        </div>

        <h1 className="text-4xl md:text-6xl font-serif font-medium mb-6 text-nomad-black">Your bag is empty</h1>
        
        <p className="text-lg text-gray-500 mb-10 font-light max-w-md">
            Looks like you haven't added any beans or gear yet. Discover our new arrivals before they're gone.
        </p>
        
        <Link 
            to="/shop" 
            className="inline-block bg-black text-white px-12 py-5 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-nomad-gold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
            Start Shopping
        </Link>
        
        {/* Shipping Progress Bar (Visual Only for Empty State) */}
        <div className="mt-16 w-full max-w-md">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                <span>Free Shipping</span>
                <span>Spend Rs. 5000</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-[5%] h-full bg-nomad-gold rounded-full"></div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-left italic">Add items to qualify for free shipping.</p>
        </div>

        <div className="mt-12 mb-24 flex items-center justify-center space-x-6 text-[10px] font-bold tracking-widest uppercase text-gray-400">
            <span className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Secure Checkout</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>30-Day Returns</span>
        </div>
      </div>

      {/* Recommendations */}
      <div className="container mx-auto px-6 md:px-12 border-t border-gray-200 pt-20 fade-up" style={{ transitionDelay: '0.2s' }}>
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-2xl font-serif font-bold">Recommended For You</h2>
            <Link to="/shop" className="hidden md:flex items-center text-xs font-bold uppercase tracking-widest hover:text-nomad-gold transition-colors pb-1">
                View All <ArrowRight size={14} className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map(product => (
                  <ProductCard key={product.id} product={product} />
              ))}
          </div>
      </div>
    </div>
  );
};

export default Cart;