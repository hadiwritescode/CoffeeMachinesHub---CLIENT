import React, { useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';

const { Link } = ReactRouterDOM;

interface CategoryCardProps {
  title?: string;
  image: string;
  video?: string;
  bgColor: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, image, video, bgColor }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Link 
      to="/shop" 
      className={`block relative overflow-hidden aspect-[3/4] group ${bgColor} rounded-3xl`}
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      {/* Video Layer */}
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
           <div className="absolute inset-0 bg-black/10"></div>
        </div>
      )}

      {/* Static Layer */}
      <div className="absolute inset-0 p-8 flex flex-col items-center justify-center z-20 pointer-events-none">
        <img 
            src={image} 
            alt="Category" 
            className="w-4/5 h-auto object-contain drop-shadow-2xl group-hover:scale-110 group-hover:opacity-0 transition-all duration-500 ease-in-out" 
        />
        {title && <h3 className="mt-4 font-bold text-xl text-black group-hover:text-white transition-colors duration-300">{title}</h3>}
      </div>
    </Link>
  );
};

export default CategoryCard;