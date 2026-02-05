import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ShoppingCart, FileText, Settings, LogOut, Coffee, List, BookOpen, Menu, X, Loader2, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Logo from '../components/Logo';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser, loading } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showExit, setShowExit] = useState(false);

  // Show exit button after 3 seconds if still loading
  useEffect(() => {
      if (loading) {
          const timer = setTimeout(() => setShowExit(true), 3000);
          return () => clearTimeout(timer);
      }
  }, [loading]);

  // Security Gate
  useEffect(() => {
    if (!loading) {
        if (!currentUser) {
            navigate('/admin/login', { replace: true });
        } else if (currentUser.role !== 'admin') {
            navigate('/profile', { replace: true });
        }
    }
  }, [currentUser, loading, navigate]);

  // Loading State (Checking Auth)
  if (loading) {
      return (
          <div className="fixed inset-0 z-50 bg-nomad-black flex flex-col items-center justify-center text-white">
              <Loader2 size={48} className="animate-spin text-nomad-gold mb-4" />
              <p className="font-bold uppercase tracking-widest text-xs mb-6">Authenticating...</p>
              
              {/* Escape hatch for infinite loading bugs */}
              {showExit && (
                  <button 
                    onClick={async () => { 
                        await logout(); 
                        window.location.href = '/admin/login'; 
                    }}
                    className="mt-8 text-white/50 hover:text-white text-[10px] uppercase tracking-widest underline transition-colors animate-fade-in"
                  >
                    Taking too long? Click here to Reset
                  </button>
              )}
          </div>
      );
  }

  // Redirecting State (Auth checked, but invalid for admin)
  if (!currentUser || currentUser.role !== 'admin') {
      return (
          <div className="fixed inset-0 z-50 bg-nomad-black flex flex-col items-center justify-center text-white">
              <Loader2 size={48} className="animate-spin text-nomad-gold mb-4" />
              <p className="font-bold uppercase tracking-widest text-xs mb-6">Redirecting...</p>
              
              <button 
                onClick={async () => { 
                    await logout(); 
                    window.location.href = '/admin/login'; 
                }}
                className="text-white/30 hover:text-white text-[10px] uppercase tracking-widest underline transition-colors"
              >
                Click here if stuck
              </button>
          </div>
      );
  }

  const links = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Coffee },
    { label: 'Categories', path: '/admin/categories', icon: List },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { label: 'Blogs', path: '/admin/blogs', icon: BookOpen },
    { label: 'Content', path: '/admin/content', icon: FileText },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans relative z-0">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-nomad-black text-white z-[70] px-6 py-4 flex justify-between items-center shadow-md">
        <Logo className="h-8 w-auto text-nomad-gold" />
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-nomad-black text-white flex flex-col fixed h-full z-[80] md:z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-8 flex flex-col items-center border-b border-gray-700 hidden md:flex">
          <Logo className="h-12 w-auto text-nomad-gold mb-4" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Admin Panel</span>
        </div>
        
        <div className="md:hidden p-6 border-b border-gray-700 pt-20">
           <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Navigation</span>
        </div>
        
        <nav className="flex-grow py-4 px-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path} 
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-200 ${isActive ? 'bg-nomad-gold text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                <Icon size={20} />
                <span className="font-bold text-sm tracking-wide">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
           <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center space-x-3 px-6 py-4 text-red-400 hover:text-red-300 transition-colors cursor-pointer text-left">
              <LogOut size={20} />
              <span className="font-bold text-sm tracking-wide">Log Out</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 pt-24 md:p-10 md:pt-10 md:ml-64 transition-all duration-300 overflow-x-hidden bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;