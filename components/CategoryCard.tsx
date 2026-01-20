import React, { useRef, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Coffee, ImageOff } from 'lucide-react';

const { Link } = ReactRouterDOM;

interface CategoryCardProps {
  title?: string;
  image?: string;
  video?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, image, video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imageError, setImageError] = useState(false);

  return (
    <Link 
      to={`/shop?category=${encodeURIComponent(title || '')}`} 
      className="block relative overflow-hidden aspect-[4/5] md:aspect-[3/4] group rounded-3xl shadow-lg isolate w-full bg-nomad-gray"
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110">
         {image && !imageError ? (
           <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
           />
         ) : (
           <div className="w-full h-full flex flex-col items-center justify-center text-nomad-black/20 bg-nomad-gray p-8">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-2">
                 <Coffee size={32} strokeWidth={1.5} />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-50">View Collection</span>
           </div>
         )}
         {/* Gradient Overlay for Text Visibility */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity"></div>
      </div>

      {/* Video Layer (Reveals on Hover) */}
      {video && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10">
           <video 
             ref={videoRef}
             src={video}
             muted
             loop
             playsInline
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-black/40"></div>
        </div>
      )}

      {/* Text Layer */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end items-center text-center z-20 pointer-events-none">
        {title && (
            <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                <h3 className="font-serif font-bold text-2xl md:text-4xl text-white mb-3 tracking-wide">{title}</h3>
                <div className="inline-block">
                    <span className="border-b border-nomad-gold pb-1 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-nomad-gold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                        Explore Collection
                    </span>
                </div>
            </div>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;