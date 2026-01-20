import React, { useRef, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Coffee } from 'lucide-react';
import { DEFAULT_PRODUCT_IMAGE } from '../constants';

const { Link } = ReactRouterDOM;

interface CategoryCardProps {
  title?: string;
  image?: string;
  video?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, image, video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(image || DEFAULT_PRODUCT_IMAGE);

  return (
    <Link 
      to={`/shop?category=${encodeURIComponent(title || '')}`} 
      className="block relative overflow-hidden aspect-[4/5] md:aspect-[3/4] group rounded-[2.5rem] shadow-2xl bg-nomad-gray isolate group-hover:shadow-nomad-gold/10 transition-all duration-500"
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      <div className="absolute inset-0 z-0 transition-transform duration-[1.5s] ease-out group-hover:scale-110">
         <img 
            src={imgSrc} 
            alt={title} 
            onLoad={() => setImageLoaded(true)}
            onError={() => setImgSrc(DEFAULT_PRODUCT_IMAGE)}
            className={`w-full h-full object-cover transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-nomad-black/95 via-nomad-black/30 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-700"></div>
      </div>

      {video && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10">
           <video 
             ref={videoRef}
             src={video}
             muted loop playsInline
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-black/30"></div>
        </div>
      )}

      <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end items-center text-center z-20 pointer-events-none">
        <h3 className="font-serif font-bold text-3xl md:text-5xl text-white mb-5 tracking-tight drop-shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
            {title}
        </h3>
        <div className="overflow-hidden">
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-nomad-gold opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-100">
                Explore Collection
            </span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;