import React, { useRef, useState } from 'react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DEFAULT_PRODUCT_IMAGE } from '../constants';

interface ProductCardProps {
  product: Product;
  variant?: 'simple' | 'detailed' | 'poster';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'simple' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { siteContent } = useStore();
  const [imgSrc, setImgSrc] = useState(product.image || DEFAULT_PRODUCT_IMAGE);
  const [hoverImgSrc, setHoverImgSrc] = useState(product.hoverImage || product.image || DEFAULT_PRODUCT_IMAGE);

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

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clean phone number: remove non-digits, ensure starts with country code if needed (default to PK 92)
    let rawPhone = siteContent.contact.phone.replace(/[^0-9]/g, '') || '923104811010';
    if (rawPhone.startsWith('0')) {
      rawPhone = '92' + rawPhone.substring(1);
    } else if (!rawPhone.startsWith('92') && rawPhone.length === 10) {
      rawPhone = '92' + rawPhone;
    }
    
    const productUrl = `${window.location.origin}/product/${product.id}`;
    const message = `Hi, I'm interested in ${product.title}. What is the price? ${productUrl}`;
    window.open(`https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div 
      className="group flex flex-col h-full w-full cursor-pointer fade-up-init"
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
              src={imgSrc} 
              alt={product.title}
              onError={() => setImgSrc(DEFAULT_PRODUCT_IMAGE)}
              loading="lazy"
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
                  src={hoverImgSrc} 
                  alt={`${product.title} alternate`}
                  onError={() => setHoverImgSrc(DEFAULT_PRODUCT_IMAGE)}
                  loading="lazy"
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
        
        <button 
          onClick={handleWhatsAppClick}
          className="flex items-center gap-2 text-xs font-bold text-green-600 pt-2 hover:text-green-700 transition-colors uppercase tracking-wider"
        >
          <MessageCircle size={16} />
          WhatsApp for Price
        </button>
      </div>
    </div>
  );
};

export default ProductCard;