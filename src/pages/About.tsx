import React from 'react';
import { useStore } from '../context/StoreContext';

const About: React.FC = () => {
  const { siteContent } = useStore();
  const content = siteContent.about;
  const team = siteContent.team;
  const values = content.values || [];

  return (
    <div className="animate-fade-in bg-nomad-paper min-h-screen">
      
      {/* 1. HERO HEADER */}
      <div className="pt-32 md:pt-40 pb-12 md:pb-20 container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="text-center mb-16 md:mb-32 fade-up">
            <span className="text-nomad-gold text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 md:mb-6 block">
                Est. 2026
            </span>
            <h1 className="text-4xl md:text-7xl lg:text-9xl font-serif font-bold mb-6 md:mb-8 text-nomad-black whitespace-pre-line leading-[0.9]">
                {content.heroTitle}
            </h1>
            <div className="w-16 md:w-24 h-1 bg-nomad-gold mx-auto mb-6 md:mb-8 opacity-50"></div>
            <p className="text-base md:text-2xl font-serif italic text-gray-500 max-w-3xl mx-auto leading-relaxed px-4">
                {content.heroSubtitle}
            </p>
        </div>

        {/* 2. FEATURE IMAGE */}
        <div className="w-full aspect-video md:h-[70vh] overflow-hidden rounded-[2rem] md:rounded-[4rem] mb-20 md:mb-32 shadow-2xl fade-up relative group">
           <img 
             src={content.heroImage} 
             alt="About Hero" 
             className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
           />
           <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* 3. STORY & VALUES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start mb-24 md:mb-48 fade-up">
            {/* Left: Story */}
            <div>
               <span className="text-nomad-gold text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Who We Are</span>
               <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 md:mb-8 text-nomad-black leading-tight">
                   {content.storyTitle}
               </h2>
               <div className="prose prose-base md:prose-lg text-gray-600 leading-relaxed space-y-6">
                   <p>{content.storyText}</p>
                   <p>
                       We believe that great coffee is an experience, not just a routine. From sourcing the finest beans to providing top-tier machinery, our mission is to elevate every sip you take.
                   </p>
               </div>
            </div>

            {/* Right: Values Card */}
            <div className="bg-white p-8 md:p-12 lg:p-16 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-nomad-gold/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
               
               <h3 className="text-lg md:text-xl font-bold mb-8 md:mb-10 uppercase tracking-widest text-nomad-black relative z-10 border-b border-gray-100 pb-4">Core Values</h3>
               <ul className="space-y-6 md:space-y-8 relative z-10">
                  {values.map((val, idx) => (
                      <li key={idx} className="flex items-start group/item">
                         <span className="text-nomad-gold/30 font-serif text-3xl md:text-5xl mr-4 md:mr-6 leading-none font-bold group-hover/item:text-nomad-gold transition-colors">0{idx + 1}</span>
                         <div>
                             <h4 className="font-bold text-nomad-black text-base md:text-lg mb-1 md:mb-2">{val.title}</h4>
                             <p className="text-gray-500 leading-relaxed text-xs md:text-sm">{val.text}</p>
                         </div>
                      </li>
                  ))}
                  {values.length === 0 && <p className="text-gray-400 italic">No values defined yet.</p>}
               </ul>
            </div>
        </div>

        {/* 4. TEAM SECTION */}
        <div className="mb-20 md:mb-24 fade-up">
            <div className="text-center mb-12 md:mb-20">
                <span className="text-nomad-gold text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4 block">The Experts</span>
                <h2 className="text-3xl md:text-6xl font-serif font-bold text-nomad-black">Meet The Team</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
               {team.map((member, i) => (
                   <div key={i} className="group text-center">
                       <div className="relative mx-auto mb-6 md:mb-8 w-56 h-56 md:w-72 md:h-72">
                           <div className="absolute inset-0 bg-nomad-gold/20 rounded-full blur-xl scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                           <div className="w-full h-full rounded-full overflow-hidden border border-gray-200 relative z-10">
                               <img 
                                   src={member.img} 
                                   alt={member.name} 
                                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                               />
                           </div>
                       </div>
                       <h3 className="text-xl md:text-2xl font-serif font-bold mb-2 text-nomad-black">{member.name}</h3>
                       <p className="text-nomad-gold text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">{member.role}</p>
                   </div>
               ))}
               {team.length === 0 && (
                   <div className="col-span-full text-center py-12 text-gray-400">
                       <p>Team members will be added soon.</p>
                   </div>
               )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default About;