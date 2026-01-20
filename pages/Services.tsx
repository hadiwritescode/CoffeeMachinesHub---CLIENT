import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Check } from 'lucide-react';

const { Link } = ReactRouterDOM;

const Services: React.FC = () => {
  const { siteContent } = useStore();
  const content = siteContent.services;
  
  // Fallback if list is empty in DB
  const points = content.section1List || ["Custom Roasting Profiles", "Volume Discounts", "Reliable Logistics"];

  return (
    <div className="animate-fade-in bg-nomad-paper min-h-screen">
      
      {/* 1. HERO SECTION */}
      <div className="pt-32 md:pt-40 pb-12 md:pb-20 container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="text-center mb-16 md:mb-32 fade-up">
            <span className="text-nomad-gold text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 md:mb-6 block">
                Expert Solutions
            </span>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 md:mb-8 text-nomad-black whitespace-pre-line leading-[0.9]">
                {content.heroTitle}
            </h1>
            <p className="text-base md:text-2xl font-serif italic text-gray-500 max-w-2xl mx-auto leading-relaxed px-4">
                {content.heroSubtitle}
            </p>
        </div>

        {/* Feature Image */}
        <div className="w-full aspect-video md:h-[70vh] overflow-hidden rounded-[2rem] md:rounded-[4rem] mb-20 md:mb-32 shadow-2xl fade-up relative group">
           <img 
             src={content.heroImage} 
             alt="Service Hero" 
             className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
           />
           <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* 2. WHOLESALE (Left Image, Right Text) */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-24 md:mb-48 fade-up">
           <div className="w-full lg:w-1/2 relative">
             <div className="aspect-[4/5] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl relative z-10">
                <img src={content.section1Image} alt="Wholesale" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
             </div>
             {/* Decorative Element */}
             <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-nomad-gold/10 rounded-full blur-2xl -z-10"></div>
           </div>
           
           <div className="w-full lg:w-1/2">
             <span className="text-nomad-gold text-5xl md:text-8xl font-serif font-bold opacity-20 block mb-4 md:mb-6 select-none">01</span>
             <h2 className="text-3xl md:text-5xl font-serif font-bold text-nomad-black mb-4 md:mb-6 leading-tight">
                {content.section1Title}
             </h2>
             <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 md:mb-10">
               {content.section1Text}
             </p>
             
             <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                {points.map((point, idx) => (
                    <li key={idx} className="flex items-center text-xs md:text-sm font-bold uppercase tracking-wider text-nomad-black">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-nomad-gold flex items-center justify-center mr-3 md:mr-4 text-white shrink-0">
                            <Check size={10} strokeWidth={4} />
                        </div>
                        {point}
                    </li>
                ))}
             </ul>
             
             <Link to="/contact" className="inline-flex items-center text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] border-b-2 border-nomad-black pb-2 hover:text-nomad-gold hover:border-nomad-gold transition-colors">
               Inquire About Wholesale
             </Link>
           </div>
        </div>

        {/* 3. TRAINING (Right Image, Left Text) */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24 mb-24 md:mb-48 fade-up">
           <div className="w-full lg:w-1/2 relative">
             <div className="aspect-[4/5] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl relative z-10">
                <img src={content.section2Image} alt="Training" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
             </div>
           </div>
           
           <div className="w-full lg:w-1/2">
             <span className="text-nomad-black text-5xl md:text-8xl font-serif font-bold opacity-10 block mb-4 md:mb-6 select-none">02</span>
             <h2 className="text-3xl md:text-5xl font-serif font-bold text-nomad-black mb-4 md:mb-6 leading-tight">
                {content.section2Title}
             </h2>
             <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 md:mb-10">
               {content.section2Text}
             </p>
             <Link to="/contact" className="bg-nomad-black text-white px-8 py-4 md:px-10 md:py-4 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] hover:bg-nomad-gold transition-all shadow-lg hover:shadow-xl">
               Schedule Training
             </Link>
           </div>
        </div>

        {/* 4. TECH SUPPORT CARD */}
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 lg:p-20 shadow-sm border border-gray-100 fade-up relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-nomad-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
           
           <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-20 relative z-10">
               <div className="w-full lg:w-1/2 order-2 lg:order-1">
                   <span className="text-nomad-gold text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Peace of Mind</span>
                   <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 md:mb-6 text-nomad-black">
                       {content.section3Title || "Equipment Sourcing & Tech Support"}
                   </h2>
                   <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 md:mb-10">
                       {content.section3Text || "Your machine is the heart of your operation. We are authorized distributors for La Marzocco, Mahlkönig, and more. Plus, our certified technicians are always on call to ensure minimal downtime."}
                   </p>
                   <Link to="/shop?category=Machines" className="text-[10px] md:text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 hover:text-nomad-gold hover:border-nomad-gold transition-colors">
                       View Equipment Catalog
                   </Link>
               </div>
               <div className="w-full lg:w-1/2 order-1 lg:order-2">
                   <div className="relative">
                        <img 
                            src={content.section3Image || "https://images.unsplash.com/photo-1522923985141-860e65383563?auto=format&fit=crop&q=80&w=800"} 
                            alt="Tech Support" 
                            className="rounded-[1.5rem] md:rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 w-full object-cover aspect-[4/3]" 
                        />
                   </div>
               </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Services;