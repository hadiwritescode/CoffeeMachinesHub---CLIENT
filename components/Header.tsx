
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Search, User, ShoppingBag, Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { NAVIGATION_LINKS } from '../constants';
import Logo from './Logo';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

const Header: React.FC = () => {
  const { cart, products, categories, siteContent } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Dynamic Phone Number Cleaning
  const contactPhone = siteContent.contact?.phone || "03104811010";
  
  // Format visual display (e.g. 0310 481 1010)
  const rawDigits = contactPhone.replace(/[^0-9]/g, '');
  // Default to 11 digits format for PK numbers starting with 03
  let displayPhone = contactPhone;
  if (rawDigits.length === 11 && rawDigits.startsWith('03')) {
      displayPhone = rawDigits.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  
  // Format for WhatsApp (strip non-digits, handle leading 0 for PK)
  let waPhone = rawDigits;
  if (waPhone.startsWith('0')) {
    waPhone = '92' + waPhone.substring(1);
  } else if (!waPhone.startsWith('92') && waPhone.length === 10) {
    waPhone = '92' + waPhone;
  }

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

  const trendingTerms = siteContent.home.trendingTags || ['Espresso', 'Hario V60', 'Ethiopia', 'Decaf', 'Scale'];

  useEffect(() => {
    const handleScroll = () => {
      // Calculate threshold based on Hero height (100vh) minus Header height (~80px)
      // This ensures the header turns solid exactly when it hits the paper/white content
      const threshold = isHome ? (window.innerHeight - 80) : 10;
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
        {/* Using a 3-column flex layout to center Nav without transforms */}
        <div className="container mx-auto px-6 md:px-12 flex items-center h-full relative">
          
          {/* 1. Left Side: Mobile Menu Toggle & Desktop Logo */}
          <div className="flex-1 flex items-center justify-start z-[110]">
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

              {/* Desktop Logo */}
              <Link to="/" className="hidden md:block transition-transform hover:scale-105 origin-left">
                <Logo 
                    className={`transition-all duration-300 ${isScrolled ? 'h-10 md:h-12' : 'h-12 md:h-14'}`} 
                    fill={getLogoFill()}
                />
              </Link>
          </div>

          {/* 2. Center: Mobile Logo (Absolute) & Desktop Nav (Flex) */}
          
          {/* Mobile Logo - Centered Absolutely (fine for mobile view) */}
          <Link to="/" className="md:hidden absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[110]">
            <Logo 
                className={`transition-all duration-300 ${isScrolled ? 'h-10' : 'h-12'}`} 
                fill={mobileMenuOpen ? '#3B261B' : getLogoFill()}
            />
          </Link>

          {/* Desktop Nav - Centered via Flexbox (No Transform) */}
          <nav className="hidden md:flex space-x-8 lg:space-x-10 items-center justify-center">
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
                
                {/* MEGA MENU - FULL WIDTH */}
                {/* Fixed positioning relative to viewport because parent Nav has no transforms */}
                {link.subItems && link.subItems.length > 0 && activeDropdown === link.label && (
                  <div className="fixed left-0 top-[64px] md:top-[74px] w-screen bg-nomad-paper shadow-xl z-40 border-t border-nomad-black/5 animate-in fade-in slide-in-from-top-2 text-nomad-black h-auto max-h-[85vh] overflow-y-auto">
                    <div className="w-full px-8 md:px-12 py-12">
                      <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">
                          {/* Categories Grid - Expanded */}
                          <div className="flex-grow grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 xl:gap-12">
                              {link.subItems.map((category) => (
                                <div key={category.title} className="flex flex-col">
                                  <Link to={`/shop?category=${encodeURIComponent(category.title)}`} className="font-serif font-bold text-2xl lg:text-3xl text-nomad-black mb-6 hover:text-nomad-gold transition-colors block">
                                    {category.title}
                                  </Link>
                                  <ul className="space-y-3">
                                    {category.items.map((item) => (
                                      <li key={item}>
                                        <Link 
                                          to={`/shop?category=${encodeURIComponent(category.title)}&subcategory=${encodeURIComponent(item)}`} 
                                          className="text-nomad-black/60 hover:text-nomad-gold font-medium text-sm lg:text-base transition-colors block"
                                        >
                                          {item}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                          </div>

                          {/* Featured Card - Right Side */}
                          <div className="hidden 2xl:block w-96 shrink-0 border-l border-nomad-black/10 pl-12">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-nomad-black/40 mb-6 block">Featured Collection</span>
                              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition-all duration-300" onClick={() => navigate('/shop')}>
                                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 relative">
                                      <img 
                                        src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600" 
                                        alt="Professional Setup" 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                      />
                                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                                  </div>
                                  <h4 className="font-serif font-bold text-xl text-nomad-black mb-2">Professional Setup</h4>
                                  <p className="text-xs text-gray-500 mb-4 leading-relaxed line-clamp-2">Everything you need for a café-quality espresso bar at home.</p>
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-nomad-gold border-b border-nomad-gold/30 pb-1 group-hover:text-nomad-black group-hover:border-nomad-black transition-colors">
                                      Explore Now
                                  </span>
                              </div>
                          </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* 3. Right Side: Icons - flex-1 to balance layout */}
          <div className="flex-1 flex items-center justify-end space-x-4 md:space-x-6 z-[110]">
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

        {/* Full Screen Search Overlay */}
        <div 
            className={`fixed inset-0 bg-[#3B261B]/98 backdrop-blur-3xl z-[200] flex flex-col items-center justify-center transition-all duration-500 ${searchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <button 
                onClick={() => setSearchOpen(false)} 
                className="absolute top-10 right-10 text-white/50 hover:text-white p-2 transition-transform hover:rotate-90 duration-300"
                aria-label="Close Search"
            >
                <X size={40} strokeWidth={1} />
            </button>
            
            <div className="w-full max-w-5xl px-6 relative animate-slide-up">
                <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center justify-center">
                    <input 
                        ref={searchInputRef}
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Type to search..." 
                        className="w-full bg-transparent border-none py-6 text-4xl md:text-7xl font-serif font-medium text-center focus:outline-none text-[#EAE4D6] placeholder:text-[#EAE4D6]/30"
                    />
                    <button 
                        type="submit" 
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-nomad-gold transition-colors hidden md:block"
                    >
                        <ArrowRight size={40} strokeWidth={1} />
                    </button>
                </form>

                <div className="mt-16 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block mb-6">Trending Now</span>
                    <div className="flex flex-wrap justify-center gap-4">
                        {trendingTerms.map(term => (
                            <button 
                                key={term}
                                onClick={() => {
                                    setSearchQuery(term);
                                    navigate(`/shop?search=${encodeURIComponent(term)}`);
                                    setSearchOpen(false);
                                }}
                                className="bg-white/10 hover:bg-white text-white hover:text-[#3B261B] px-6 py-3 rounded-full text-sm font-medium transition-all duration-300"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
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
