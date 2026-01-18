import React, { useRef, useState } from 'react';
import { Product } from '../types';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  variant?: 'simple' | 'detailed' | 'poster';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'simple' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(price).replace('PKR', 'Rs.');
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className="group flex flex-col h-full w-full cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/5] mb-5">
        {/* Sold Out Badge */}
        {product.soldOut && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-black text-[10px] font-bold px-3 py-1.5 z-20 uppercase tracking-widest rounded-sm">
            Sold Out
          </div>
        )}
        
        {/* Main Image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            <img 
              src={product.image} 
              alt={product.title}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isHovered && (product.hoverImage || product.hoverVideo) ? 'opacity-0' : 'scale-100 group-hover:scale-110'}`}
            />
            
            {/* Hover Video */}
            {product.hoverVideo && (
               <video 
                 ref={videoRef}
                 src={product.hoverVideo}
                 muted
                 loop
                 playsInline
                 className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
               />
            )}

            {/* Hover Image (Fallback if no video, or if video fails to load) */}
            {!product.hoverVideo && product.hoverImage && (
              <img 
                  src={product.hoverImage} 
                  alt={`${product.title} alternate`}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="flex flex-col items-start space-y-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-sans font-bold text-lg leading-tight group-hover:text-nomad-gold transition-colors duration-300">
            {product.title}
          </h3>
        </Link>
        
        {variant === 'poster' && product.subtitle && (
          <p className="text-xs text-gray-500 font-medium tracking-wide">{product.subtitle}</p>
        )}
        
        <div className="text-sm font-medium text-gray-800 pt-1">
          {formatPrice(product.price)}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;