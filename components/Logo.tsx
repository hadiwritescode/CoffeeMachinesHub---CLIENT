import React from 'react';

interface LogoProps {
  className?: string;
  fill?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-12", fill = "currentColor" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="Coffee Machines Hub"
    >
       {/* Geometric Abstract Cup */}
       <path 
         d="M20 30 L 80 30 L 70 75 C 68 85, 60 90, 50 90 C 40 90, 32 85, 30 75 Z" 
         fill="none" 
         stroke={fill} 
         strokeWidth="3.5" 
         strokeLinejoin="round"
       />
       
       {/* Stylized Steam / Aroma - Minimalist Lines */}
       <line x1="40" y1="20" x2="40" y2="10" stroke={fill} strokeWidth="3" strokeLinecap="round" />
       <line x1="50" y1="22" x2="50" y2="8" stroke={fill} strokeWidth="3" strokeLinecap="round" />
       <line x1="60" y1="20" x2="60" y2="10" stroke={fill} strokeWidth="3" strokeLinecap="round" />

       {/* Handle (Geometric) */}
       <path 
         d="M80 35 L 90 35 L 90 55 L 75 55" 
         fill="none" 
         stroke={fill} 
         strokeWidth="3.5" 
         strokeLinecap="round" 
         strokeLinejoin="round"
       />

       {/* Bean shape accent inside */}
       <path 
        d="M 42 55 Q 50 45 58 55"
        fill="none"
        stroke={fill}
        strokeWidth="2"
        opacity="0.6"
       />
    </svg>
  );
};

export default Logo;