
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Phone, Search, User, ShoppingBag, Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
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

  // Dynamic Phone Number Cleaning
  const contactPhone = siteContent.contact?.phone || "03104811010";
  const displayPhone = contactPhone;
  const waPhone = contactPhone.replace(/[^0-9]/g, '');

  // Determine transparent routes (Home and Shop)
  const isHome = location.pathname === '/';
  const isTransparentRoute = isHome || location.pathname === '/shop';
  
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const dynamicNavLinks = NAVIGATION_LINKS.map(link => {
    if (link.label === 'SHOP') {
      return { ...link, subItems: categories };
    }
    return link;
  });

  useEffect(() => {
    const handleScroll = () => {
      // For Home page, header stays transparent longer (until content scrolls up)
      const threshold = isHome ? (window.innerHeight - 100) : 10;
      setIsScrolled(window.scrollY > threshold);
    };
    
    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false);
    setMobileSubmenuOpen(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [location]);

  useEffect(() => {
    if (searchOpen || mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [searchOpen, mobileMenuOpen]);

  // Focus search input when opened
  useEffect(() => {
      if (searchOpen && searchInputRef.current) {
          setTimeout(() => searchInputRef.current?.focus(), 100);
      }
  }, [searchOpen]);

  useEffect(() => {
      if (searchQuery.trim().length > 1) {
          const lowerQuery = searchQuery.toLowerCase();
          const filtered = products.filter(p => 
              p.title.toLowerCase().includes(lowerQuery) || 
              p.category?.toLowerCase().includes(lowerQuery)
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

  const getHeaderClasses = () => {
    if (isScrolled) {
      return 'bg-nomad-paper shadow-sm py-3 text-nomad-black border-b border-nomad-black/5';
    }
    if (isTransparentRoute && !mobileMenuOpen) {
      return 'bg-transparent py-4 md:py-6 text-white';
    }
    // Default fallback for other pages when not scrolled (should be paper/solid)
    return 'bg-nomad-paper py-4 md:py-6 text-nomad-black shadow-sm border-b border-nomad-black/5';
  };

  const getLogoFill = () => {
    if (isScrolled) return '#3B261B';
    if (isTransparentRoute && !mobileMenuOpen) return 'white';
    return '#3B261B';
  };

  const getNavLinkClass = () => {
     if (isScrolled) return 'text-nomad-black hover:text-nomad-gold';
     if (isTransparentRoute && !mobileMenuOpen) return 'text-white hover:text-nomad-paper';
     return 'text-nomad-black hover:text-nomad-gold';
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-[100] transition-all duration-300 ease-in-out ${getHeaderClasses()}`}>
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between relative h-full">
          
          {/* Left Side: Mobile Menu Toggle & Desktop Logo */}
          <div className="flex items-center z-[110]">
              {/* Mobile Toggle */}
              <div className="md:hidden">
                <button 
                    className="focus:outline-none p-1"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    {mobileMenuOpen ? <X size={24} className="text-nomad-black" /> : <Menu size={24} className={isTransparentRoute && !isScrolled ? "text-white" : "text-nomad-black"} />}
                </button>
              </div>

              {/* Desktop Logo - Aligned Left */}
              <Link to="/" className="hidden md:block transition-transform hover:scale-105">
                <Logo 
                    className={`transition-all duration-300 ${isScrolled ? 'h-10 md:h-12' : 'h-12 md:h-14'}`} 
                    fill={getLogoFill()}
                />
              </Link>
          </div>

          {/* Center: Mobile Logo & Desktop Nav (Absolutely Centered) */}
          
          {/* Mobile Logo (Absolute Center) */}
          <Link to="/" className="md:hidden absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[110]">
            <Logo 
                className={`transition-all duration-300 ${isScrolled ? 'h-10' : 'h-12'}`} 
                fill={mobileMenuOpen ? '#3B261B' : getLogoFill()}
            />
          </Link>

          {/* Desktop Nav (Absolute Center) */}
          <nav className="hidden md:flex space-x-8 lg:space-x-10 items-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {dynamicNavLinks.map((link) => (
              <div 
                key={link.label}
                className="relative h-full flex items-center py-2 group"
                onMouseEnter={() => link.subItems && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link 
                  to={link.href} 
                  className={`text-[10px] lg:text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 flex items-center gap-1 ${getNavLinkClass()} ${location.pathname === link.href ? 'opacity-100 underline decoration-2 underline-offset-4' : 'opacity-90 hover:opacity-100'}`}
                >
                  {link.label}
                  {link.subItems && link.subItems.length > 0 && <ChevronDown size={10} className="mt-0.5" />}
                </Link>
                
                {/* MEGA MENU */}
                {link.subItems && link.subItems.length > 0 && activeDropdown === link.label && (
                  <div className="fixed left-0 top-[64px] md:top-[74px] w-full bg-nomad-paper shadow-2xl z-40 border-t border-nomad-black/5 animate-in fade-in slide-in-from-top-1 text-nomad-black">
                    <div className="container mx-auto px-12 py-12">
                      <div className="flex justify-between">
                          {/* Categories Grid */}
                          <div className="flex gap-12 lg:gap-20">
                              {link.subItems.map((category) => (
                                <div key={category.title} className="flex flex-col space-y-6">
                                  <h3 className="font-serif font-bold text-2xl text-nomad-black">{category.title}</h3>
                                  <ul className="space-y-3">
                                    {category.items.map((item) => (
                                      <li key={item}>
                                        <Link 
                                          to={`/shop?category=${encodeURIComponent(category.title)}&subcategory=${encodeURIComponent(item)}`} 
                                          className="text-gray-500 hover:text-nomad-gold text-sm font-medium block transition-colors"
                                        >
                                          {item}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                          </div>

                          {/* Featured Card (Hardcoded for aesthetics as per screenshot reference) */}
                          <div className="w-80 bg-white rounded-3xl p-4 shadow-lg shrink-0 hidden xl:block">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 block">Featured</span>
                              <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative group cursor-pointer" onClick={() => navigate('/shop')}>
                                  <img 
                                    src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600" 
                                    alt="Professional Setup" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                  />
                                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                              </div>
                              <h4 className="font-serif font-bold text-xl text-nomad-black mb-1">Professional Setup</h4>
                              <p className="text-xs text-gray-500 mb-4 leading-relaxed">Everything you need for a café-quality espresso bar at home.</p>
                              <Link to="/shop" className="text-[10px] font-bold uppercase tracking-widest text-nomad-gold hover:text-nomad-black transition-colors border-b border-nomad-gold/30 pb-1">
                                  Explore Now
                              </Link>
                          </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side: Icons */}
          <div className="flex items-center space-x-4 md:space-x-6 z-[110]">
            <button onClick={() => setSearchOpen(true)} className={`transition-colors p-1 ${getNavLinkClass()}`} aria-label="Search">
              <Search strokeWidth={1.5} size={22} className={mobileMenuOpen ? 'text-nomad-black' : ''} />
            </button>
            <Link to="/login" className={`transition-colors p-1 hidden sm:block ${getNavLinkClass()}`} aria-label="Account">
              <User strokeWidth={1.5} size={22} className={mobileMenuOpen ? 'text-nomad-black' : ''} />
            </Link>
            <Link to="/cart" className={`transition-colors p-1 relative ${getNavLinkClass()}`} aria-label="Cart">
              <ShoppingBag strokeWidth={1.5} size={22} className={mobileMenuOpen ? 'text-nomad-black' : ''} />
              <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 bg-nomad-gold rounded-full flex items-center justify-center text-[8px] font-bold text-white transition-transform ${cartCount > 0 ? 'scale-100' : 'scale-0'}`}>{cartCount}</span>
            </Link>
          </div>
        </div>

        {/* Search Overlay */}
        <div className={`fixed inset-0 bg-nomad-paper/98 backdrop-blur-xl z-[200] flex items-center justify-center transition-all duration-500 ${searchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <button onClick={() => setSearchOpen(false)} className="absolute top-8 right-8 text-nomad-black hover:text-nomad-gold p-2">
                <X size={32} strokeWidth={1} />
            </button>
            <div className="w-full max-w-4xl px-6 relative">
                <form onSubmit={handleSearchSubmit} className="relative">
                    <input 
                        ref={searchInputRef}
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search our hub..." 
                        className="w-full bg-transparent border-b border-gray-300 py-6 text-2xl md:text-5xl font-serif font-medium text-center focus:outline-none focus:border-nomad-black transition-colors text-nomad-black placeholder:text-gray-300"
                    />
                    <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-gray-400 hover:text-nomad-gold transition-colors">
                        <ArrowRight size={32} strokeWidth={1} />
                    </button>
                </form>
                {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-6 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[50vh] overflow-y-auto">
                        {suggestions.map(p => (
                            <Link key={p.id} to={`/product/${p.id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0" onClick={() => setSearchOpen(false)}>
                                <img src={p.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                <div><h4 className="font-bold text-sm text-nomad-black">{p.title}</h4><p className="text-xs text-gray-500">{p.category}</p></div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`fixed inset-y-0 left-0 w-[85%] max-w-sm h-screen bg-nomad-paper z-[150] transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] md:hidden flex flex-col shadow-2xl ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-8 border-b border-gray-200 mt-10">
             <Logo className="h-10 w-auto" fill="#3B261B" />
          </div>
          <div className="flex-grow overflow-y-auto p-8 space-y-6">
             {dynamicNavLinks.map((link) => (
               <div key={link.label} className="border-b border-gray-100 pb-4">
                  {link.subItems ? (
                    <>
                      <button onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === link.label ? null : link.label)} className="w-full text-lg font-serif font-bold text-nomad-black flex justify-between items-center">
                        {link.label}
                        <ChevronDown size={18} className={`transition-transform ${mobileSubmenuOpen === link.label ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`mt-4 space-y-4 overflow-hidden transition-all duration-300 ${mobileSubmenuOpen === link.label ? 'max-h-96' : 'max-h-0'}`}>
                        {link.subItems.map(sub => (
                          <div key={sub.title} className="pl-4">
                             <Link 
                               to={`/shop?category=${encodeURIComponent(sub.title)}`} 
                               className="block text-sm font-bold text-nomad-black mb-2" 
                               onClick={() => setMobileMenuOpen(false)}
                             >
                               {sub.title}
                             </Link>
                             <div className="pl-3 border-l border-gray-200 space-y-2">
                               {sub.items.map(item => (
                                   <Link 
                                     key={item} 
                                     to={`/shop?category=${encodeURIComponent(sub.title)}&subcategory=${encodeURIComponent(item)}`}
                                     className="block text-xs text-gray-500 hover:text-nomad-gold"
                                     onClick={() => setMobileMenuOpen(false)}
                                   >
                                     {item}
                                   </Link>
                               ))}
                             </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link to={link.href} className="text-lg font-serif font-bold text-nomad-black block" onClick={() => setMobileMenuOpen(false)}>
                      {link.label}
                    </Link>
                  )}
               </div>
             ))}
          </div>
          <div className="p-8 bg-nomad-gray border-t border-gray-200 space-y-4">
             <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noreferrer" className="flex items-center space-x-3 text-sm font-bold uppercase tracking-wider text-gray-600 hover:text-nomad-black">
               <Phone size={18} /> <span>{displayPhone}</span>
             </a>
             <Link to="/login" className="block text-xs font-bold uppercase tracking-widest text-nomad-black" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
          </div>
        </div>
        
        {/* Mobile Menu Backdrop */}
        {mobileMenuOpen && (
            <div className="fixed inset-0 bg-black/50 z-[140] md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
        )}
      </header>
    </>
  );
};

export default Header;
