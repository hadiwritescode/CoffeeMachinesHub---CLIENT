import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  Heart, ShieldCheck, Coffee, CheckCircle, Star, 
  Flame, MapPin, Droplet, Settings, Award, Cpu, Wifi, Layers, Thermometer, Box, ChevronDown, MessageCircle
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product, Feature } from '../types';

const { useParams, Link } = ReactRouterDOM;

// Icon mapping for features
const IconMap = {
  flame: Flame,
  map: MapPin,
  droplet: Droplet,
  coffee: Coffee,
  shield: ShieldCheck,
  settings: Settings,
  award: Award,
  cpu: Cpu,
  wifi: Wifi,
  layers: Layers,
  thermometer: Thermometer,
  box: Box
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toggleWishlist, currentUser, products } = useStore();
  const product = products.find(p => p.id === id);
  const [openFeatureIndex, setOpenFeatureIndex] = useState<number | null>(0);
  const [showToast, setShowToast] = useState(false);
  const [activeImage, setActiveImage] = useState('');

  // Suggest similar products based on category
  const relatedProducts = products
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

  const images = product.images && product.images.length > 0 ? product.images : [product.image, product.hoverImage].filter(Boolean) as string[];
  const currentImage = activeImage || images[0];

  const toggleFeature = (index: number) => {
    setOpenFeatureIndex(openFeatureIndex === index ? null : index);
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '923104811011';
    const productUrl = window.location.href;
    const message = `Hi, I'm interested in ordering ${product.title}. Can you please tell me the price? \n\nLink: ${productUrl}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleWishlistClick = () => {
      toggleWishlist(product.id);
      if (!isInWishlist) {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
      }
  };

  const isInWishlist = currentUser?.wishlist.includes(product.id);

  // Generate default features if none exist
  const getFeatures = (prod: Product): Feature[] => {
    if (prod.features && prod.features.length > 0) return prod.features;

    if (prod.category === 'Coffee') {
       return [
         { 
           title: 'Roast Profile', 
           icon: 'flame', 
           content: prod.roastLevel ? `${prod.roastLevel} roast. Carefully developed to highlight the bean's natural characteristics while ensuring body and sweetness.` : 'Expertly roasted for a balanced cup.' 
         },
         { 
           title: 'Origin & Sourcing', 
           icon: 'map', 
           content: prod.origin ? `Sourced from ${prod.origin}. We work directly with farmers to ensure fair wages and sustainable practices.` : 'Sustainably sourced from top growing regions.' 
         },
         { 
           title: 'Tasting Notes', 
           icon: 'droplet', 
           content: prod.subtitle ? `Expect distinct notes of ${prod.subtitle}. A complex flavor profile perfect for black coffee or with milk.` : 'Rich and complex flavor profile.' 
         },
         { 
           title: 'Brewing Recommendations', 
           icon: 'coffee', 
           content: 'We recommend a 1:16 ratio (60g coffee per 1L water). Ideal for Pour Over, French Press, or Espresso. Water temperature should be around 93°C.' 
         }
       ];
    }

    // Default for Gear
    return [
       { 
         title: 'Premium Build Quality', 
         icon: 'shield', 
         content: 'Constructed with high-grade, durable materials designed to withstand daily use in a busy kitchen or cafe environment.' 
       },
       { 
         title: 'Precision Performance', 
         icon: 'settings', 
         content: 'Engineered for consistency and control, allowing you to replicate your perfect recipe every single morning.' 
       },
       { 
         title: 'Design & Aesthetics', 
         icon: 'award', 
         content: 'A thoughtful design that looks as good as it performs. Minimalist aesthetics that complement any modern brew bar.' 
       },
       { 
         title: 'Warranty & Support', 
         icon: 'box', 
         content: 'Includes a 1-year manufacturer warranty against defects. Our team of experts is also available for lifetime technical support.' 
       }
    ];
  };

  const features = getFeatures(product);

  return (
    <div className="pt-32 pb-20 animate-fade-in bg-nomad-paper min-h-screen">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[70] animate-toast-in">
           <div className="bg-nomad-black text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4">
              <CheckCircle size={20} className="text-nomad-gold" />
              <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-wide">Saved to Wishlist</span>
                  <span className="text-xs text-gray-400">{product.title}</span>
              </div>
           </div>
        </div>
      )}

      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[10px] text-gray-400 mb-8 font-bold uppercase tracking-[0.2em] fade-up flex-wrap gap-y-2">
          <Link to="/" className="hover:text-nomad-black transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-nomad-black transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-nomad-black">{product.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-24 mb-24 fade-up" style={{ transitionDelay: '0.1s' }}>
          
          {/* Left Side: Image Gallery */}
          <div className="w-full lg:w-[55%] flex flex-col gap-6">
             <div className="bg-[#F9F9F9] rounded-[2rem] overflow-hidden w-full aspect-[4/5] relative group shadow-sm">
                <img src={currentImage} alt={product.title} className="w-full h-full object-cover transition-transform duration-700" />
                {product.soldOut && (
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-gray-100">
                    Sold Out
                  </div>
                )}
             </div>
             
             {/* Thumbnail Grid */}
             {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setActiveImage(img)}
                            className={`bg-[#F9F9F9] rounded-xl overflow-hidden aspect-square cursor-pointer border-2 transition-all ${currentImage === img ? 'border-nomad-gold' : 'border-transparent hover:border-gray-200'}`}
                        >
                            <img src={img} alt={`Detail ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
             )}
          </div>

          {/* Right Side: Sticky Product Info */}
          <div className="w-full lg:w-[45%] relative">
             <div className="lg:sticky lg:top-32 h-fit">
                
                <div className="flex justify-between items-start mb-4">
                    <div className="text-nomad-gold text-xs font-bold tracking-[0.2em] uppercase">{product.category}</div>
                    <div className="flex text-nomad-gold">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium mb-6 text-nomad-black leading-none">{product.title}</h1>
                
                <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
                  <div className="flex items-center gap-2 text-xl font-bold text-green-600 uppercase tracking-wider">
                      <MessageCircle size={24} />
                      WhatsApp for Price
                  </div>
                  {product.soldOut ? (
                       <span className="text-red-500 text-xs font-bold uppercase tracking-widest px-3 py-1 bg-red-50 rounded-full">Out of Stock</span>
                  ) : (
                       <span className="text-green-600 text-xs font-bold uppercase tracking-widest px-3 py-1 bg-green-50 rounded-full">In Stock</span>
                  )}
                </div>

                {product.subtitle && (
                  <div className="text-gray-600 mb-8 font-medium leading-relaxed text-lg">
                    {product.subtitle}
                  </div>
                )}
                
                {product.description && (
                  <p className="text-gray-500 mb-10 leading-relaxed font-light">
                    {product.description}
                  </p>
                )}

                {/* Selectors */}
                {!product.soldOut && (
                  <>
                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                        <button 
                            onClick={handleWhatsAppClick}
                            className="flex-grow bg-green-600 text-white py-5 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-green-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 duration-200 flex items-center justify-center gap-3"
                        >
                            <MessageCircle size={20} />
                            Order via WhatsApp
                        </button>
                        <button 
                            onClick={handleWishlistClick}
                            className={`w-full sm:w-14 h-14 flex items-center justify-center border rounded-full transition-colors active:scale-95 ${
                                isInWishlist 
                                ? 'border-red-500 text-red-500 bg-red-50' 
                                : 'border-gray-200 hover:border-nomad-gold hover:text-nomad-gold'
                            }`}
                        >
                            <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
                        </button>
                    </div>
                  </>
                )}

                {/* Enhanced Feature List (Accordion) */}
                <div className="border border-gray-200 rounded-3xl overflow-hidden bg-white shadow-sm">
                  {features.map((feature, index) => {
                    const Icon = IconMap[feature.icon as keyof typeof IconMap] || Settings;
                    const isOpen = openFeatureIndex === index;
                    
                    return (
                      <div key={index} className="border-b border-gray-100 last:border-0">
                        <button 
                          onClick={() => toggleFeature(index)}
                          className={`w-full py-5 px-6 flex items-center justify-between text-left transition-colors ${isOpen ? 'bg-nomad-paper/30' : 'hover:bg-gray-50'}`}
                        >
                          <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-nomad-gold text-white' : 'bg-nomad-gold/10 text-nomad-gold'}`}>
                                <Icon size={20} strokeWidth={1.5} />
                             </div>
                             <span className={`font-serif font-bold text-base ${isOpen ? 'text-nomad-black' : 'text-gray-700'}`}>
                                {feature.title}
                             </span>
                          </div>
                          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-nomad-black' : 'text-gray-400'}`}>
                              <ChevronDown size={18} />
                          </div>
                        </button>
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                           <div className="px-6 pb-6 pt-0 pl-[4.5rem]">
                              <p className="text-sm text-gray-500 leading-relaxed font-light">
                                {feature.content}
                              </p>
                           </div>
                        </div>
                      </div>
                    );
                  })}
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