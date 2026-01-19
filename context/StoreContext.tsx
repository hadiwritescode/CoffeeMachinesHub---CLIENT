import React, { createContext, useContext, useState } from 'react';
import { Product, BlogPost, Order, User, SiteContent, NavCategory, Testimonial, Message } from '../types';
import { ALL_PRODUCTS, BLOG_POSTS, TESTIMONIALS, BRAND_LOGOS, NAVIGATION_LINKS } from '../constants';

interface StoreContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  
  categories: NavCategory[];
  setCategories: React.Dispatch<React.SetStateAction<NavCategory[]>>;
  
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  
  messages: Message[];
  addMessage: (msg: Omit<Message, 'id' | 'date' | 'read'>) => void;
  
  siteContent: SiteContent;
  updateSiteContent: (section: keyof SiteContent, data: any) => void;
  
  currentUser: User | null;
  login: (email: string) => void;
  logout: () => void;
  toggleWishlist: (productId: string) => void;
  addToCart: (product: Product) => void;
  cart: Product[];
}

const defaultSiteContent: SiteContent = {
  hero: {
    title: "Coffee Machines Hub",
    subtitle: "Premium Coffee Gear & Beans.",
    videoUrl: "https://videos.pexels.com/video-files/3053787/3053787-uhd_2560_1440_25fps.mp4",
    buttonText: "Shop Now"
  },
  home: {
    brands: BRAND_LOGOS
  },
  services: {
    heroTitle: "Elevate Your \n Coffee Business",
    heroSubtitle: "Comprehensive consulting, wholesale, and training services designed to help cafes and restaurants serve world-class coffee.",
    heroImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1600",
    section1Title: "Wholesale Partner",
    section1Text: "We don't just supply beans; we supply consistency. Our wholesale partners receive priority access to our seasonal roasts, custom blend development, and volume pricing.",
    section1Image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
    section2Title: "Barista Training",
    section2Text: "Empower your staff with the knowledge they need to pull the perfect shot. Our training curriculum covers everything from green bean sourcing to latte art mastery.",
    section2Image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=800"
  },
  about: {
    heroTitle: "The Pursuit of \n Excellence",
    heroSubtitle: "\"We believe that every cup of coffee tells a story—of the land it grew on, the farmers who tended it, and the hands that brewed it.\"",
    heroImage: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=1600",
    storyTitle: "Our Origins",
    storyText: "Coffee Machines Hub began as a small passion project in a garage, tinkering with espresso machines and roasting samples on a popcorn popper. Our obsession with the mechanics of extraction led us to curate a collection of the world's finest brewing equipment."
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

// Initial Data extraction from constants
const initialCategories = NAVIGATION_LINKS.find(l => l.label === 'SHOP')?.subItems || [];
const initialTestimonials = TESTIMONIALS.map((t, i) => ({ ...t, id: `test-${i}` }));

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(ALL_PRODUCTS);
  const [categories, setCategories] = useState<NavCategory[]>(initialCategories);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '#ORD-7782',
      date: 'Oct 24, 2025',
      customerName: 'Ali Khan',
      email: 'ali@example.com',
      total: 18500,
      status: 'Delivered',
      items: [{ productId: 'aeropress-clear', productTitle: 'Aeropress Clear', quantity: 1, price: 18500 }]
    }
  ]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [messages, setMessages] = useState<Message[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Product[]>([]);

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const updateSiteContent = (section: keyof SiteContent, data: any) => {
    setSiteContent(prev => ({ ...prev, [section]: data }));
  };

  const addMessage = (msg: Omit<Message, 'id' | 'date' | 'read'>) => {
    const newMessage: Message = {
      ...msg,
      id: `msg-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      read: false
    };
    setMessages(prev => [newMessage, ...prev]);
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
      categories, setCategories,
      orders, updateOrderStatus,
      blogPosts, setBlogPosts,
      testimonials, setTestimonials,
      messages, addMessage,
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