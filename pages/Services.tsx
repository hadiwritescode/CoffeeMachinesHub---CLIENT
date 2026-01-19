import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const { Link } = ReactRouterDOM;

const Services: React.FC = () => {
  const { siteContent } = useStore();
  const content = siteContent.services;

  return (
    <div className="animate-fade-in bg-nomad-paper pt-40 pb-20">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center mb-24 fade-up">
            <span className="text-nomad-gold text-xs font-bold tracking-[0.3em] uppercase mb-6 block">Expert Solutions</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 text-nomad-black whitespace-pre-line">
                {content.heroTitle}
            </h1>
            <div className="w-24 h-1 bg-nomad-gold mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl font-serif italic text-gray-500 max-w-3xl mx-auto leading-relaxed">
                {content.heroSubtitle}
            </p>
        </div>

        {/* Feature Image */}
        <div className="w-full h-[60vh] overflow-hidden rounded-[3rem] mb-24 shadow-2xl fade-up">
           <img 
             src={content.heroImage} 
             alt="Service Hero" 
             className="w-full h-full object-cover parallax-effect scale-105"
           />
        </div>

        {/* Service 1 */}
        <div className="flex flex-col lg:flex-row items-center gap-20 mb-32 fade-up">
           <div className="w-full lg:w-1/2 relative group">
             <div className="absolute top-4 -left-4 w-full h-full border-2 border-nomad-gold rounded-3xl z-0 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
             <img src={content.section1Image} alt="Wholesale" className="rounded-3xl shadow-xl relative z-10 w-full" />
           </div>
           <div className="w-full lg:w-1/2">
             <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-serif font-bold text-gray-200">01</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold">{content.section1Title}</h2>
             </div>
             <p className="text-gray-600 text-lg leading-relaxed mb-8">
               {content.section1Text}
             </p>
             <ul className="space-y-4 mb-8">
                <li className="flex items-center text-sm font-bold uppercase tracking-wider text-gray-800"><div className="w-2 h-2 bg-nomad-gold rounded-full mr-3"></div> Custom Roasting Profiles</li>
                <li className="flex items-center text-sm font-bold uppercase tracking-wider text-gray-800"><div className="w-2 h-2 bg-nomad-gold rounded-full mr-3"></div> Volume Discounts</li>
                <li className="flex items-center text-sm font-bold uppercase tracking-wider text-gray-800"><div className="w-2 h-2 bg-nomad-gold rounded-full mr-3"></div> Reliable Logistics</li>
             </ul>
             <Link to="/contact" className="inline-block bg-black text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-nomad-gold transition-colors">
               Become a Partner
             </Link>
           </div>
        </div>

        {/* Service 2 */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-20 mb-32 fade-up">
           <div className="w-full lg:w-1/2 relative group">
             <div className="absolute top-4 -right-4 w-full h-full border-2 border-nomad-black rounded-3xl z-0 transition-transform group-hover:-translate-x-2 group-hover:translate-y-2"></div>
             <img src={content.section2Image} alt="Training" className="rounded-3xl shadow-xl relative z-10 w-full" />
           </div>
           <div className="w-full lg:w-1/2">
             <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-serif font-bold text-gray-200">02</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold">{content.section2Title}</h2>
             </div>
             <p className="text-gray-600 text-lg leading-relaxed mb-8">
               {content.section2Text}
             </p>
             <Link to="/contact" className="inline-block bg-transparent border border-black text-black px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
               Schedule Training
             </Link>
           </div>
        </div>

        {/* Service 3 (Dynamic) */}
        <div className="bg-nomad-cream rounded-[3rem] p-8 md:p-16 fade-up">
           <div className="flex flex-col md:flex-row items-center gap-12">
               <div className="w-full md:w-1/2">
                   <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">{content.section3Title || "Equipment Sourcing & Tech Support"}</h2>
                   <p className="text-gray-600 leading-relaxed mb-8">
                       {content.section3Text || "Your machine is the heart of your operation. We are authorized distributors for La Marzocco, Mahlkönig, and more. Plus, our certified technicians are always on call to ensure minimal downtime."}
                   </p>
                   <Link to="/shop?category=Machines" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-nomad-gold hover:border-nomad-gold transition-colors">
                       View Equipment Catalog
                   </Link>
               </div>
               <div className="w-full md:w-1/2">
                   <img 
                     src={content.section3Image || "https://images.unsplash.com/photo-1522923985141-860e65383563?auto=format&fit=crop&q=80&w=800"} 
                     alt="Tech" 
                     className="rounded-2xl shadow-lg rotate-2 hover:rotate-0 transition-transform duration-500 w-full" 
                   />
               </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Services;