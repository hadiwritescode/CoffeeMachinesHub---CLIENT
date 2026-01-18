import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Search, User, ShoppingBag, Menu, X, ArrowRight, ChevronRight, ChevronDown } from 'lucide-react';
import { NAVIGATION_LINKS } from '../constants';
import Logo from './Logo';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Pages where header should be transparent at top
  const isTransparentRoute = ['/', '/shop'].includes(location.pathname) || 
                             (location.pathname.startsWith('/blogs/') && location.pathname !== '/blogs') ||
                             (location.pathname.startsWith('/product/'));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [location]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
    }
    // Prevent body scroll when menu/search is open
    if (searchOpen || mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [searchOpen, mobileMenuOpen]);

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

  const getHeaderClasses = () => {
    if (isScrolled) {
      return 'bg-nomad-paper/95 backdrop-blur-md shadow-sm py-3 text-nomad-black';
    }
    if (isTransparentRoute && !mobileMenuOpen) {
      return 'bg-transparent py-6 text-white hover:bg-black/10';
    }
    return 'bg-nomad-paper py-5 text-nomad-black';
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
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${getHeaderClasses()}`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between relative">
          
          {/* Mobile Toggle */}
          <button 
            className="md:hidden mr-4 focus:outline-none transition-colors p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 z-50 transition-transform duration-300 hover:scale-105">
            <Logo 
                className={`transition-all duration-300 ${isScrolled ? 'h-10 w-auto' : 'h-12 w-auto'}`} 
                fill={getLogoFill()}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 lg:space-x-12 items-center h-full mx-auto">
            {NAVIGATION_LINKS.map((link) => (
              <div 
                key={link.label}
                className="relative h-full flex items-center py-2 group"
                onMouseEnter={() => handleMouseEnter(link.label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  to={link.href} 
                  className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 hover-underline-animation flex items-center gap-1 ${
                    location.pathname === link.href 
                      ? 'opacity-100' 
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {link.label}
                  {link.subItems && <ChevronDown size={10} className="mt-0.5 opacity-50" />}
                </Link>
                
                {/* Mega Menu Dropdown */}
                {link.subItems && activeDropdown === link.label && (
                  <div 
                    className="fixed left-0 w-full bg-nomad-paper shadow-2xl z-40 border-t border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200 cursor-default text-nomad-black"
                    style={{ top: dropdownTop }}
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    
                    <div className="container mx-auto px-6 md:px-12 py-12">
                      <div className="flex flex-col md:flex-row gap-16">
                        <div className="flex-grow grid grid-cols-4 gap-12">
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
                        {/* Featured Item */}
                        <div className="hidden lg:flex w-72 flex-col flex-shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group/card">
                           <h4 className="text-[10px] font-bold tracking-widest uppercase mb-4 text-gray-400">Featured</h4>
                           <div className="overflow-hidden rounded-xl mb-4 aspect-square relative">
                              <img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" alt="Featured" />
                           </div>
                           <p className="font-serif font-bold text-xl mb-1 text-nomad-black">New Arrivals</p>
                           <p className="text-gray-500 text-xs mb-3">Check out the latest beans from Ethiopia.</p>
                           <Link to="/shop" className="text-xs underline font-bold uppercase tracking-wider text-nomad-gold hover:text-black transition-colors">Shop Now</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setSearchOpen(true)}
              className="hover:text-nomad-gold transition-colors p-1"
              aria-label="Search"
            >
              <Search strokeWidth={1.5} size={22} />
            </button>
            <Link to="/login" className="hover:text-nomad-gold transition-colors p-1 hidden sm:block" aria-label="Account">
              <User strokeWidth={1.5} size={22} />
            </Link>
            <Link to="/cart" className="hover:text-nomad-gold transition-colors p-1 relative group" aria-label="Cart">
              <ShoppingBag strokeWidth={1.5} size={22} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-nomad-gold rounded-full flex items-center justify-center text-[8px] font-bold text-white">0</span>
            </Link>
          </div>
        </div>

        {/* Search Overlay */}
        <div 
            className={`fixed inset-0 bg-white/98 backdrop-blur-xl z-[60] flex items-center justify-center transition-all duration-500 ${
                searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
        >
            <button 
                onClick={() => setSearchOpen(false)}
                className="absolute top-8 right-8 text-black hover:text-nomad-gold transition-colors p-2"
            >
                <X size={40} strokeWidth={0.5} />
            </button>
            
            <div className="w-full max-w-4xl px-6 animate-slide-up">
                <form onSubmit={handleSearchSubmit} className="relative group">
                    <input 
                        ref={searchInputRef}
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Type to search..." 
                        className="w-full bg-transparent border-b border-gray-200 py-6 text-3xl md:text-5xl font-serif font-medium text-center focus:outline-none focus:border-black transition-colors placeholder:text-gray-200 text-black"
                    />
                    <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-gray-400 hover:text-nomad-gold transition-colors">
                        <ArrowRight size={32} strokeWidth={1} />
                    </button>
                </form>
                <div className="mt-12 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Trending Now</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['Espresso', 'Hario V60', 'Ethiopia', 'Decaf', 'Scale'].map(term => (
                            <button 
                                key={term}
                                onClick={() => {
                                    setSearchQuery(term);
                                    navigate(`/shop?search=${term}`);
                                    setSearchOpen(false);
                                }}
                                className="px-6 py-3 bg-gray-50 rounded-full text-sm font-medium text-gray-600 hover:bg-black hover:text-white transition-all duration-300"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)}></div>
        
        {/* Mobile Menu Content */}
        <div className={`fixed top-0 left-0 w-[90%] max-w-sm h-full bg-nomad-paper z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] md:hidden flex flex-col shadow-2xl ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex justify-between items-center border-b border-gray-100 bg-nomad-paper">
             <Logo className="h-10 w-auto" />
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
               <X size={20} className="text-gray-600" />
             </button>
          </div>
          <div className="flex-grow overflow-y-auto p-6 space-y-1">
             {NAVIGATION_LINKS.map((link) => (
               <div key={link.label} className="border-b border-gray-100 last:border-0 pb-2 mb-2">
                 <div className="flex justify-between items-center">
                    <Link 
                        to={link.href} 
                        className="flex-grow text-lg font-serif font-bold text-nomad-black py-3"
                        onClick={() => !link.subItems && setMobileMenuOpen(false)}
                    >
                        {link.label}
                    </Link>
                 </div>
                 
                 {/* Mobile Submenu - simplified flat list for better UX */}
                 {link.subItems && (
                   <div className="pl-4 space-y-4 mb-4 mt-1">
                      {link.subItems.map(sub => (
                        <div key={sub.title}>
                          <h4 className="text-[10px] font-bold text-nomad-gold uppercase mb-2 tracking-widest">{sub.title}</h4>
                          <ul className="space-y-2 pl-2 border-l border-gray-200">
                            {sub.items.map(item => (
                              <li key={item}>
                                <Link 
                                  to={`/shop?category=${encodeURIComponent(sub.title)}&subcategory=${encodeURIComponent(item)}`} 
                                  className="text-sm text-gray-600 block py-1 hover:text-black transition-colors"
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
          <div className="p-6 bg-gray-50 border-t border-gray-100">
             <Link to="/login" className="flex items-center space-x-3 text-sm font-bold uppercase tracking-wider text-gray-600 mb-4 hover:text-black" onClick={() => setMobileMenuOpen(false)}>
               <User size={18} /> <span>Sign In / Register</span>
             </Link>
             <div className="flex items-center space-x-3 text-sm font-medium text-gray-500">
               <Phone size={18} /> <span>+92 300 123 4567</span>
             </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;