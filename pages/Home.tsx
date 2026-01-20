import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Search, Quote } from 'lucide-react';

const { Link, useNavigate } = ReactRouterDOM;

const Home: React.FC = () => {
  const [heroSearch, setHeroSearch] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();
  const { products, siteContent, testimonials, categories } = useStore();

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

  const trendingTerms = siteContent.home.trendingTags || ['Espresso', 'Grinder', 'Roast', 'Accessories'];
  const marqueeText = siteContent.home.marqueeText || "Free Shipping on Orders Over Rs. 5000 • Direct Import from Italy";
  const brands = siteContent.home.brands && siteContent.home.brands.length > 0 
    ? siteContent.home.brands 
    : ['La Marzocco', 'Nuova Simonelli', 'Mahlkönig', 'Hario', 'Fellow', 'AeroPress', 'Comandante', 'Baratza'];
  
  // Categorization
  const mainCategory = categories.find(c => c.title.toLowerCase().includes('machine')) || categories[0] || { title: 'Machines' };
  const machineProducts = products.filter(p => p.category === mainCategory.title).slice(0, 6);
  // Favorites logic: items marked as featured
  const favoriteProducts = products.filter(p => p.isFeatured).slice(0, 4);
  
  const hero = siteContent?.hero;
  const homeText = siteContent?.home;

  return (
    <div className="bg-nomad-paper w-full overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden rounded-b-[2.5rem] md:rounded-b-[4rem] shadow-xl">
        <div className="absolute inset-0 z-0">
            <video 
                autoPlay muted loop playsInline
                className="w-full h-full object-cover brightness-[0.65]"
                poster="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=60&w=1200"
            >
                <source src={hero.videoUrl} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Content Container - Centered Vertically */}
        <div className="relative z-10 container mx-auto px-6 text-center text-white h-full flex flex-col justify-center items-center pt-16">
            <div className="max-w-5xl mx-auto space-y-8 animate-slide-up w-full">
                {/* Text Size Reduced to fit one line: lg:text-9xl -> lg:text-8xl */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.1] tracking-tight drop-shadow-2xl">
                    {hero.title}
                </h1>
                
                <p className="text-lg md:text-2xl font-light text-white/90 tracking-wide max-w-2xl mx-auto">
                    {hero.subtitle}
                </p>

                <form onSubmit={handleHeroSearch} className="relative max-w-xl mx-auto group mt-8 z-20">
                    <input 
                        type="text"
                        value={heroSearch}
                        onChange={(e) => setHeroSearch(e.target.value)}
                        placeholder="Search machines, beans..."
                        className="w-full bg-white/10 backdrop-blur-xl border border-white/30 rounded-full py-4 px-6 md:py-5 md:px-12 text-white placeholder:text-white/70 focus:outline-none focus:bg-white/20 focus:border-white transition-all text-base md:text-lg shadow-2xl relative z-20"
                    />
                    <button 
                        type="submit" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-nomad-gold text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-lg z-30 cursor-pointer"
                        aria-label="Search"
                    >
                        <Search size={20} className="md:w-5 md:h-5" />
                    </button>
                </form>
                
                <div className="flex flex-wrap justify-center gap-3 pt-6 relative z-20">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 w-full mb-2 block">Trending</span>
                    {trendingTerms.map(term => (
                        <button 
                            key={term}
                            onClick={() => navigate(`/shop?search=${encodeURIComponent(term)}`)}
                            className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-nomad-black transition-all cursor-pointer"
                        >
                            {term}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* 2. TEXT MARQUEE BANNER */}
      <div className="bg-nomad-gold text-white py-3 relative z-20 shadow-md overflow-hidden">
         <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center px-8">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em]">{marqueeText}</span>
                    <span className="mx-8 opacity-50 text-xs">•</span>
                </div>
            ))}
         </div>
      </div>

      {/* 3. BRANDS MARQUEE */}
      <div className="bg-nomad-paper py-10 md:py-16 border-b border-nomad-black/5 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap items-center">
              {[...Array(4)].map((_, setIndex) => (
                  <div key={setIndex} className="flex items-center">
                      {brands.map((brand, i) => (
                          <span 
                            key={`${setIndex}-${i}`} 
                            className="mx-8 md:mx-12 text-2xl md:text-4xl font-serif font-bold text-nomad-black/20 uppercase tracking-wider hover:text-nomad-black/40 transition-colors cursor-default select-none"
                          >
                              {brand}
                          </span>
                      ))}
                  </div>
              ))}
          </div>
      </div>

      {/* 4. COLLECTIONS GRID (Paper BG) */}
      <section className="py-20 md:py-32 container mx-auto px-6 md:px-12 relative">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-8">
            <div className="max-w-2xl text-center md:text-left fade-up-init w-full md:w-auto">
                <span className="text-nomad-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
                    {homeText.collectionTitle}
                </span>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-nomad-black leading-tight">
                    {homeText.collectionSubtitle}
                </h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center text-xs font-bold uppercase tracking-widest hover:text-nomad-gold transition-colors pb-2 border-b border-nomad-gold/30">
                Browse Full Catalog <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
             {categories.slice(0, 4).map((cat, idx) => (
                <div key={idx} className="fade-up-init" style={{ transitionDelay: `${idx * 0.1}s` }}>
                    <CategoryCard 
                        title={cat.title} 
                        image={cat.image} 
                        video={cat.video}
                    />
                </div>
             ))}
          </div>

          <div className="mt-12 flex justify-center md:hidden">
              <Link to="/shop" className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] border-b border-nomad-black pb-1">
                  View All Collections <ArrowRight size={14} className="ml-2" />
              </Link>
          </div>
      </section>

      {/* 5. FEATURED MACHINES (White BG, Rounded Cut) */}
      <section className="bg-white rounded-t-[3rem] md:rounded-t-[5rem] relative z-10 -mt-10 pt-20 pb-32 md:pt-32 md:pb-40 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-6 md:px-12">
           <div className="flex items-center justify-between mb-12 md:mb-16 fade-up-init">
             <div>
                <span className="text-nomad-gold text-xs font-bold tracking-[0.2em] uppercase mb-3 block">Best Sellers</span>
                <h2 className="text-3xl md:text-6xl font-serif font-bold text-nomad-black tracking-tight">{homeText.featuredTitle}</h2>
             </div>
             <Link to="/shop?category=Machines" className="text-[10px] md:text-xs font-bold uppercase tracking-widest border-b border-nomad-black pb-1 hover:text-nomad-gold transition-colors whitespace-nowrap ml-4">View All</Link>
           </div>
           
           <div className="flex overflow-x-auto gap-6 md:gap-12 pb-12 no-scrollbar snap-x scroll-pl-6 -mx-6 px-6 md:mx-0 md:px-0">
              {machineProducts.map((product, idx) => (
                <div key={product.id} className="min-w-[260px] md:min-w-[360px] snap-start fade-up-init" style={{ transitionDelay: `${idx * 0.1}s` }}>
                  <ProductCard product={product} variant="poster" />
                </div>
              ))}
              {machineProducts.length === 0 && (
                  <p className="text-gray-400 italic">No products currently featured.</p>
              )}
           </div>
        </div>
      </section>

      {/* 6. CURATED FAVORITES (Black BG, Rounded Cut) */}
      <section className="bg-nomad-black text-nomad-paper rounded-t-[3rem] md:rounded-t-[5rem] relative z-20 -mt-20 pt-20 pb-32 md:pt-32 md:pb-48 shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-6 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 fade-up-init">
                <span className="text-nomad-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">{homeText.favoritesTitle}</span>
                <h2 className="text-3xl md:text-6xl font-serif font-bold mb-6">{homeText.favoritesSubtitle}</h2>
                <div className="w-20 h-1 bg-nomad-gold/30 mx-auto"></div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
                {favoriteProducts.map((product, idx) => (
                     <div key={product.id} className="fade-up-init" style={{ transitionDelay: `${idx * 0.1}s` }}>
                        <div className="group cursor-pointer">
                            <Link to={`/product/${product.id}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-white/5 mb-4 md:mb-6">
                                <img src={product.image} alt={product.title} className="w-full h-full object-cover opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" loading="lazy" />
                                {product.soldOut && <div className="absolute top-4 left-4 bg-nomad-gold text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm">Sold Out</div>}
                            </Link>
                            <h3 className="text-sm md:text-lg font-bold font-serif mb-1 group-hover:text-nomad-gold transition-colors line-clamp-2">{product.title}</h3>
                            <p className="text-nomad-gold text-[10px] md:text-sm uppercase tracking-wider mb-2">{product.category}</p>
                            <Link to={`/product/${product.id}`} className="text-[10px] font-bold uppercase tracking-widest border-b border-nomad-gold/30 pb-1 hover:text-nomad-gold transition-colors">View Details</Link>
                        </div>
                     </div>
                ))}
                {favoriteProducts.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 italic py-10">
                        No featured items selected yet. Go to Admin &gt; Products and star some items!
                    </div>
                )}
            </div>
            
             <div className="mt-16 md:mt-20 text-center">
                <Link to="/shop" className="inline-block px-8 py-3 md:px-10 md:py-4 border border-nomad-gold/30 text-nomad-gold rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] hover:bg-nomad-gold hover:text-white transition-all">
                    View Full Collection
                </Link>
            </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS (Paper BG, Rounded Cut) */}
      <section className="bg-nomad-paper rounded-t-[3rem] md:rounded-t-[5rem] relative z-30 -mt-20 pt-20 pb-24 md:pt-32 md:pb-40 shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-6 text-center max-w-5xl fade-up-init">
            <div className="mb-12">
                 <Quote size={48} className="text-nomad-gold/20 mx-auto mb-6" />
                 <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-nomad-black/50">Community Stories</h2>
            </div>
            
            <div className="relative min-h-[250px] md:min-h-[200px] flex items-center justify-center">
                {testimonials.map((t, idx) => (
                    <div 
                        key={idx}
                        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                            idx === activeTestimonial ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-0 translate-y-12 scale-95 blur-sm pointer-events-none'
                        }`}
                    >
                        <p className="text-xl md:text-5xl font-serif italic text-nomad-black mb-8 md:mb-10 leading-[1.4] md:leading-[1.3] px-4 md:px-12">
                            "{t.text}"
                        </p>
                        <div className="space-y-1">
                            <h4 className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-nomad-black">{t.name}</h4>
                            <p className="text-[10px] md:text-xs text-nomad-gold font-bold tracking-[0.2em] uppercase">{t.role}</p>
                        </div>
                    </div>
                ))}
                {testimonials.length === 0 && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-2xl md:text-5xl font-serif italic text-gray-400 mb-12 leading-[1.3] px-4 md:px-10">
                            "Excellence in every cup."
                        </p>
                        <h4 className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-nomad-black">Coffee Machines Hub</h4>
                     </div>
                )}
            </div>
            
            <div className="flex justify-center gap-3 mt-12 md:mt-16">
                {testimonials.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setActiveTestimonial(idx)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${activeTestimonial === idx ? 'w-8 bg-nomad-gold' : 'w-2 bg-gray-300'}`}
                        aria-label={`Go to testimonial ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;