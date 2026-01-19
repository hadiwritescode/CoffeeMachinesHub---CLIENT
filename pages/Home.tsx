import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { BLENDS_PRODUCTS, BEST_COFFEES, GEAR_PRODUCTS, BRAND_LOGOS } from '../constants';
import { ArrowRight, Play } from 'lucide-react';

const Home: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
       setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-nomad-paper overflow-hidden">
      
      {/* Hero Section Spacer */}
      <div className="relative w-full h-[90vh] md:h-[100vh]">
        
        {/* Fixed Hero Content */}
        <div 
            className="fixed top-0 left-0 w-full h-[90vh] md:h-[100vh] flex items-center justify-center overflow-hidden z-0"
            style={{ 
                opacity: Math.max(0, 1 - scrollY / 900),
                pointerEvents: scrollY > 800 ? 'none' : 'auto'
            }}
        >
            {/* Video Background with Reveal Animation */}
            <div className="absolute inset-0 w-full h-full animate-hero-reveal origin-center">
                <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="w-full h-full object-cover"
                    poster="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1600"
                >
                    <source src="https://videos.pexels.com/video-files/3053787/3053787-uhd_2560_1440_25fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-nomad-black/40"></div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 container mx-auto px-6 md:px-12 text-center text-white h-full flex flex-col justify-center items-center">
                <div className="space-y-6">
                    <div className="animate-slide-right" style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
                      <span className="inline-block px-4 py-1 border border-white/30 rounded-full text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-sm text-nomad-gold">
                          New Arrivals: Ethiopia Guji
                      </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-medium mb-8 leading-none tracking-tight animate-slide-right" style={{ animationDelay: '0.7s', opacity: 0, animationFillMode: 'forwards' }}>
                        Coffee <br/> Machines Hub
                    </h1>
                    <p className="text-lg md:text-xl font-sans font-light text-white/80 max-w-lg mx-auto mb-10 animate-slide-right" style={{ animationDelay: '0.9s', opacity: 0, animationFillMode: 'forwards' }}>
                        Purveyors of fine coffee and exceptional brewing equipment for the modern ritual.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-slide-right" style={{ animationDelay: '1.1s', opacity: 0, animationFillMode: 'forwards' }}>
                    <Link 
                        to="/shop" 
                        className="bg-nomad-gold text-white px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-nomad-black transition-all duration-300 min-w-[200px]"
                    >
                        Shop Coffee
                    </Link>
                    <Link 
                        to="/about" 
                        className="group flex items-center gap-3 text-white px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:text-nomad-gold transition-colors duration-300"
                    >
                        <span className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-nomad-gold transition-colors bg-white/5 backdrop-blur-sm">
                            <Play size={12} fill="currentColor" className="ml-0.5" />
                        </span>
                        Watch Film
                    </Link>
                </div>
            </div>
        </div>
      </div>

      {/* Marquee Banner */}
      <div className="relative z-10 bg-nomad-gold text-white py-4 overflow-hidden -mt-1 rounded-t-[2rem] animate-slide-right" style={{ animationDelay: '1.3s', opacity: 0, animationFillMode: 'forwards' }}>
         <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center mx-8">
                    <span className="text-xs font-bold uppercase tracking-[0.3em]">Free Shipping on Orders Over Rs. 5000</span>
                    <span className="mx-8 text-white/50">•</span>
                    <span className="text-xs font-bold uppercase tracking-[0.3em]">Freshly Roasted in Lahore</span>
                    <span className="mx-8 text-white/50">•</span>
                </div>
            ))}
         </div>
      </div>

      {/* Categories Section */}
      <section className="relative z-10 py-16 md:py-24 bg-nomad-paper">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-xl">
                <span className="text-nomad-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block fade-right" style={{ transitionDelay: '0ms' }}>Collections</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-nomad-black fade-right" style={{ transitionDelay: '100ms' }}>Curated for You</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center text-xs font-bold uppercase tracking-widest hover:text-nomad-gold transition-colors pb-2 border-b border-transparent hover:border-nomad-gold fade-right" style={{ transitionDelay: '200ms' }}>
                View All Categories <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          {/* Updated Category Colors to Beige/Brown Tones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {[
                { title: "Blends", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=400", video: "https://videos.pexels.com/video-files/4828605/4828605-uhd_2560_1440_25fps.mp4", bgColor: "bg-nomad-cream" },
                { title: "Single Origin", image: "https://images.unsplash.com/photo-1611854779393-1b2ae9be6017?auto=format&fit=crop&q=80&w=400", video: "https://videos.pexels.com/video-files/4442999/4442999-uhd_2560_1440_25fps.mp4", bgColor: "bg-nomad-gray" },
                { title: "Brew Gear", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400", video: "https://videos.pexels.com/video-files/4443026/4443026-uhd_2560_1440_25fps.mp4", bgColor: "bg-nomad-hero" },
                { title: "Merch", image: "https://images.unsplash.com/photo-1595928642581-f50f4f345668?auto=format&fit=crop&q=80&w=400", video: "https://videos.pexels.com/video-files/6803738/6803738-uhd_2560_1440_25fps.mp4", bgColor: "bg-[#EFEBE9]" }
             ].map((cat, idx) => (
                <div key={idx} className="fade-right" style={{ transitionDelay: `${300 + idx * 100}ms` }}>
                    <CategoryCard 
                        title={cat.title} 
                        image={cat.image} 
                        video={cat.video}
                        bgColor={cat.bgColor} 
                    />
                </div>
             ))}
          </div>
          <div className="fade-right" style={{ transitionDelay: '600ms' }}>
            <Link to="/shop" className="md:hidden mt-8 flex items-center justify-center text-xs font-bold uppercase tracking-widest hover:text-nomad-gold transition-colors pb-2 border-b border-gray-200">
                    View All Categories <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collection - Blends */}
      <section className="relative z-10 py-24 bg-white rounded-t-[3rem] -mt-12 shadow-2xl overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
           <div className="flex items-center justify-between mb-12">
             <h2 className="text-3xl md:text-5xl font-serif font-medium text-nomad-black fade-right">Signature Blends</h2>
             <Link to="/shop?category=Coffee" className="text-xs font-bold uppercase tracking-widest border-b border-nomad-black pb-1 hover:text-nomad-gold hover:border-nomad-gold transition-colors fade-right" style={{ transitionDelay: '100ms' }}>
                Shop Coffee
             </Link>
           </div>
           
           <div className="flex overflow-x-auto gap-8 pb-10 no-scrollbar snap-x snap-mandatory">
              {BLENDS_PRODUCTS.slice(0, 5).map((product, idx) => (
                <div key={product.id} className="min-w-[280px] md:min-w-[340px] snap-center fade-right" style={{ transitionDelay: `${200 + idx * 100}ms` }}>
                  <ProductCard product={product} variant="poster" />
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Editorial / Feature Section */}
      <section className="relative z-10 py-24 md:py-32 bg-nomad-black text-white overflow-hidden">
         {/* Background Texture/Image */}
         <div className="absolute inset-0 opacity-30 mix-blend-overlay">
            <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=1600" alt="Texture" className="w-full h-full object-cover" />
         </div>

         <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center gap-16 md:gap-24">
             <div className="w-full md:w-1/2 flex justify-center order-2 md:order-1 fade-right" style={{ transitionDelay: '0.2s' }}>
                <div className="relative aspect-[4/5] w-full max-w-[450px] rounded-t-full overflow-hidden border-b-0 border-white/10">
                   <img src="https://images.unsplash.com/photo-1507133750069-41e575498f62?auto=format&fit=crop&q=80&w=800" alt="Pour Over Art" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-in-out" />
                </div>
             </div>
             <div className="w-full md:w-1/2 text-center md:text-left order-1 md:order-2 space-y-8">
                <span className="text-nomad-gold text-xs font-bold tracking-[0.3em] uppercase block fade-right" style={{ transitionDelay: '0.3s' }}>The Art of Extraction</span>
                <h2 className="text-4xl md:text-6xl font-serif font-medium leading-tight fade-right" style={{ transitionDelay: '0.4s' }}>
                    Precision in <br/> Every Pour
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto md:mx-0 font-light fade-right" style={{ transitionDelay: '0.5s' }}>
                    We believe that the perfect cup is a balance of science and art. Our equipment collection is curated to give you total control over every variable of extraction.
                </p>
                <div className="fade-right" style={{ transitionDelay: '0.6s' }}>
                    <Link to="/shop?category=Brew Equipment" className="inline-block bg-white text-nomad-black px-10 py-5 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-nomad-gold hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        Explore Equipment
                    </Link>
                </div>
             </div>
         </div>
      </section>

      {/* Best Sellers (Curated Favorites) */}
      <section className="relative z-10 py-24 bg-nomad-paper">
        <div className="container mx-auto px-6 md:px-12">
           <div className="text-center max-w-2xl mx-auto mb-16">
               <span className="text-nomad-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block fade-right">Crowd Pleasers</span>
               <h2 className="text-3xl md:text-5xl font-serif font-medium mb-4 text-nomad-black fade-right" style={{ transitionDelay: '100ms' }}>Curated Favorites</h2>
               <p className="text-gray-500 text-lg font-light fade-right" style={{ transitionDelay: '200ms' }}>Hand-picked selections that our community loves the most.</p>
           </div>
           
           <div className="flex overflow-x-auto gap-8 pb-10 no-scrollbar snap-x snap-mandatory">
              {BEST_COFFEES.map((product, idx) => (
                <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-center fade-right" style={{ transitionDelay: `${200 + idx * 100}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Brand Logos */}
      <section className="relative z-10 py-20 bg-white border-t border-gray-100 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
           <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-12 text-center fade-right">Trusted Partners & Brands</p>
           
           <div className="overflow-x-auto pb-4 no-scrollbar fade-right" style={{ transitionDelay: '200ms' }}>
             <div className="grid grid-rows-2 grid-flow-col gap-x-16 gap-y-12 min-w-max px-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               {BRAND_LOGOS.map((brand, idx) => (
                 <span key={idx} className="text-xl md:text-3xl font-serif font-bold text-gray-400 hover:text-nomad-black cursor-default transition-colors flex items-center whitespace-nowrap">
                    {brand}
                 </span>
               ))}
             </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;