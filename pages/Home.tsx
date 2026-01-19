import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Play, Search, Star, Quote } from 'lucide-react';

const { Link, useNavigate } = ReactRouterDOM;

const Home: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [heroSearch, setHeroSearch] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();
  const { products, siteContent, testimonials, categories } = useStore();

  useEffect(() => {
    const handleScroll = () => {
       setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
        const interval = setInterval(() => {
        setActiveTestimonial(prev => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(interval);
    }
  }, [testimonials]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/shop?search=${encodeURIComponent(heroSearch)}`);
    }
  };

  const trendingTerms = ['Espresso', 'Grinder', 'Roast', 'Accessories'];
  
  // DYNAMIC SECTION LOGIC:
  // 1. Identify "Main" category (prefer ones with 'Machine', else take first)
  const mainCategory = categories.find(c => c.title.toLowerCase().includes('machine')) || categories[0] || { title: 'Machines' };
  
  // 2. Filter products for the main slider
  const machineProducts = products.filter(p => p.category === mainCategory.title || p.tags?.includes(mainCategory.title)).slice(0, 6);
  
  // 3. Featured / Favorites Section
  const featuredProducts = products.filter(p => p.isFeatured);
  // Fallback if no featured items: use the 2nd category or just more random items
  const displayFavorites = featuredProducts.length > 0 
    ? featuredProducts 
    : products.filter(p => p.category !== mainCategory.title).slice(0, 6);

  // Content Accessors
  const hero = siteContent?.hero || { title: "Coffee Machines Hub", subtitle: "", videoUrl: "", buttonText: "Shop Now" };
  const homeText = siteContent?.home || {
    collectionTitle: "Collections",
    collectionSubtitle: "Curated Excellence",
    featuredTitle: `Top Rated ${mainCategory.title}`,
    favoritesTitle: "Essentials",
    favoritesSubtitle: "Curated Favorites",
    partnersText: "Trusted Partners & Global Brands",
    brands: []
  };
  const brands = homeText.brands || [];

  return (
    <div className="bg-nomad-paper overflow-hidden">
      
      {/* Hero Section Spacer */}
      <div className="relative w-full h-[100dvh]">
        
        {/* Fixed Hero Content */}
        <div 
            className="fixed top-0 left-0 w-full h-[100dvh] flex items-center justify-center overflow-hidden z-0"
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
                    <source src={hero.videoUrl || ""} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-nomad-black/40"></div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 container mx-auto px-6 md:px-12 text-center text-white h-full flex flex-col justify-center items-center pt-20">
                <div className="w-full max-w-6xl mx-auto space-y-8 md:space-y-12">
                    {/* Dynamic Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif font-medium leading-tight md:leading-none tracking-tight animate-slide-right whitespace-normal md:whitespace-nowrap" style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
                        {hero.title || "Coffee Machines Hub"}
                    </h1>

                    {/* Hero Search Bar */}
                    <div className="animate-slide-up" style={{ animationDelay: '0.8s', opacity: 0, animationFillMode: 'forwards' }}>
                        <form onSubmit={handleHeroSearch} className="relative group w-full max-w-2xl mx-auto">
                            <input 
                                type="text"
                                value={heroSearch}
                                onChange={(e) => setHeroSearch(e.target.value)}
                                placeholder="Search machines, grinders..."
                                className="w-full bg-white/10 backdrop-blur-xl border border-white/30 rounded-full py-4 px-8 md:py-5 md:px-10 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/20 focus:border-white transition-all duration-300 text-base md:text-xl shadow-2xl text-center md:text-left"
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-nomad-gold text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-white hover:text-nomad-black transition-all">
                                <Search size={20} className="md:w-6 md:h-6" />
                            </button>
                        </form>
                        
                        {/* Recommendations */}
                        <div className="mt-6 flex flex-wrap justify-center gap-2 md:gap-3">
                            <span className="text-xs font-bold uppercase tracking-widest text-white/50 w-full mb-2 block">Trending</span>
                            {trendingTerms.map(term => (
                                <button 
                                    key={term}
                                    onClick={() => navigate(`/shop?search=${encodeURIComponent(term)}`)}
                                    className="px-3 py-1.5 md:px-4 md:py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-nomad-black transition-all"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '1.1s', opacity: 0, animationFillMode: 'forwards' }}>
                        <Link 
                            to="/shop" 
                            className="bg-nomad-gold text-white px-8 py-3 md:px-10 md:py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-nomad-black transition-all duration-300 w-full md:w-auto min-w-[200px]"
                        >
                            {hero.buttonText || "Shop Now"}
                        </Link>
                        <Link 
                            to="/about" 
                            className="group flex items-center justify-center gap-3 text-white px-8 py-3 md:px-10 md:py-4 text-xs font-bold tracking-[0.2em] uppercase hover:text-nomad-gold transition-colors duration-300"
                        >
                            <span className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-nomad-gold transition-colors bg-white/5 backdrop-blur-sm">
                                <Play size={10} fill="currentColor" className="ml-0.5 md:w-3 md:h-3" />
                            </span>
                            About Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Marquee Banner */}
      <div className="relative z-10 bg-nomad-gold text-white py-3 md:py-4 overflow-hidden -mt-1 rounded-t-[2rem] animate-slide-up" style={{ animationDelay: '1.3s', opacity: 0, animationFillMode: 'forwards' }}>
         <div className="flex animate-marquee whitespace-nowrap [animation-duration:15s] md:[animation-duration:25s]">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center mx-4 md:mx-8">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">Free Shipping on Orders Over Rs. 5000</span>
                    <span className="mx-4 md:mx-8 text-white/50">•</span>
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">Direct Import from Italy</span>
                    <span className="mx-4 md:mx-8 text-white/50">•</span>
                </div>
            ))}
         </div>
      </div>

      {/* Categories Photo Section */}
      <section className="relative z-10 py-16 md:py-24 bg-nomad-paper">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-6">
            <div className="max-w-xl text-center md:text-left mx-auto md:mx-0">
                <span className="text-nomad-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block fade-right">
                    {homeText.collectionTitle}
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-nomad-black fade-right leading-tight">
                    {homeText.collectionSubtitle}
                </h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center text-xs font-bold uppercase tracking-widest hover:text-nomad-gold transition-colors pb-2 border-b border-transparent hover:border-nomad-gold fade-right whitespace-nowrap">
                View All Categories <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 h-[120vh] md:h-[60vh]">
             {/* Dynamic Category Cards - Show up to 4 */}
             {categories.slice(0, 4).map((cat, idx) => (
                <div key={idx} className="fade-right h-full" style={{ transitionDelay: `${300 + idx * 100}ms` }}>
                    <CategoryCard 
                        title={cat.title} 
                        // Use placeholders or future DB images. For now using reliable stock.
                        image={[
                            "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&q=80&w=800",
                            "https://images.unsplash.com/photo-1618116523910-1840b2f69830?auto=format&fit=crop&q=80&w=800",
                            "https://images.unsplash.com/photo-1570197571499-166b36435e9f?auto=format&fit=crop&q=80&w=800",
                            "https://images.unsplash.com/photo-1544655615-5654316d2e61?auto=format&fit=crop&q=80&w=800"
                        ][idx % 4]}
                        video={[
                            "https://videos.pexels.com/video-files/3053787/3053787-uhd_2560_1440_25fps.mp4",
                            "https://videos.pexels.com/video-files/4443026/4443026-uhd_2560_1440_25fps.mp4",
                            "https://videos.pexels.com/video-files/3195979/3195979-uhd_2560_1440_25fps.mp4",
                            "https://videos.pexels.com/video-files/6803738/6803738-uhd_2560_1440_25fps.mp4"
                        ][idx % 4]}
                    />
                </div>
             ))}
          </div>
          <div className="mt-8 flex justify-center md:hidden">
              <Link to="/shop" className="items-center text-xs font-bold uppercase tracking-widest hover:text-nomad-gold transition-colors pb-1 border-b border-nomad-black hover:border-nomad-gold inline-flex">
                  View All Categories <ArrowRight size={14} className="ml-2" />
              </Link>
          </div>
        </div>
      </section>

      {/* Featured Collection - Top Rated Main Category */}
      <section className="relative z-10 py-16 md:py-24 bg-white rounded-t-[3rem] -mt-12 shadow-2xl overflow-hidden">
        <div className="container mx-auto px-0 md:px-12">
           <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 gap-6 px-6 md:px-0">
             <h2 className="text-3xl md:text-5xl font-serif font-medium text-nomad-black fade-right text-center md:text-left">
                {homeText.featuredTitle}
             </h2>
             <Link to={`/shop?category=${encodeURIComponent(mainCategory.title)}`} className="text-xs font-bold uppercase tracking-widest border-b border-nomad-black pb-1 hover:text-nomad-gold hover:border-nomad-gold transition-colors fade-right whitespace-nowrap hidden md:inline-block">
                View Catalog
             </Link>
           </div>
           
           {/* Mobile Horizontal Scroll Snap */}
           <div className="flex overflow-x-auto gap-4 md:gap-8 pb-10 no-scrollbar snap-x snap-mandatory px-6 md:px-0 scroll-pl-6">
              {machineProducts.map((product, idx) => (
                <div key={product.id} className="min-w-[260px] md:min-w-[340px] snap-start fade-right" style={{ transitionDelay: `${200 + idx * 100}ms` }}>
                  <ProductCard product={product} variant="poster" />
                </div>
              ))}
              {machineProducts.length === 0 && (
                  <div className="w-full text-center py-10 text-gray-400">No products found in this category yet.</div>
              )}
           </div>
           
           <div className="px-6 md:hidden text-center mt-2">
             <Link to={`/shop?category=${encodeURIComponent(mainCategory.title)}`} className="text-xs font-bold uppercase tracking-widest border-b border-nomad-black pb-1 hover:text-nomad-gold hover:border-nomad-gold transition-colors">
                View Catalog
             </Link>
           </div>
        </div>
      </section>

      {/* Curated Favorites (Managed via Admin) */}
      <section className="relative z-10 py-16 md:py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-0 md:px-12">
           <div className="text-center max-w-2xl mx-auto mb-12 px-6">
               <span className="text-nomad-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                   {homeText.favoritesTitle}
               </span>
               <h2 className="text-3xl md:text-5xl font-serif font-medium mb-4 text-nomad-black">
                   {homeText.favoritesSubtitle}
               </h2>
               <p className="text-gray-500 text-lg font-light">Hand-picked selections that our community loves the most.</p>
           </div>
           
           <div className="flex overflow-x-auto gap-4 md:gap-8 pb-10 no-scrollbar snap-x snap-mandatory px-6 md:px-0 scroll-pl-6">
              {displayFavorites.map((product, idx) => (
                <div key={product.id} className="min-w-[260px] md:min-w-[320px] snap-start fade-right">
                  <ProductCard product={product} />
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Opposite Rotating Brand Logos */}
      <section className="relative z-10 py-16 md:py-24 bg-nomad-paper border-t border-gray-100 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 mb-12">
           <p className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase text-center fade-right">
              {homeText.partnersText}
           </p>
        </div>
        
        <div className="space-y-12">
            {/* Top Row - Moves Left */}
            <div className="flex animate-marquee whitespace-nowrap opacity-40 grayscale hover:grayscale-0 transition-all duration-700 [animation-duration:10s] md:[animation-duration:25s]">
                {[...brands, ...brands].map((brand, idx) => (
                    <span key={`top-${idx}`} className="text-3xl md:text-5xl font-serif font-bold text-nomad-black mx-8 md:mx-16 hover:text-nomad-gold cursor-default transition-colors">
                        {brand}
                    </span>
                ))}
            </div>

            {/* Bottom Row - Moves Right */}
            <div className="flex animate-marquee-reverse whitespace-nowrap opacity-40 grayscale hover:grayscale-0 transition-all duration-700 [animation-duration:10s] md:[animation-duration:25s]">
                {[...brands, ...brands].map((brand, idx) => (
                    <span key={`bottom-${idx}`} className="text-3xl md:text-5xl font-serif font-bold text-nomad-black mx-8 md:mx-16 hover:text-nomad-gold cursor-default transition-colors">
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
                {testimonials.map((t, idx) => (
                    <div 
                        key={idx}
                        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
                            idx === activeTestimonial ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
                        }`}
                    >
                        <div className="flex gap-1 mb-6">
                            {[...Array(t.rating)].map((_, i) => <Star key={i} size={20} fill="#B08B5B" stroke="none" />)}
                        </div>
                        <p className="text-xl md:text-3xl font-serif italic text-nomad-black mb-8 leading-relaxed px-4">
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
                {testimonials.map((_, idx) => (
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
    </div>
  );
};

export default Home;
