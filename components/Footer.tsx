import React from 'react';
import Logo from './Logo';
import * as ReactRouterDOM from 'react-router-dom';
import { Instagram, Facebook, Youtube, AtSign } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const { Link } = ReactRouterDOM;

const Footer: React.FC = () => {
  const { siteContent, categories } = useStore();
  
  // Safe fallback
  const description = siteContent.footer?.description || "Purveyors of the finest coffee gear and sustainably sourced beans.";
  const companyLinks = siteContent.footer?.companyLinks || [
    { label: "Our Story", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Journal", href: "/blogs" },
    { label: "Contact", href: "/contact" }
  ];
  const legalLinks = siteContent.footer?.legalLinks || [
      { label: "Shipping Policy", href: "/contact" },
      { label: "Returns & Exchange", href: "/contact" },
      { label: "Privacy Policy", href: "/contact" },
      { label: "Terms of Service", href: "/contact" }
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-nomad-black text-nomad-paper pt-24 pb-12 z-0">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-12 items-start">
            
            {/* Brand Column */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="mb-6 inline-block">
                    <Logo className="h-24 md:h-32 w-auto text-nomad-gold" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-nomad-gold mb-4">
                  Coffee Machines Hub
                </h2>
                <p className="text-nomad-paper/80 text-sm leading-relaxed max-w-xs">
                   {description}
                </p>
            </div>

            {/* Links Column 1: Dynamic Categories */}
            <div className="md:col-span-2 md:col-start-6 flex flex-col items-center md:items-start space-y-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-nomad-gold mb-2">Shop</h3>
               {categories.slice(0, 5).map(cat => (
                   <Link key={cat.title} to={`/shop?category=${encodeURIComponent(cat.title)}`} className="text-nomad-paper/70 hover:text-white transition-colors text-sm">
                       {cat.title}
                   </Link>
               ))}
            </div>

            {/* Links Column 2: Company */}
            <div className="md:col-span-2 flex flex-col items-center md:items-start space-y-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-nomad-gold mb-2">Company</h3>
               {companyLinks.map((link, idx) => (
                   <Link key={idx} to={link.href} className="text-nomad-paper/70 hover:text-white transition-colors text-sm">
                       {link.label}
                   </Link>
               ))}
            </div>

            {/* Links Column 3: Legal */}
            <div className="md:col-span-2 flex flex-col items-center md:items-start space-y-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-nomad-gold mb-2">Legal</h3>
               {legalLinks.map((link, idx) => (
                   <Link key={idx} to={link.href} className="text-nomad-paper/70 hover:text-white transition-colors text-sm">
                       {link.label}
                   </Link>
               ))}
            </div>
        </div>

        <div className="border-t border-nomad-gold/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-nomad-paper/50 text-xs font-mono text-center md:text-left order-2 md:order-1">
              © {new Date().getFullYear()} Coffee Machines Hub. All rights reserved.
            </p>
            
            <div className="flex space-x-8 order-1 md:order-2">
                <a href={siteContent.socials.instagram} target="_blank" rel="noreferrer" className="text-nomad-paper/60 hover:text-nomad-gold transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
                <a href={siteContent.socials.facebook} target="_blank" rel="noreferrer" className="text-nomad-paper/60 hover:text-nomad-gold transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
                <a href={siteContent.socials.youtube} target="_blank" rel="noreferrer" className="text-nomad-paper/60 hover:text-nomad-gold transition-colors" aria-label="YouTube"><Youtube size={20} /></a>
                <a href={siteContent.socials.twitter} target="_blank" rel="noreferrer" className="text-nomad-paper/60 hover:text-nomad-gold transition-colors" aria-label="Twitter"><AtSign size={20} /></a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;