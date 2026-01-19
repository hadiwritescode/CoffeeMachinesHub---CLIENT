import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, BlogPost, Order, User, SiteContent } from '../types';
import { ALL_PRODUCTS, BLOG_POSTS, FAQS } from '../constants';

interface StoreContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  siteContent: SiteContent;
  updateSiteContent: (section: keyof SiteContent, data: any) => void;
  currentUser: User | null;
  login: (email: string) => void;
  logout: () => void;
  toggleWishlist: (productId: string) => void;
  addToCart: (product: Product) => void; // Placeholder for cart logic
  cart: Product[];
}

const defaultSiteContent: SiteContent = {
  hero: {
    title: "Coffee Machines Hub",
    subtitle: "Premium Coffee Gear & Beans.",
    videoUrl: "https://videos.pexels.com/video-files/3053787/3053787-uhd_2560_1440_25fps.mp4",
    buttonText: "Shop Now"
  },
  contact: {
    address: "G-22, City Star Mall, Model Town Link Road, Lahore, Pakistan",
    email: "Coffeemachineshub@gmail.com",
    phone: "+92 310 481 1011"
  },
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
    twitter: "#"
  },
  team: [
    { name: "Sarah Jenkins", role: "Head Roaster", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" },
    { name: "David Chen", role: "Equipment Specialist", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
    { name: "Elena Rodriguez", role: "Q Grader", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" }
  ]
};

// Mock Orders
const initialOrders: Order[] = [
  {
    id: '#ORD-7782',
    date: 'Oct 24, 2025',
    customerName: 'Ali Khan',
    email: 'ali@example.com',
    total: 18500,
    status: 'Delivered',
    items: [{ productId: 'aeropress-clear', productTitle: 'Aeropress Clear', quantity: 1, price: 18500 }]
  },
  {
    id: '#ORD-7783',
    date: 'Oct 26, 2025',
    customerName: 'Zara Ahmed',
    email: 'zara@example.com',
    total: 4500,
    status: 'Processing',
    items: [{ productId: 'pink-bourbon', productTitle: 'Colombia Pink Bourbon', quantity: 1, price: 4500 }]
  }
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with constants or local storage (omitted for brevity, using constants)
  const [products, setProducts] = useState<Product[]>(ALL_PRODUCTS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Product[]>([]);

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const updateSiteContent = (section: keyof SiteContent, data: any) => {
    setSiteContent(prev => ({ ...prev, [section]: data }));
  };

  const login = (email: string) => {
    const isAdmin = email.toLowerCase().includes('admin');
    setCurrentUser({
      id: 'usr-' + Date.now(),
      name: email.split('@')[0],
      email,
      role: isAdmin ? 'admin' : 'customer',
      wishlist: []
    });
  };

  const logout = () => setCurrentUser(null);

  const toggleWishlist = (productId: string) => {
    if (!currentUser) return;
    const isInWishlist = currentUser.wishlist.includes(productId);
    const newWishlist = isInWishlist 
      ? currentUser.wishlist.filter(id => id !== productId)
      : [...currentUser.wishlist, productId];
    
    setCurrentUser({ ...currentUser, wishlist: newWishlist });
  };

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  return (
    <StoreContext.Provider value={{
      products, setProducts,
      orders, updateOrderStatus,
      blogPosts, setBlogPosts,
      siteContent, updateSiteContent,
      currentUser, login, logout, toggleWishlist,
      addToCart, cart
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};