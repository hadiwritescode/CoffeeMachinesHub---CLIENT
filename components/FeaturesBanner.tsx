import React from 'react';

const FeaturesBanner: React.FC = () => {
  return (
    <div className="w-full bg-[#F0EBE0] border-t border-nomad-black/5 py-16 md:py-20">
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