import React from 'react';
import Logo from './Logo';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, AtSign } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    // md:fixed ensures it only uses the reveal effect on larger screens
    // The height matches the margin-bottom in App.tsx
    <footer className="w-full bg-nomad-black text-nomad-paper z-0 md:fixed md:bottom-0 md:left-0 md:h-[450px] flex flex-col justify-between pt-16 pb-8 md:pt-0 md:pb-0">
      <div className="container mx-auto px-6 md:px-12 h-full flex flex-col justify-center">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12 items-start md:items-center">
            
            {/* Brand Column */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="mb-6 inline-block">
                    <Logo className="h-32 w-auto text-nomad-gold" />
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
               <Link to="/shop?category=Coffee" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Beans</Link>
               <Link to="/shop?category=Gear" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Equipment</Link>
               <Link to="/services" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Commercial</Link>
               <Link to="/shop?category=Merchandise" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Merch</Link>
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
               {/* Pointing to Contact for now as per scope */}
               <Link to="/contact" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Shipping Policy</Link>
               <Link to="/contact" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Returns & Exchange</Link>
               <Link to="/contact" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Privacy Policy</Link>
               <Link to="/contact" className="text-nomad-paper/70 hover:text-white transition-colors text-sm">Terms of Service</Link>
            </div>
        </div>

        <div className="border-t border-nomad-gold/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 relative">
            <p className="text-nomad-paper/50 text-xs font-mono text-center md:text-left w-full md:w-auto order-2 md:order-1">
              © 2026 Coffee Machines Hub. All rights reserved.
            </p>
            
            {/* Socials Centered */}
            <div className="flex space-x-8 order-1 md:order-2 md:absolute md:left-1/2 md:-translate-x-1/2">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-nomad-paper/60 hover:text-nomad-gold transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-nomad-paper/60 hover:text-nomad-gold transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-nomad-paper/60 hover:text-nomad-gold transition-colors" aria-label="YouTube"><Youtube size={20} /></a>
                <a href="#" className="text-nomad-paper/60 hover:text-nomad-gold transition-colors" aria-label="Threads"><AtSign size={20} /></a>
            </div>

            {/* Spacer for balance */}
            <div className="hidden md:block w-32 order-3"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;