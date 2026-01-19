import React from 'react';
import { useStore } from '../context/StoreContext';
import { Navigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Profile: React.FC = () => {
  const { currentUser, orders, products, logout } = useStore();

  if (!currentUser) return <Navigate to="/login" />;

  // Filter orders for current user (mocked by email for now)
  const myOrders = orders.filter(o => o.email === currentUser.email || o.customerName === currentUser.name);
  const wishlistItems = products.filter(p => currentUser.wishlist.includes(p.id));

  return (
    <div className="pt-40 pb-20 bg-nomad-paper min-h-screen">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="flex justify-between items-end mb-12">
            <div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-nomad-black mb-2">Hello, {currentUser.name}</h1>
                <p className="text-gray-500">Member since 2026</p>
            </div>
            <button onClick={logout} className="text-sm font-bold uppercase tracking-widest text-red-400 hover:text-red-500 border-b border-red-200">Sign Out</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Orders */}
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-serif font-bold mb-6">Order History</h2>
                <div className="space-y-6">
                    {myOrders.length === 0 ? (
                        <p className="text-gray-500 italic">No orders yet.</p>
                    ) : (
                        myOrders.map(order => (
                            <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-4">
                                    <div>
                                        <span className="font-bold text-nomad-black block">{order.id}</span>
                                        <span className="text-xs text-gray-400">{order.date}</span>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                        order.status === 'Processing' ? 'bg-orange-100 text-orange-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="space-y-2 mb-4">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-gray-600">{item.quantity}x {item.productTitle}</span>
                                            <span className="font-medium">Rs. {item.price.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between pt-4 border-t border-gray-50 font-bold text-nomad-black">
                                    <span>Total</span>
                                    <span>Rs. {order.total.toLocaleString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Column: Wishlist */}
            <div>
                <h2 className="text-2xl font-serif font-bold mb-6">Wishlist</h2>
                <div className="space-y-6">
                    {wishlistItems.length === 0 ? (
                        <p className="text-gray-500 italic">Your wishlist is empty.</p>
                    ) : (
                        wishlistItems.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                                <img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                                <div>
                                    <h4 className="font-bold text-sm">{item.title}</h4>
                                    <p className="text-xs text-gray-500 mb-2">Rs. {item.price.toLocaleString()}</p>
                                    <button className="text-[10px] font-bold uppercase tracking-wider text-nomad-gold">Add to Cart</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;