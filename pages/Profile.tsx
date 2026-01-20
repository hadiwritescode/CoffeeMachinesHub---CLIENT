import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Navigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { User, Package, Heart, Settings, MapPin, Phone, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser, orders, products, logout, updateUserProfile } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'settings'>('orders');
  
  // Settings Form State
  const [form, setForm] = useState({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      address: currentUser?.address || '',
      city: currentUser?.city || ''
  });

  if (!currentUser) return <Navigate to="/login" />;

  // Filter orders for current user (matched by email for historical orders, or just generic user linking)
  const myOrders = orders.filter(o => o.email === currentUser.email);
  const wishlistItems = products.filter(p => currentUser.wishlist.includes(p.id));

  const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      await updateUserProfile(form);
      alert('Profile updated successfully!');
  };

  return (
    <div className="pt-40 pb-20 bg-nomad-paper min-h-screen">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
                <span className="text-nomad-gold text-xs font-bold tracking-[0.3em] uppercase mb-2 block">My Account</span>
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-nomad-black mb-2">Hello, {currentUser.name}</h1>
                <p className="text-gray-500">{currentUser.email}</p>
            </div>
            <button 
                onClick={logout} 
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-red-400 hover:text-red-500 border-b border-transparent hover:border-red-200 pb-1 transition-all"
            >
                <LogOut size={16} /> Sign Out
            </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar Tabs */}
            <div className="lg:w-1/4">
                <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 sticky top-32">
                    <nav className="flex flex-col gap-2">
                        <button 
                            onClick={() => setActiveTab('orders')}
                            className={`flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'orders' ? 'bg-nomad-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Package size={18} /> Orders
                        </button>
                        <button 
                            onClick={() => setActiveTab('wishlist')}
                            className={`flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'wishlist' ? 'bg-nomad-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Heart size={18} /> Wishlist
                        </button>
                        <button 
                            onClick={() => setActiveTab('settings')}
                            className={`flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'settings' ? 'bg-nomad-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Settings size={18} /> Settings
                        </button>
                    </nav>
                </div>
            </div>

            {/* Content Area */}
            <div className="lg:w-3/4">
                
                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-2xl font-serif font-bold mb-6">Order History</h2>
                        {myOrders.length === 0 ? (
                            <div className="bg-white p-12 rounded-3xl text-center border border-gray-100">
                                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">No orders found.</p>
                            </div>
                        ) : (
                            myOrders.map(order => (
                                <div key={order.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6 border-b border-gray-50 pb-6">
                                        <div>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Order ID</span>
                                            <span className="font-bold text-lg text-nomad-black">{order.id}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Date</span>
                                            <span className="text-sm font-medium">{order.date}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Status</span>
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'Processing' ? 'bg-orange-100 text-orange-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-4 mb-6">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-700 font-medium">{item.quantity}x {item.productTitle}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Wishlist Tab */}
                {activeTab === 'wishlist' && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-serif font-bold mb-6">My Wishlist</h2>
                        {wishlistItems.length === 0 ? (
                            <div className="bg-white p-12 rounded-3xl text-center border border-gray-100">
                                <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">Your wishlist is empty.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {wishlistItems.map(item => (
                                    <ProductCard key={item.id} product={item} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-serif font-bold mb-6">Account Settings</h2>
                        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input 
                                                className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-nomad-gold/20"
                                                value={form.name}
                                                onChange={e => setForm({...form, name: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input 
                                                className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-nomad-gold/20"
                                                value={form.phone}
                                                onChange={e => setForm({...form, phone: e.target.value})}
                                                placeholder="+92..."
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Delivery Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                                        <textarea 
                                            className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-nomad-gold/20 min-h-[100px]"
                                            value={form.address}
                                            onChange={e => setForm({...form, address: e.target.value})}
                                            placeholder="House #, Street, Area..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">City</label>
                                    <input 
                                        className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-nomad-gold/20"
                                        value={form.city}
                                        onChange={e => setForm({...form, city: e.target.value})}
                                        placeholder="Lahore"
                                    />
                                </div>
                                <div className="pt-4">
                                    <button type="submit" className="bg-nomad-black text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-nomad-gold transition-colors">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;