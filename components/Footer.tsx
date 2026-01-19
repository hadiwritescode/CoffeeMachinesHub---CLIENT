import React from 'react';
import Logo from './Logo';
import * as ReactRouterDOM from 'react-router-dom';
import { Instagram, Facebook, Youtube, AtSign } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const { Link } = ReactRouterDOM;

const Footer: React.FC = () => {
  const { siteContent } = useStore();

  return (
    <footer className="w-full bg-nomad-black text-nomad-paper pt-16 md:pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-12 md:mb-16 items-start">
            
            {/* Brand Column */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="mb-6 inline-block">
                    <Logo className="h-24 md:h-32 w-auto text-nomad-gold" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-nomad-gold mb-4">
                  Coffee Machines Hub
                </h2>
                <p className="text-nomad-paper/80 text-sm leading-relaxed max-w-xs">
                   Purveyors of the finest coffee gear and sustainably sourced beans. Crafting excellence, one cup at a time.
                </p>
            </div>

            {/* Links Column 1 */}
            <div className="md:col-span-2 md:col-start-6 flex flex-col items-center md:items-start space-y-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-nomad-gold mb-2">Shop</h3>
               <Link to="/shop?category=Machines" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Machines</Link>
               <Link to="/shop?category=Grinders" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Grinders</Link>
               <Link to="/shop?category=Blenders" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Blenders</Link>
               <Link to="/shop?category=Accessories" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Accessories</Link>
            </div>

            {/* Links Column 2 */}
            <div className="md:col-span-2 flex flex-col items-center md:items-start space-y-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-nomad-gold mb-2">Company</h3>
               <Link to="/about" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Our Story</Link>
               <Link to="/services" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Services</Link>
               <Link to="/blogs" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Journal</Link>
               <Link to="/contact" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Contact</Link>
            </div>

            {/* Links Column 3 */}
            <div className="md:col-span-2 flex flex-col items-center md:items-start space-y-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-nomad-gold mb-2">Legal</h3>
               <Link to="/contact" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Shipping Policy</Link>
               <Link to="/contact" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Returns & Exchange</Link>
               <Link to="/contact" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Privacy Policy</Link>
               <Link to="/contact" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Terms of Service</Link>
            </div>
        </div>

        <div className="border-t border-nomad-gold/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-nomad-paper/50 text-xs font-mono text-center md:text-left order-2 md:order-1">
              © 2026 Coffee Machines Hub. All rights reserved.
            </p>
            
            <div className="flex space-x-8 order-1 md:order-2">
                <a href={siteContent.socials.instagram} target="_blank" rel="noreferrer" className="text-nomad-paper/60 hover:text-nomad-gold transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
                <a href={siteContent.socials.facebook} target="_blank" rel="noreferrer" className="text-nomad-paper/60 hover:text-nomad-gold transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
                <a href={siteContent.socials.youtube} target="_blank" rel="noreferrer" className="text-nomad-paper/60 hover:text-nomad-gold transition-colors" aria-label="YouTube"><Youtube size={20} /></a>
                <a href={siteContent.socials.twitter} target="_blank" rel="noreferrer" className="text-nomad-paper/60 hover:text-nomad-gold transition-colors" aria-label="Threads"><AtSign size={20} /></a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;