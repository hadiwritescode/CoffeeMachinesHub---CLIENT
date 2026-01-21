
import React from 'react';
import { useStore } from '../context/StoreContext';

const FeaturesBanner: React.FC = () => {
  const { siteContent } = useStore();
  
  const brands = siteContent.home?.brands && siteContent.home.brands.length > 0 
    ? siteContent.home.brands 
    : ['La Marzocco', 'Nuova Simonelli', 'Mahlkönig', 'Hario', 'Fellow', 'AeroPress', 'Comandante', 'Baratza'];

  return (
    <div className="w-full bg-nomad-paper rounded-b-[3rem] md:rounded-b-[5rem] relative z-10 pt-24 pb-32 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
      
      {/* Brands Section */}
      <div className="mb-20">
          <div className="text-center mb-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-nomad-black/40">Brands we work with</span>
          </div>
          
          <div className="overflow-hidden opacity-50 hover:opacity-100 transition-opacity">
              <div className="flex animate-marquee whitespace-nowrap items-center" style={{ animationDuration: '10s' }}>
                  {[...Array(4)].map((_, setIndex) => (
                      <div key={setIndex} className="flex items-center">
                          {brands.map((brand, i) => (
                              <span 
                                key={`${setIndex}-${i}`} 
                                className="mx-8 md:mx-12 text-2xl md:text-4xl font-serif font-bold text-nomad-black/20 uppercase tracking-wider cursor-default select-none"
                              >
                                  {brand}
                              </span>
                          ))}
                      </div>
                  ))}
              </div>
          </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-center items-center text-center divide-y md:divide-y-0 md:divide-x divide-nomad-black/10 gap-8 md:gap-0">
          
          <div className="w-full md:w-1/3 px-4 md:px-12 flex flex-col items-center justify-center pt-8 md:pt-0 pb-8 md:pb-0 first:pt-0 last:pb-0">
            <span className="text-lg md:text-xl font-medium tracking-wide text-nomad-black font-sans">
                Freshly Roasted
            </span>
          </div>

          <div className="w-full md:w-1/3 px-4 md:px-12 flex flex-col items-center justify-center pt-8 md:pt-0 pb-8 md:pb-0">
             <span className="text-lg md:text-xl font-medium tracking-wide text-nomad-black font-sans">
                Nationwide Shipping
             </span>
          </div>

          <div className="w-full md:w-1/3 px-4 md:px-12 flex flex-col items-center justify-center pt-8 md:pt-0 pb-8 md:pb-0 last:pb-0">
             <span className="text-lg md:text-xl font-medium tracking-wide text-nomad-black font-sans">
                One-Stop Shop for Coffee + Gear
             </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FeaturesBanner;
