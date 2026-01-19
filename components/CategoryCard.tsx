import React, { useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';

const { Link } = ReactRouterDOM;

interface CategoryCardProps {
  title?: string;
  image: string;
  video?: string;
  bgColor?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, image, video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Link 
      to={`/shop?category=${encodeURIComponent(title || '')}`} 
      className="block relative overflow-hidden aspect-[3/4] group rounded-3xl shadow-lg isolate w-full h-full"
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      {/* Background Image (The "Photo Section" look) */}
      <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110">
         <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
         />
         {/* Gradient Overlay for Text Visibility */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity"></div>
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
           <div className="absolute inset-0 bg-black/20"></div>
        </div>
      )}

      {/* Text Layer */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end items-center text-center z-20 pointer-events-none">
        {title && (
            <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                <h3 className="font-serif font-bold text-2xl md:text-3xl text-white mb-3 tracking-wide">{title}</h3>
                <span className="inline-block border-b border-nomad-gold pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-nomad-gold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    Explore Collection
                </span>
            </div>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;