import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center bg-nomad-paper text-center px-6">
      <div className="bg-gray-100 p-6 rounded-full mb-6 animate-fade-in">
        <Coffee size={48} className="text-gray-400" />
      </div>
      <h1 className="text-4xl md:text-6xl font-serif font-bold text-nomad-black mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        404
      </h1>
      <h2 className="text-xl font-bold uppercase tracking-widest text-gray-500 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        Page Not Found
      </h2>
      <p className="text-gray-500 max-w-md mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
        The page you are looking for might have been moved, deleted, or possibly never existed.
      </p>
      <Link 
        to="/" 
        className="bg-nomad-black text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-nomad-gold transition-colors shadow-lg animate-slide-up"
        style={{ animationDelay: '0.4s' }}
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;