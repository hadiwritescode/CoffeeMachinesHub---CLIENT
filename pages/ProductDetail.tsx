import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ALL_PRODUCTS, BLENDS_PRODUCTS } from '../constants';
import { Plus, Minus, Heart, Truck, ShieldCheck, Coffee, CheckCircle, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const GRIND_OPTIONS = [
  'Whole Bean', 'Espresso', 'Pour Over', 'French Press', 'Aeropress', 'Cold Brew'
];

const WEIGHT_OPTIONS = ['250g', '500g', '1kg'];

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = ALL_PRODUCTS.find(p => p.id === id);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const [selectedGrind, setSelectedGrind] = useState('Whole Bean');
  const [selectedWeight, setSelectedWeight] = useState('250g');
  const [showToast, setShowToast] = useState(false);

  // Suggest similar products based on category
  const relatedProducts = ALL_PRODUCTS
    .filter(p => p.id !== id && p.category === product?.category)
    .slice(0, 3);

  if (!product) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center bg-nomad-paper">
        <h2 className="text-3xl font-serif font-bold mb-4">Product Not Found</h2>
        <Link to="/shop" className="text-nomad-gold underline uppercase tracking-widest text-xs font-bold">Return to Shop</Link>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price).replace('PKR', 'Rs.');
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const handleAddToCart = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="pt-32 pb-20 animate-fade-in bg-nomad-paper min-h-screen">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[70] animate-toast-in">
           <div className="bg-nomad-black text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4">
              <CheckCircle size={20} className="text-nomad-gold" />
              <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-wide">Added to Cart</span>
                  <span className="text-xs text-gray-400">{product.title}</span>
              </div>
           </div>
        </div>
      )}

      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[10px] text-gray-400 mb-8 font-bold uppercase tracking-[0.2em] fade-up">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-nomad-black">{product.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 mb-24 fade-up" style={{ transitionDelay: '0.1s' }}>
          
          {/* Left Side: Scrolling Image Gallery */}
          <div className="w-full lg:w-[55%] flex flex-col gap-6">
             <div className="bg-[#F9F9F9] rounded-[2rem] overflow-hidden w-full aspect-[4/5] relative group shadow-sm">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {product.soldOut && (
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-gray-100">
                    Sold Out
                  </div>
                )}
             </div>
             
             {/* Secondary Images Grid */}
             <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#F9F9F9] rounded-[2rem] overflow-hidden aspect-square cursor-pointer group">
                    <img 
                        src={product.hoverImage || product.image} 
                        alt="Detail" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                </div>
                <div className="bg-nomad-cream/30 rounded-[2rem] flex flex-col items-center justify-center aspect-square p-8 text-center border border-nomad-gold/10">
                    <p className="font-serif italic text-2xl text-nomad-dark-gold mb-2">Premium Quality</p>
                    <p className="text-xs uppercase tracking-widest text-gray-500">Sustainably Sourced</p>
                </div>
             </div>
          </div>

          {/* Right Side: Sticky Product Info */}
          <div className="w-full lg:w-[45%] relative">
             <div className="lg:sticky lg:top-32 h-fit">
                
                <div className="flex justify-between items-start mb-4">
                    <div className="text-nomad-gold text-xs font-bold tracking-[0.2em] uppercase">{product.category || 'Coffee'}</div>
                    <div className="flex text-nomad-gold">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-6 text-nomad-black leading-none">{product.title}</h1>
                
                <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
                  <span className="text-2xl font-sans font-medium text-gray-900">{formatPrice(product.price)}</span>
                  {product.soldOut ? (
                       <span className="text-red-500 text-xs font-bold uppercase tracking-widest px-3 py-1 bg-red-50 rounded-full">Out of Stock</span>
                  ) : (
                       <span className="text-green-600 text-xs font-bold uppercase tracking-widest px-3 py-1 bg-green-50 rounded-full">In Stock</span>
                  )}
                </div>

                {product.subtitle && (
                  <div className="text-gray-600 mb-10 font-medium leading-relaxed text-lg">
                    {product.subtitle}
                  </div>
                )}

                {/* Selectors */}
                {!product.soldOut && (
                  <>
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Grind</label>
                            <button className="text-[10px] underline text-gray-400 hover:text-black">Grind Guide</button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {GRIND_OPTIONS.map(option => (
                            <button
                              key={option}
                              onClick={() => setSelectedGrind(option)}
                              className={`py-4 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-200 ${
                                selectedGrind === option 
                                  ? 'bg-black text-white border-black shadow-lg scale-[1.02]' 
                                  : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                    </div>

                    <div className="mb-10">
                        <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">Size</label>
                        <div className="flex gap-4">
                          {WEIGHT_OPTIONS.map(option => (
                            <button
                              key={option}
                              onClick={() => setSelectedWeight(option)}
                              className={`flex-1 py-4 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-200 ${
                                selectedWeight === option 
                                  ? 'bg-black text-white border-black shadow-lg scale-[1.02]' 
                                  : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <button 
                            onClick={handleAddToCart}
                            className="flex-grow bg-nomad-gold text-white py-5 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 duration-200"
                        >
                            Add to Cart — {formatPrice(product.price)}
                        </button>
                        <button className="w-14 h-14 flex items-center justify-center border border-gray-200 rounded-full hover:border-nomad-gold hover:text-nomad-gold transition-colors">
                            <Heart size={20} />
                        </button>
                    </div>
                  </>
                )}

                {/* Features List */}
                <div className="grid grid-cols-3 gap-4 mb-10 text-center">
                    <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-50/50">
                        <Truck size={20} className="mb-3 text-gray-400" strokeWidth={1.5} />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Fast Ship</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-50/50">
                        <ShieldCheck size={20} className="mb-3 text-gray-400" strokeWidth={1.5} />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Secure</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-50/50">
                        <Coffee size={20} className="mb-3 text-gray-400" strokeWidth={1.5} />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Fresh</span>
                    </div>
                </div>

                {/* Accordions */}
                <div className="border-t border-gray-200">
                    <div className="border-b border-gray-200">
                      <button 
                        onClick={() => toggleAccordion('description')}
                        className="w-full py-6 flex justify-between items-center text-left hover:text-nomad-gold transition-colors group"
                      >
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-900 group-hover:text-nomad-gold">Description</span>
                        {openAccordion === 'description' ? <Minus size={16} /> : <Plus size={16} />}
                      </button>
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openAccordion === 'description' ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                        <div className="text-base text-gray-600 leading-loose font-light">
                          <p className="mb-4">{product.description || "Crafted with passion and precision. This product represents the pinnacle of our collection."}</p>
                          <ul className="space-y-2 text-sm mt-4">
                             {product.origin && <li className="flex"><strong className="w-24 shrink-0 uppercase tracking-wider text-xs">Region:</strong> {product.origin}</li>}
                             {product.roastLevel && <li className="flex"><strong className="w-24 shrink-0 uppercase tracking-wider text-xs">Roast:</strong> {product.roastLevel}</li>}
                             {product.tags && <li className="flex"><strong className="w-24 shrink-0 uppercase tracking-wider text-xs">Notes:</strong> {product.tags.join(', ')}</li>}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-b border-gray-200">
                      <button 
                        onClick={() => toggleAccordion('details')}
                        className="w-full py-6 flex justify-between items-center text-left hover:text-nomad-gold transition-colors group"
                      >
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-900 group-hover:text-nomad-gold">Brew Guide</span>
                        {openAccordion === 'details' ? <Minus size={16} /> : <Plus size={16} />}
                      </button>
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openAccordion === 'details' ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                        <div className="text-base text-gray-600 leading-loose font-light">
                          <p>Recommended Ratio: 1:16 (Coffee to Water)</p>
                          <p>Water Temp: 93°C - 96°C</p>
                          <p>Bloom: 30-45 seconds</p>
                          <p className="mt-4 italic text-gray-400">Adjust grind size based on taste. If sour, grind finer. If bitter, grind coarser.</p>
                        </div>
                      </div>
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* You May Also Like */}
        <div className="pt-24 border-t border-gray-200">
           <div className="text-center mb-16">
              <span className="text-nomad-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Complete Your Setup</span>
              <h3 className="text-3xl font-serif font-bold">You Might Also Like</h3>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map(p => (
                 <div key={p.id}>
                    <ProductCard product={p} />
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;