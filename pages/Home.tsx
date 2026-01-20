
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Play, Search, Star, Quote } from 'lucide-react';

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

  const trendingTerms = ['Espresso', 'Grinder', 'Roast', 'Accessories'];
  const mainCategory = categories.find(c => c.title.toLowerCase().includes('machine')) || categories[0] || { title: 'Machines' };
  const machineProducts = products.filter(p => p.category === mainCategory.title).slice(0, 6);
  const featuredProducts = products.filter(p => p.isFeatured);
  const displayFavorites = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);

  const hero = siteContent?.hero;
  const homeText = siteContent?.home;

  return (
    <div className="bg-nomad-paper">
      
      {/* Dynamic Hero - Fixed overlap using standard document flow */}
      <section className="relative w-full min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <video 
                autoPlay muted loop playsInline
                className="w-full h-full object-cover brightness-[0.7]"
                poster="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=60&w=1200"
            >
                <source src={hero.videoUrl} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center text-white pt-24 md:pt-32 pb-12">
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
                <h1 className="text-4xl md:text-7xl lg:text-9xl font-serif font-bold leading-[1.05] tracking-tight">
                    {hero.title}
                </h1>

                <form onSubmit={handleHeroSearch} className="relative max-w-2xl mx-auto group">
                    <input 
                        type="text"
                        value={heroSearch}
                        onChange={(e) => setHeroSearch(e.target.value)}
                        placeholder="Search machines, beans..."
                        className="w-full bg-white/10 backdrop-blur-xl border border-white/30 rounded-full py-5 px-8 md:py-7 md:px-12 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/20 focus:border-white transition-all text-base md:text-xl shadow-2xl"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-nomad-gold text-white w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-lg">
                        <Search size={22} className="md:w-7 md:h-7" />
                    </button>
                </form>
                
                <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 w-full mb-2">Trending searches</span>
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
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="bg-nomad-gold text-white py-4 md:py-6 overflow-hidden relative z-20 shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
         <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center px-10 md:px-16">
                    <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.3em]">Free Shipping on Orders Over Rs. 5000</span>
                    <span className="mx-10 md:mx-16 opacity-30 text-2xl">•</span>
                    <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.3em]">Direct Import from Italy</span>
                    <span className="mx-10 md:mx-16 opacity-30 text-2xl">•</span>
                </div>
            ))}
         </div>
      </div>

      {/* Collections Grid */}
      <section className="py-24 md:py-40 container mx-auto px-6 md:px-12 relative">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
            <div className="max-w-2xl text-center md:text-left">
                <span className="text-nomad-gold text-xs font-bold tracking-[0.3em] uppercase mb-5 block">
                    {homeText.collectionTitle}
                </span>
                <h2 className="text-4xl md:text-7xl font-serif font-bold text-nomad-black leading-[1.1]">
                    {homeText.collectionSubtitle}
                </h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center text-xs font-bold uppercase tracking-widest hover:text-nomad-gold transition-colors pb-2 border-b border-nomad-gold/30">
                Browse Full Catalog <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
             {categories.slice(0, 4).map((cat, idx) => (
                <div key={idx} className="fade-up-init">
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

      {/* Featured Products */}
      <section className="py-24 md:py-40 bg-white rounded-t-[3rem] md:rounded-t-[6rem] shadow-[0_-40px_80px_rgba(0,0,0,0.04)] relative z-10">
        <div className="container mx-auto px-6 md:px-12">
           <div className="flex items-center justify-between mb-16">
             <h2 className="text-3xl md:text-6xl font-serif font-bold text-nomad-black tracking-tight">{homeText.featuredTitle}</h2>
             <Link to="/shop" className="text-[10px] md:text-xs font-bold uppercase tracking-widest border-b border-nomad-black pb-1 hover:text-nomad-gold transition-colors">Explore</Link>
           </div>
           
           <div className="flex overflow-x-auto gap-6 md:gap-12 pb-12 no-scrollbar snap-x scroll-pl-6 -mx-6 px-6 md:mx-0 md:px-0">
              {machineProducts.map(product => (
                <div key={product.id} className="min-w-[280px] md:min-w-[420px] snap-start">
                  <ProductCard product={product} variant="poster" />
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 md:py-48 bg-nomad-paper border-t border-nomad-gray/20">
        <div className="container mx-auto px-6 text-center max-w-5xl">
            <Quote size={64} className="text-nomad-gold/15 mx-auto mb-16" />
            <div className="relative min-h-[300px] md:min-h-[250px] flex items-center justify-center">
                {testimonials.map((t, idx) => (
                    <div 
                        key={idx}
                        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                            idx === activeTestimonial ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95 pointer-events-none'
                        }`}
                    >
                        <p className="text-2xl md:text-5xl font-serif italic text-nomad-black mb-12 leading-[1.3] md:px-10">
                            "{t.text}"
                        </p>
                        <div className="space-y-1">
                            <h4 className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-nomad-black">{t.name}</h4>
                            <p className="text-[10px] md:text-xs text-nomad-gold font-bold tracking-[0.2em] uppercase">{t.role}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="flex justify-center gap-3 mt-12">
                {testimonials.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setActiveTestimonial(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${activeTestimonial === idx ? 'w-8 bg-nomad-gold' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
