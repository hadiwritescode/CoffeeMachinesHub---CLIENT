import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { BLENDS_PRODUCTS, BEST_COFFEES, GEAR_PRODUCTS, BRAND_LOGOS, TESTIMONIALS } from '../constants';
import { ArrowRight, Play, Search, Star, Quote } from 'lucide-react';

const Home: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [heroSearch, setHeroSearch] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
       setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/shop?search=${encodeURIComponent(heroSearch)}`);
    }
  };

  const trendingTerms = ['Espresso Machines', 'Commercial Grinders', 'Coffee Blends', 'Barista Accessories'];

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
                <div className="w-full max-w-4xl mx-auto space-y-12">
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-medium leading-none tracking-tight animate-slide-right" style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
                        Coffee <br/> Machines Hub
                    </h1>

                    {/* Hero Search Bar */}
                    <div className="animate-slide-up" style={{ animationDelay: '0.8s', opacity: 0, animationFillMode: 'forwards' }}>
                        <form onSubmit={handleHeroSearch} className="relative group w-full max-w-2xl mx-auto">
                            <input 
                                type="text"
                                value={heroSearch}
                                onChange={(e) => setHeroSearch(e.target.value)}
                                placeholder="Search machines, grinders, and more..."
                                className="w-full bg-white/10 backdrop-blur-xl border border-white/30 rounded-full py-5 px-10 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/20 focus:border-white transition-all duration-300 text-lg md:text-xl shadow-2xl"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-nomad-gold text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-white hover:text-nomad-black transition-all">
                                <Search size={24} />
                            </button>
                        </form>
                        
                        {/* Recommendations */}
                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <span className="text-xs font-bold uppercase tracking-widest text-white/50 w-full mb-2">Trending</span>
                            {trendingTerms.map(term => (
                                <button 
                                    key={term}
                                    onClick={() => navigate(`/shop?search=${encodeURIComponent(term)}`)}
                                    className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-nomad-black transition-all"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '1.1s', opacity: 0, animationFillMode: 'forwards' }}>
                        <Link 
                            to="/shop" 
                            className="bg-nomad-gold text-white px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-nomad-black transition-all duration-300 min-w-[200px]"
                        >
                            Shop Now
                        </Link>
                        <Link 
                            to="/about" 
                            className="group flex items-center gap-3 text-white px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:text-nomad-gold transition-colors duration-300"
                        >
                            <span className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-nomad-gold transition-colors bg-white/5 backdrop-blur-sm">
                                <Play size={12} fill="currentColor" className="ml-0.5" />
                            </span>
                            Watch Story
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Marquee Banner */}
      <div className="relative z-10 bg-nomad-gold text-white py-4 overflow-hidden -mt-1 rounded-t-[2rem] animate-slide-up" style={{ animationDelay: '1.3s', opacity: 0, animationFillMode: 'forwards' }}>
         <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center mx-8">
                    <span className="text-xs font-bold uppercase tracking-[0.3em]">Free Shipping on Orders Over Rs. 5000</span>
                    <span className="mx-8 text-white/50">•</span>
                    <span className="text-xs font-bold uppercase tracking-[0.3em]">Direct Import from Italy</span>
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
                <span className="text-nomad-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block fade-right">Collections</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-nomad-black fade-right">Curated Excellence</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center text-xs font-bold uppercase tracking-widest hover:text-nomad-gold transition-colors pb-2 border-b border-transparent hover:border-nomad-gold fade-right">
                View All Categories <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {[
                { title: "Machines", image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&q=80&w=400", video: "https://videos.pexels.com/video-files/3053787/3053787-uhd_2560_1440_25fps.mp4", bgColor: "bg-nomad-cream" },
                { title: "Grinders", image: "https://images.unsplash.com/photo-1618116523910-1840b2f69830?auto=format&fit=crop&q=80&w=400", video: "https://videos.pexels.com/video-files/4443026/4443026-uhd_2560_1440_25fps.mp4", bgColor: "bg-nomad-gray" },
                { title: "Blenders", image: "https://images.unsplash.com/photo-1570197571499-166b36435e9f?auto=format&fit=crop&q=80&w=400", video: "https://videos.pexels.com/video-files/3195979/3195979-uhd_2560_1440_25fps.mp4", bgColor: "bg-nomad-hero" },
                { title: "Accessories", image: "https://images.unsplash.com/photo-1544655615-5654316d2e61?auto=format&fit=crop&q=80&w=400", video: "https://videos.pexels.com/video-files/6803738/6803738-uhd_2560_1440_25fps.mp4", bgColor: "bg-[#EFEBE9]" }
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
        </div>
      </section>

      {/* Featured Collection - Blends */}
      <section className="relative z-10 py-24 bg-white rounded-t-[3rem] -mt-12 shadow-2xl overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
           <div className="flex items-center justify-between mb-12">
             <h2 className="text-3xl md:text-5xl font-serif font-medium text-nomad-black fade-right">Top Rated Machines</h2>
             <Link to="/shop?category=Machines" className="text-xs font-bold uppercase tracking-widest border-b border-nomad-black pb-1 hover:text-nomad-gold hover:border-nomad-gold transition-colors fade-right">
                View Catalog
             </Link>
           </div>
           
           <div className="flex overflow-x-auto gap-8 pb-10 no-scrollbar snap-x snap-mandatory">
              {GEAR_PRODUCTS.slice(0, 5).map((product, idx) => (
                <div key={product.id} className="min-w-[280px] md:min-w-[340px] snap-center fade-right" style={{ transitionDelay: `${200 + idx * 100}ms` }}>
                  <ProductCard product={product} variant="poster" />
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Opposite Rotating Brand Logos */}
      <section className="relative z-10 py-24 bg-nomad-paper border-t border-gray-100 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 mb-12">
           <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase text-center fade-right">Trusted Partners & Global Brands</p>
        </div>
        
        <div className="space-y-12">
            {/* Top Row - Moves Left */}
            <div className="flex animate-marquee whitespace-nowrap opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                {[...BRAND_LOGOS, ...BRAND_LOGOS].map((brand, idx) => (
                    <span key={`top-${idx}`} className="text-3xl md:text-5xl font-serif font-bold text-nomad-black mx-16 hover:text-nomad-gold cursor-default transition-colors">
                        {brand}
                    </span>
                ))}
            </div>

            {/* Bottom Row - Moves Right */}
            <div className="flex animate-marquee-reverse whitespace-nowrap opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                {[...BRAND_LOGOS, ...BRAND_LOGOS].map((brand, idx) => (
                    <span key={`bottom-${idx}`} className="text-3xl md:text-5xl font-serif font-bold text-nomad-black mx-16 hover:text-nomad-gold cursor-default transition-colors">
                        {brand}
                    </span>
                ))}
            </div>
        </div>
      </section>

      {/* Rotating Testimonials Section */}
      <section className="relative z-10 py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
            <div className="flex justify-center mb-8">
                <Quote size={48} className="text-nomad-gold opacity-20" />
            </div>
            
            <div className="relative min-h-[300px] flex items-center justify-center">
                {TESTIMONIALS.map((t, idx) => (
                    <div 
                        key={idx}
                        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
                            idx === activeTestimonial ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
                        }`}
                    >
                        <div className="flex gap-1 mb-6">
                            {[...Array(t.rating)].map((_, i) => <Star key={i} size={20} fill="#B08B5B" stroke="none" />)}
                        </div>
                        <p className="text-2xl md:text-3xl font-serif italic text-nomad-black mb-8 leading-relaxed">
                            "{t.text}"
                        </p>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-nomad-black">{t.name}</h4>
                            <p className="text-xs text-nomad-gold font-medium uppercase tracking-widest">{t.role}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-3 mt-12">
                {TESTIMONIALS.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setActiveTestimonial(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            idx === activeTestimonial ? 'bg-nomad-gold w-8' : 'bg-gray-200'
                        }`}
                    />
                ))}
            </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="relative z-10 py-24 bg-nomad-paper">
        <div className="container mx-auto px-6 md:px-12">
           <div className="text-center max-w-2xl mx-auto mb-16">
               <span className="text-nomad-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Essentials</span>
               <h2 className="text-3xl md:text-5xl font-serif font-medium mb-4 text-nomad-black">Curated Favorites</h2>
               <p className="text-gray-500 text-lg font-light">Hand-picked selections that our community loves the most.</p>
           </div>
           
           <div className="flex overflow-x-auto gap-8 pb-10 no-scrollbar snap-x snap-mandatory">
              {BEST_COFFEES.map((product, idx) => (
                <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-center fade-right">
                  <ProductCard product={product} />
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;