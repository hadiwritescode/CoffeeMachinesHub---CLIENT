
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, BlogPost, Order, User, SiteContent, NavCategory, Testimonial, Message, CartItem } from '../types';
import { BRAND_LOGOS, INITIAL_CATEGORIES, FAQS } from '../constants';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import { db, auth, storage } from '../firebase';
import { useToast } from './ToastContext';

interface StoreContextType {
  products: Product[];
  categories: NavCategory[];
  siteContent: SiteContent;
  currentUser: User | null;
  loading: boolean;
  cart: CartItem[];
  login: (e: string, p: string) => Promise<void>;
  register: (e: string, p: string, n: string) => Promise<void>;
  logout: () => Promise<void>;
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, d: number) => void;
  clearCart: () => void;
  createOrder: (o: any) => Promise<string>;
  updateOrderStatus: (id: string, s: any) => Promise<void>;
  addMessage: (m: any) => Promise<void>;
  markMessageRead: (id: string, status: boolean) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  toggleWishlist: (id: string) => Promise<void>;
  updateUserProfile: (d: any) => Promise<void>;
  uploadFile: (f: File, p: string) => Promise<string>;
  updateSiteContent: (s: keyof SiteContent, d: any) => Promise<void>;
  setCategories: (c: NavCategory[]) => Promise<void>;
  blogPosts: BlogPost[];
  addBlogPost: (b: BlogPost) => Promise<void>;
  updateBlogPost: (b: BlogPost) => Promise<void>;
  removeBlogPost: (id: string) => Promise<void>;
  testimonials: Testimonial[];
  addTestimonial: (t: Testimonial) => Promise<void>;
  updateTestimonial: (t: Testimonial) => Promise<void>;
  removeTestimonial: (id: string) => Promise<void>;
  messages: Message[];
  orders: Order[];
  addProduct: (p: Product) => Promise<void>;
  updateProduct: (p: Product) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
}

const defaultSiteContent: SiteContent = {
  hero: { 
    title: "Coffee Machines Hub", 
    subtitle: "Premium Coffee Gear & Beans.", 
    videoUrl: "https://videos.pexels.com/video-files/3053787/3053787-uhd_2560_1440_25fps.mp4", 
    buttonText: "Shop Now" 
  },
  home: { 
    brands: BRAND_LOGOS, 
    collectionTitle: "Collections", 
    collectionSubtitle: "Curated Excellence", 
    featuredTitle: "Top Rated Machines", 
    favoritesTitle: "Essentials", 
    favoritesSubtitle: "Curated Favorites", 
    partnersText: "Trusted Partners & Global Brands",
    marqueeText: "Free Shipping on Orders Over Rs. 5000 • Direct Import from Italy",
    trendingTags: ['Espresso', 'Grinder', 'Roast', 'Accessories']
  },
  shop: { 
    heroTitle: "All Products", 
    heroSubtitle: "Explore our complete collection." 
  },
  services: { 
    heroTitle: "Elevate Your \n Coffee Business", 
    heroSubtitle: "Comprehensive consulting and equipment solutions for cafes and homes.", 
    heroImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1600", 
    section1Title: "Wholesale Partner", 
    section1Text: "Consistency is key to keeping your customers coming back. We offer tailored wholesale programs.", 
    section1Image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
    section1List: ["Custom Roasting Profiles", "Volume Discounts", "Reliable Logistics"],
    section2Title: "Barista Training", 
    section2Text: "Empower your staff with the knowledge and skills to pull the perfect shot every time.", 
    section2Image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=800", 
    section3Title: "Tech Support", 
    section3Text: "Minimizing downtime is crucial. Our certified technicians are just a call away.", 
    section3Image: "https://images.unsplash.com/photo-1522923985141-860e65383563?auto=format&fit=crop&q=80&w=800" 
  },
  about: { 
    heroTitle: "The Pursuit of \n Excellence", 
    heroSubtitle: "Every cup tells a story. Ours began with a simple love for the craft.", 
    heroImage: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=1600", 
    storyTitle: "Our Origins", 
    storyText: "Started as a passion project, Coffee Machines Hub has grown into a premier destination for coffee enthusiasts.", 
    values: [{ title: "Quality", text: "We never compromise on the quality of our machines or beans." }] 
  },
  contact: { 
    address: "Lahore, Pakistan", 
    email: "info@coffeemachineshub.com", 
    phone: "03104811010", 
    faqs: FAQS 
  },
  footer: { 
    description: "Purveyors of the finest coffee gear and sustainably sourced beans.",
    companyLinks: [
      { label: "Our Story", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Journal", href: "/blogs" },
      { label: "Contact", href: "/contact" }
    ],
    legalLinks: [
      { label: "Shipping Policy", href: "/contact" },
      { label: "Returns & Exchange", href: "/contact" },
      { label: "Privacy Policy", href: "/contact" },
      { label: "Terms of Service", href: "/contact" }
    ]
  },
  socials: { 
    instagram: "https://instagram.com", 
    facebook: "https://facebook.com", 
    youtube: "https://youtube.com", 
    twitter: "https://twitter.com" 
  },
  team: []
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children?: React.ReactNode }) => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategoriesState] = useState<NavCategory[]>(INITIAL_CATEGORIES);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [loading, setLoading] = useState(true);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cmh_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const unsubs = [
      db.collection('products').onSnapshot((s) => setProducts(s.docs.map(d => ({ id: d.id, ...d.data() } as Product)))),
      db.collection('blogs').onSnapshot((s) => setBlogPosts(s.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost)))),
      db.collection('testimonials').onSnapshot((s) => setTestimonials(s.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)))),
      db.collection('messages').onSnapshot((s) => setMessages(s.docs.map(d => ({ id: d.id, ...d.data() } as Message)))),
      db.collection('orders').onSnapshot((s) => setOrders(s.docs.map(d => ({ id: d.id, ...d.data() } as Order)))),
      db.collection('content').doc('navigation').onSnapshot((d) => {
         const data = d.data() as any;
         if (d.exists && data?.categories) {
            setCategoriesState(data.categories);
         }
      }),
      db.collection('content').onSnapshot((s) => {
        setSiteContent(prev => {
          const next = { ...prev };
          s.docs.forEach(d => {
            if (d.id !== 'navigation') {
                const data = d.data();
                (next as any)[d.id] = { ...(next as any)[d.id], ...data };
            }
          });
          return next;
        });
      })
    ];
    return () => unsubs.forEach(u => u());
  }, []);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async user => {
      if (user) {
        try {
          const snap = await db.collection('users').doc(user.uid).get();
          if (snap.exists) {
            const uData = snap.data() as User;
            setCurrentUser({ ...uData, id: user.uid });
            if (uData.cart && Array.isArray(uData.cart)) {
               setCart(uData.cart);
            }
          } else {
             const newUser: User = { 
                id: user.uid, 
                name: user.displayName || 'User', 
                email: user.email || '', 
                role: 'customer', 
                wishlist: [], 
                cart: [] 
             };
             await db.collection('users').doc(user.uid).set(newUser);
             setCurrentUser(newUser);
          }
        } catch (e) {
          console.error("Error fetching user data", e);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (currentUser) {
       db.collection('users').doc(currentUser.id).update({ cart }).catch(() => {});
    } else {
       localStorage.setItem('cmh_cart', JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  const addToCart = (p: Product) => {
    setCart(prev => {
      const ex = prev.find(x => x.id === p.id);
      if (ex) return prev.map(x => x.id === p.id ? { ...x, quantity: x.quantity + 1 } : x);
      return [...prev, { ...p, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(x => x.id !== id));
  const updateCartQuantity = (id: string, d: number) => setCart(prev => prev.map(x => x.id === id ? { ...x, quantity: Math.max(1, x.quantity + d) } : x));
  const clearCart = () => setCart([]);

  const login = async (e: string, p: string) => { await auth.signInWithEmailAndPassword(e, p); showToast("Welcome back!"); };
  const logout = async () => { await auth.signOut(); clearCart(); showToast("Logged out"); };
  const register = async (e: string, p: string, n: string) => {
    const res = await auth.createUserWithEmailAndPassword(e, p);
    if (res.user) {
        const u: User = { id: res.user.uid, name: n, email: e, role: 'customer', wishlist: [], cart: [] };
        await db.collection('users').doc(res.user.uid).set(u);
    }
  };

  const uploadFile = async (f: File, p: string) => {
    const safeName = f.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const sRef = storage.ref(`${p}/${Date.now()}_${safeName}`);
    await sRef.put(f);
    return sRef.getDownloadURL();
  };

  const createOrder = async (o: any) => {
    const id = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    await db.collection('orders').doc(id).set({ ...o, id, date: new Date().toLocaleDateString(), status: 'Processing' });
    return id;
  };

  const updateOrderStatus = async (id: string, s: any) => db.collection('orders').doc(id).update({ status: s });
  
  const addMessage = async (m: any) => { await db.collection('messages').add({ ...m, date: new Date().toLocaleDateString(), read: false }); };
  const markMessageRead = async (id: string, status: boolean) => { await db.collection('messages').doc(id).update({ read: !status }); };
  const deleteMessage = async (id: string) => { await db.collection('messages').doc(id).delete(); };
  
  const toggleWishlist = async (id: string) => {
    if (!currentUser) {
        showToast("Please login to save favorites", "info");
        return;
    }
    const isIn = currentUser.wishlist.includes(id);
    const next = isIn ? currentUser.wishlist.filter(x => x !== id) : [...currentUser.wishlist, id];
    await db.collection('users').doc(currentUser.id).update({ wishlist: next });
    setCurrentUser({ ...currentUser, wishlist: next });
  };
  
  const updateUserProfile = async (d: any) => { if (currentUser) await db.collection('users').doc(currentUser.id).update(d); };
  const updateSiteContent = async (s: keyof SiteContent, d: any) => db.collection('content').doc(s).set(d, { merge: true });
  const setCategories = async (c: NavCategory[]) => db.collection('content').doc('navigation').set({ categories: c });

  return (
    <StoreContext.Provider value={{
      products, categories, siteContent, currentUser, loading, cart,
      login, register, logout, addToCart, removeFromCart, updateCartQuantity, clearCart,
      createOrder, updateOrderStatus, addMessage, markMessageRead, deleteMessage, toggleWishlist, updateUserProfile, uploadFile,
      updateSiteContent, setCategories, blogPosts, 
      addBlogPost: async b => { await db.collection('blogs').doc(b.id).set(b); },
      updateBlogPost: async b => { await db.collection('blogs').doc(b.id).update({ ...b }); },
      removeBlogPost: async id => { await db.collection('blogs').doc(id).delete(); },
      testimonials, 
      addTestimonial: async (t: Testimonial) => { await db.collection('testimonials').add(t); },
      updateTestimonial: async t => { await db.collection('testimonials').doc(t.id).update({ ...t }); },
      removeTestimonial: async id => { await db.collection('testimonials').doc(id).delete(); },
      messages, orders,
      addProduct: async (p: Product) => { await db.collection('products').doc(p.id).set(p); },
      updateProduct: async (p: Product) => { await db.collection('products').doc(p.id).update({ ...p }); },
      removeProduct: async (id: string) => { await db.collection('products').doc(id).delete(); }
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const c = useContext(StoreContext);
  if (!c) throw new Error("useStore error");
  return c;
};
