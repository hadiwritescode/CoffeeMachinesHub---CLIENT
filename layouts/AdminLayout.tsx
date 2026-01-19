import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ShoppingCart, FileText, Settings, LogOut, Coffee } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Logo from '../components/Logo';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { logout } = useStore();

  const links = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Coffee },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Content', path: '/admin/content', icon: FileText },
    { label: 'Blogs', path: '/admin/blogs', icon: Settings }, // Reusing icon for brevity
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-nomad-black text-white flex flex-col fixed h-full z-20">
        <div className="p-8 flex flex-col items-center border-b border-gray-700">
          <Logo className="h-12 w-auto text-nomad-gold mb-4" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Admin Panel</span>
        </div>
        
        <nav className="flex-grow py-8 px-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-200 ${isActive ? 'bg-nomad-gold text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                <Icon size={20} />
                <span className="font-bold text-sm tracking-wide">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
           <Link to="/" onClick={logout} className="flex items-center space-x-3 px-6 py-4 text-red-400 hover:text-red-300 transition-colors cursor-pointer">
              <LogOut size={20} />
              <span className="font-bold text-sm tracking-wide">Log Out</span>
           </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-grow p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;