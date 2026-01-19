import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ShoppingBag, ArrowRight, Trash, Plus, Minus, CheckCircle, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const { Link } = ReactRouterDOM;

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, createOrder, currentUser, products } = useStore();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      address: ''
  });

  // Pre-fill form with user data if available
  useEffect(() => {
      if (currentUser) {
          setFormData({
              name: currentUser.name || '',
              email: currentUser.email || '',
              phone: currentUser.phone || '',
              address: `${currentUser.address || ''} ${currentUser.city || ''}`.trim()
          });
      }
  }, [currentUser]);

  const recommendations = products.filter(p => p.isFeatured).slice(0, 3);

  const handleCheckout = async (e: React.FormEvent) => {
      e.preventDefault();
      if (cart.length === 0) return;

      const orderId = await createOrder({
          customerName: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          total: 0, // Prices negotiated
          items: cart.map(item => ({
              productId: item.id,
              productTitle: item.title,
              quantity: item.quantity,
              price: 0
          }))
      });

      // Send WhatsApp
      const itemsList = cart.map(i => `${i.quantity}x ${i.title}`).join('%0A');
      const waMsg = `Hi, I would like to inquire about an order:%0AOrder ID: ${orderId}%0A%0AItems:%0A${itemsList}%0A%0ACustomer: ${formData.name}%0AAddress: ${formData.address}`;
      window.open(`https://wa.me/923104811011?text=${waMsg}`, '_blank');

      clearCart();
      setCheckoutStep('success');
  };

  if (checkoutStep === 'success') {
      return (
          <div className="min-h-screen bg-nomad-paper pt-40 pb-20 flex flex-col items-center justify-center text-center px-6">
              <CheckCircle size={64} className="text-green-600 mb-6" />
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Inquiry Sent Successfully!</h1>
              <p className="text-gray-500 mb-8 max-w-md">We have opened a WhatsApp chat with your order details. Our team will confirm prices and availability shortly.</p>
              <Link to="/shop" className="bg-nomad-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-nomad-gold transition-colors">Continue Browsing</Link>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-nomad-paper pt-28 md:pt-32 pb-20 animate-fade-in">
      <div className="container mx-auto px-6 md:px-12">
        
        {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center fade-up py-20">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8 relative">
                    <ShoppingBag size={32} className="text-gray-400" strokeWidth={1.5} />
                    <div className="absolute top-0 right-0 w-8 h-8 bg-nomad-gold rounded-full flex items-center justify-center text-white text-xs font-bold">0</div>
                </div>
                <h1 className="text-3xl md:text-6xl font-serif font-medium mb-6 text-nomad-black">Your bag is empty</h1>
                <p className="text-lg text-gray-500 mb-10 font-light max-w-md">
                    Looks like you haven't added any items yet.
                </p>
                <Link to="/shop" className="inline-block bg-nomad-black text-white px-12 py-5 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-nomad-gold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                    Start Shopping
                </Link>
            </div>
        ) : (
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items */}
                <div className="w-full lg:w-2/3">
                    <h1 className="text-3xl font-serif font-bold mb-8">Quote Request ({cart.length})</h1>
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
                        {cart.map(item => (
                            <div key={item.id} className="flex flex-col sm:flex-row gap-6 items-start sm:items-center border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <img src={item.image} alt={item.title} className="w-24 h-24 rounded-xl object-cover bg-gray-50" />
                                <div className="flex-grow w-full">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-nomad-black text-lg line-clamp-1 pr-4">{item.title}</h3>
                                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 shrink-0"><Trash size={18} /></button>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-1">{item.subtitle}</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4 bg-gray-50 rounded-lg px-3 py-1">
                                            <button onClick={() => updateCartQuantity(item.id, -1)} className="p-1 hover:text-nomad-gold"><Minus size={14} /></button>
                                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateCartQuantity(item.id, 1)} className="p-1 hover:text-nomad-gold"><Plus size={14} /></button>
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-green-600">Price on Request</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Checkout Sidebar */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 sticky top-32">
                        <h3 className="font-bold text-xl mb-6 font-serif">Inquiry Summary</h3>
                        <div className="space-y-4 mb-6 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Items</span>
                                <span>{cart.reduce((acc, i) => acc + i.quantity, 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>TBD</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-nomad-black border-t border-gray-100 pt-4">
                                <span>Total</span>
                                <span>--</span>
                            </div>
                            <p className="text-xs text-gray-400 italic">Final pricing and shipping will be confirmed via WhatsApp.</p>
                        </div>

                        {checkoutStep === 'cart' ? (
                            <button 
                                onClick={() => setCheckoutStep('details')}
                                className="w-full bg-nomad-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-nomad-gold transition-colors"
                            >
                                Proceed to Inquiry
                            </button>
                        ) : (
                            <form onSubmit={handleCheckout} className="space-y-4 animate-fade-in">
                                <h4 className="font-bold text-sm uppercase text-gray-400 mb-2">Your Details</h4>
                                <input 
                                    required 
                                    placeholder="Full Name" 
                                    className="w-full border p-3 rounded-xl text-sm"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                                <input 
                                    required 
                                    type="email"
                                    placeholder="Email" 
                                    className="w-full border p-3 rounded-xl text-sm"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                                <input 
                                    required 
                                    type="tel"
                                    placeholder="Phone Number" 
                                    className="w-full border p-3 rounded-xl text-sm"
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                />
                                <textarea 
                                    required 
                                    placeholder="Delivery Address / City" 
                                    className="w-full border p-3 rounded-xl text-sm"
                                    rows={2}
                                    value={formData.address}
                                    onChange={e => setFormData({...formData, address: e.target.value})}
                                />
                                <button 
                                    type="submit"
                                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                                >
                                    <MessageCircle size={18} />
                                    Send via WhatsApp
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setCheckoutStep('cart')}
                                    className="w-full text-xs text-gray-500 hover:text-black underline"
                                >
                                    Back to Items
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Recommendations */}
        <div className="border-t border-gray-200 pt-16 md:pt-20 mt-16 md:mt-20 fade-up">
            <div className="flex justify-between items-end mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-serif font-bold">You Might Also Like</h2>
            <Link to="/shop" className="hidden md:flex items-center text-xs font-bold uppercase tracking-widest hover:text-nomad-gold transition-colors pb-1">
                View All <ArrowRight size={14} className="ml-2" />
            </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {recommendations.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;