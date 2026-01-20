
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Phone, Search, User, ShoppingBag, Menu, X, ArrowRight, ChevronRight, ChevronDown } from 'lucide-react';
import { NAVIGATION_LINKS } from '../constants';
import Logo from './Logo';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

const { Link, useLocation, useNavigate } = ReactRouterDOM;

const Header: React.FC = () => {
  const { cart, products, categories, siteContent } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isTransparentRoute = location.pathname === '/' || 
                             location.pathname === '/shop' ||
                             (location.pathname.startsWith('/blogs/') && location.pathname !== '/blogs');
  
  const isHomePage = location.pathname === '/';
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const dynamicNavLinks = NAVIGATION_LINKS.map(link => {
    if (link.label === 'SHOP') {
      return { ...link, subItems: categories };
    }
    return link;
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false);
    setMobileSubmenuOpen(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [location]);

  useEffect(() => {
    if (searchOpen) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
    }
    
    if (searchOpen || mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [searchOpen, mobileMenuOpen]);

  useEffect(() => {
      if (searchQuery.trim().length > 1) {
          const lowerQuery = searchQuery.toLowerCase();
          const filtered = products.filter(p => 
              p.title.toLowerCase().includes(lowerQuery) || 
              p.category?.toLowerCase().includes(lowerQuery) ||
              p.tags?.some(t => t.toLowerCase().includes(lowerQuery))
          ).slice(0, 5);
          setSuggestions(filtered);
      } else {
          setSuggestions([]);
      }
  }, [searchQuery, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleMobileSubmenu = (label: string) => {
    setMobileSubmenuOpen(mobileSubmenuOpen === label ? null : label);
  };

  const getHeaderClasses = () => {
    if (isScrolled) {
      return 'bg-nomad-paper/95 backdrop-blur-md shadow-sm py-3 text-nomad-black';
    }
    if (isTransparentRoute && !mobileMenuOpen) {
      return 'bg-transparent py-4 md:py-6 text-white hover:bg-nomad-black/10';
    }
    return 'bg-nomad-paper py-4 md:py-5 text-nomad-black shadow-sm border-b border-nomad-black/5';
  };

  const getLogoFill = () => {
    if (isScrolled) return 'currentColor';
    if (isTransparentRoute && !mobileMenuOpen) return 'white';
    return 'currentColor';
  };

  const dropdownTop = isScrolled ? '64px' : '96px';

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${getHeaderClasses()} ${isHomePage ? 'animate-slide-down' : ''}`}
        style={{ animationDelay: isHomePage ? '0.1s' : '0s', opacity: isHomePage ? 0 : 1, animationFillMode: 'forwards' }}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between relative">
          
          <div className="flex items-center gap-4 md:hidden z-[60]">
            <button 
                className="focus:outline-none transition-colors p-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
            >
                {mobileMenuOpen ? <X size={24} className="text-nomad-black" /> : <Menu size={24} />}
            </button>
          </div>

          <Link 
            to="/" 
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 md:static md:transform-none md:translate-x-0 md:translate-y-0 z-50"
          >
            <Logo 
                className={`transition-all duration-300 ${isScrolled ? 'h-10 md:h-16 w-auto' : 'h-12 md:h-20 w-auto'}`} 
                fill={mobileMenuOpen ? '#3B261B' : getLogoFill()}
            />
          </Link>

          <nav className="hidden md:flex space-x-6 lg:space-x-10 items-center h-full mx-auto">
            {dynamicNavLinks.map((link) => (
              <div 
                key={link.label}
                className="relative h-full flex items-center py-2 group"
                onMouseEnter={() => handleMouseEnter(link.label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  to={link.href} 
                  className={`text-[10px] lg:text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 hover-underline-animation flex items-center gap-1 ${
                    location.pathname === link.href 
                      ? 'opacity-100' 
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {link.label}
                  {link.subItems && link.subItems.length > 0 && <ChevronDown size={10} className="mt-0.5 opacity-50" />}
                </Link>
                
                {link.subItems && link.subItems.length > 0 && activeDropdown === link.label && (
                  <div 
                    className="fixed left-0 w-full bg-nomad-paper shadow-2xl z-40 border-t border-nomad-gray animate-in fade-in slide-in-from-top-1 duration-200 cursor-default text-nomad-black"
                    style={{ top: dropdownTop }}
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    
                    <div className="container mx-auto px-6 md:px-12 py-12">
                      <div className="flex flex-col md:flex-row gap-16">
                        <div className="flex-grow grid grid-cols-4 gap-8">
                            {link.subItems.map((category) => (
                              <div key={category.title} className="flex flex-col space-y-6">
                                <h3 className="font-serif font-bold text-xl text-nomad-black border-b border-gray-200 pb-2">{category.title}</h3>
                                <ul className="space-y-3">
                                  {category.items.map((item) => (
                                    <li key={item}>
                                      <Link 
                                        to={`/shop?category=${encodeURIComponent(category.title)}&subcategory=${encodeURIComponent(item)}`} 
                                        className="text-gray-500 hover:text-nomad-gold text-sm font-medium block transition-transform hover:translate-x-1 duration-200"
                                      >
                                        {item}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                        </div>
                        <div className="hidden lg:flex w-72 flex-col flex-shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-nomad-gray group/card">
                           <h4 className="text-[10px] font-bold tracking-widest uppercase mb-4 text-gray-400">Featured</h4>
                           <div className="overflow-hidden rounded-xl mb-4 aspect-square relative">
                              <img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Featured" />
                           </div>
                           <p className="font-serif font-bold text-xl mb-1 text-nomad-black">Professional Setup</p>
                           <p className="text-gray-500 text-xs mb-3">Everything you need for a café-quality espresso bar at home.</p>
                           <Link to="/shop" className="text-xs underline font-bold uppercase tracking-wider text-nomad-gold hover:text-nomad-black transition-colors">Explore Now</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center space-x-4 md:space-x-6 z-50">
            <button 
              onClick={() => setSearchOpen(true)}
              className="hover:text-nomad-gold transition-colors p-1"
              aria-label="Search"
            >
              <Search strokeWidth={1.5} size={22} className={mobileMenuOpen ? 'text-nomad-black' : ''} />
            </button>
            <Link to="/login" className="hover:text-nomad-gold transition-colors p-1 hidden sm:block" aria-label="Account">
              <User strokeWidth={1.5} size={22} />
            </Link>
            <Link to="/cart" className="hover:text-nomad-gold transition-colors p-1 relative group" aria-label="Cart">
              <ShoppingBag strokeWidth={1.5} size={22} className={mobileMenuOpen ? 'text-nomad-black' : ''} />
              <span className={`absolute -top-1 -right-1 w-3 h-3 bg-nomad-gold rounded-full flex items-center justify-center text-[8px] font-bold text-white transition-transform ${cartCount > 0 ? 'scale-100' : 'scale-0'}`}>{cartCount}</span>
            </Link>
          </div>
        </div>

        <div 
            className={`fixed inset-0 bg-nomad-paper/98 backdrop-blur-xl z-[60] flex items-center justify-center transition-all duration-500 ${
                searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
        >
            <button 
                onClick={() => setSearchOpen(false)}
                className="absolute top-6 right-6 md:top-8 md:right-8 text-nomad-black hover:text-nomad-gold transition-colors p-2"
            >
                <X size={32} strokeWidth={0.5} className="md:w-10 md:h-10" />
            </button>
            
            <div className="w-full max-w-4xl px-6 animate-slide-up relative">
                <form onSubmit={handleSearchSubmit} className="relative group">
                    <input 
                        ref={searchInputRef}
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Type to search..." 
                        className="w-full bg-transparent border-b border-gray-300 py-4 md:py-6 text-2xl md:text-5xl font-serif font-medium text-center focus:outline-none focus:border-nomad-black transition-colors placeholder:text-gray-300 text-nomad-black"
                    />
                    <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 p-2 md:p-4 text-gray-400 hover:text-nomad-gold transition-colors">
                        <ArrowRight size={24} strokeWidth={1} className="md:w-8 md:h-8" />
                    </button>
                </form>

                {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-4 bg-white rounded-2xl shadow-xl overflow-hidden z-50">
                        {suggestions.map(product => (
                            <Link 
                                key={product.id} 
                                to={`/product/${product.id}`} 
                                className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                onClick={() => setSearchOpen(false)}
                            >
                                <img src={product.image} alt={product.title} className="w-12 h-12 rounded-lg object-cover" />
                                <div>
                                    <h4 className="font-bold text-sm text-nomad-black">{product.title}</h4>
                                    <p className="text-xs text-gray-500">{product.category}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-8 md:mt-12 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 md:mb-6">Trending Now</p>
                    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                        {['Espresso', 'Hario V60', 'Ethiopia', 'Decaf', 'Scale'].map(term => (
                            <button 
                                key={term}
                                onClick={() => {
                                    setSearchQuery(term);
                                    navigate(`/shop?search=${term}`);
                                    setSearchOpen(false);
                                }}
                                className="px-4 py-2 md:px-6 md:py-3 bg-white border border-gray-100 rounded-full text-xs md:text-sm font-medium text-gray-600 hover:bg-nomad-black hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className={`fixed inset-0 bg-nomad-black/60 backdrop-blur-sm z-[55] transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)}></div>
        
        <div className={`fixed inset-y-0 left-0 w-[85%] max-w-sm h-[100dvh] bg-nomad-paper z-[60] transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] md:hidden flex flex-col shadow-2xl ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex justify-between items-center border-b border-gray-200 bg-nomad-paper shrink-0">
             <Logo className="h-10 w-auto" fill="#3B261B" />
          </div>
          <div className="flex-grow overflow-y-auto p-6 space-y-1">
             {dynamicNavLinks.map((link) => (
               <div key={link.label} className="border-b border-gray-200 last:border-0 pb-2 mb-2">
                 <div className="flex justify-between items-center">
                    {link.subItems && link.subItems.length > 0 ? (
                        <button 
                            className="flex-grow text-lg font-serif font-bold text-nomad-black py-3 text-left flex justify-between items-center active:text-nomad-gold transition-colors"
                            onClick={() => toggleMobileSubmenu(link.label)}
                        >
                            {link.label}
                            <ChevronDown size={16} className={`transition-transform duration-300 ${mobileSubmenuOpen === link.label ? 'rotate-180' : ''}`} />
                        </button>
                    ) : (
                        <Link 
                            to={link.href} 
                            className="flex-grow text-lg font-serif font-bold text-nomad-black py-3 active:text-nomad-gold transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    )}
                 </div>
                 
                 {link.subItems && link.subItems.length > 0 && (
                   <div className={`pl-4 space-y-4 overflow-hidden transition-all duration-300 ease-in-out ${mobileSubmenuOpen === link.label ? 'max-h-[800px] mb-4 mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                      {link.subItems.map(sub => (
                        <div key={sub.title}>
                          <h4 className="text-[10px] font-bold text-nomad-gold uppercase mb-2 tracking-widest">{sub.title}</h4>
                          <ul className="space-y-2 pl-2 border-l border-gray-200">
                            {sub.items.map(item => (
                              <li key={item}>
                                <Link 
                                  to={`/shop?category=${encodeURIComponent(sub.title)}&subcategory=${encodeURIComponent(item)}`} 
                                  className="text-sm text-gray-600 block py-1.5 hover:text-nomad-black transition-colors"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                   </div>
                 )}
               </div>
             ))}
          </div>
          <div className="p-6 bg-nomad-gray border-t border-gray-200 shrink-0 mb-safe">
             <Link to="/cart" className="flex items-center space-x-3 text-sm font-bold uppercase tracking-wider text-gray-600 mb-4 hover:text-nomad-black" onClick={() => setMobileMenuOpen(false)}>
               <ShoppingBag size={18} /> <span>Cart ({cartCount})</span>
             </Link>
             <Link to="/login" className="flex items-center space-x-3 text-sm font-bold uppercase tracking-wider text-gray-600 mb-4 hover:text-nomad-black" onClick={() => setMobileMenuOpen(false)}>
               <User size={18} /> <span>Sign In / Register</span>
             </Link>
             <a href={`tel:${siteContent.contact.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center space-x-3 text-sm font-medium text-gray-500 hover:text-nomad-black">
               <Phone size={18} /> <span>{siteContent.contact.phone}</span>
             </a>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
