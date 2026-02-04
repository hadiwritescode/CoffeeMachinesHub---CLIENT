
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, BlogPost, Order, User, SiteContent, NavCategory, Testimonial, Message, CartItem } from '../types';
import { BRAND_LOGOS, INITIAL_CATEGORIES, FAQS } from '../constants';
import { auth, db, storage } from '../firebase';
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
  uploadFile: (f: File, bucket: string) => Promise<string>;
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

  // --- Real-time Listeners (Firestore) ---
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    // Products
    unsubs.push(db.collection('products').onSnapshot(snap => {
        setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    }));

    // Blogs
    unsubs.push(db.collection('blogs').onSnapshot(snap => {
        setBlogPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
    }));

    // Testimonials
    unsubs.push(db.collection('testimonials').onSnapshot(snap => {
        setTestimonials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
    }));

    // Messages
    unsubs.push(db.collection('messages').onSnapshot(snap => {
        setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    }));

    // Orders
    unsubs.push(db.collection('orders').orderBy('date', 'desc').onSnapshot(snap => {
        setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    }));

    // Content (Flattened documents to SiteContent object)
    unsubs.push(db.collection('content').onSnapshot(snap => {
        const newContent: any = { ...defaultSiteContent };
        snap.docs.forEach(doc => {
            const key = doc.id;
            const data = doc.data();
            // Special handler for navigation which is stored in a doc 'navigation' with field 'categories'
            if (key === 'navigation') {
                if (data.categories) setCategoriesState(data.categories);
            } else {
                // For other content (hero, home, about, etc.), merge data
                newContent[key] = { ...newContent[key], ...data };
            }
        });
        setSiteContent(newContent);
    }));

    return () => unsubs.forEach(u => u());
  }, []);

  // --- Auth & User Profile ---
  useEffect(() => {
    let mounted = true;
    const safetyTimer = setTimeout(() => {
        if (mounted) setLoading(false);
    }, 4000);

    const unsubAuth = auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                // Fetch user profile from 'users' collection
                const userDoc = await db.collection('users').doc(user.uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data() as User;
                    if (mounted) {
                        setCurrentUser({ ...userData, id: user.uid });
                        if (userData.cart && Array.isArray(userData.cart)) setCart(userData.cart);
                    }
                } else {
                    // Create new profile if it doesn't exist
                    const newUser: User = {
                        id: user.uid,
                        email: user.email || '',
                        name: user.displayName || user.email?.split('@')[0] || 'User',
                        role: 'customer',
                        wishlist: [],
                        cart: []
                    };
                    await db.collection('users').doc(user.uid).set(newUser);
                    if (mounted) setCurrentUser(newUser);
                }
            } catch (err) {
                console.error("Profile Fetch Error:", err);
            }
        } else {
            if (mounted) {
                setCurrentUser(null);
                setCart([]);
            }
        }
        if (mounted) setLoading(false);
    });

    return () => {
        mounted = false;
        clearTimeout(safetyTimer);
        unsubAuth();
    };
  }, []);

  // --- Cart Persistence ---
  useEffect(() => {
    if (currentUser) {
       // Persist to Firestore
       db.collection('users').doc(currentUser.id).update({ cart }).catch(console.error);
    } else {
       localStorage.setItem('cmh_cart', JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  // --- Helpers ---
  const wrapDbOp = async (op: Promise<any>, successMsg?: string) => {
      try {
          await op;
          if (successMsg) showToast(successMsg);
      } catch (err: any) {
          console.error("DB Error:", err);
          showToast(err.message || "Operation failed", "error");
      }
  };

  // --- Actions ---
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

  const login = async (e: string, p: string) => { 
      try {
        await auth.signInWithEmailAndPassword(e, p);
        showToast("Welcome back!");
      } catch (error: any) {
        throw error;
      }
  };
  
  const logout = async () => { 
      await auth.signOut();
      setCurrentUser(null);
      clearCart(); 
      showToast("Logged out"); 
  };

  const register = async (e: string, p: string, n: string) => {
    const { user } = await auth.createUserWithEmailAndPassword(e, p);
    if (user) {
        // Create profile manually here to ensure name is saved immediately
        const u: User = { id: user.uid, name: n, email: e, role: 'customer', wishlist: [], cart: [] };
        await db.collection('users').doc(user.uid).set(u);
        setCurrentUser(u); 
    }
  };

  const uploadFile = async (f: File, bucket: string) => {
    try {
        const safeName = `${Date.now()}_${f.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = storage.ref(`${bucket}/${safeName}`);
        await storageRef.put(f);
        return await storageRef.getDownloadURL();
    } catch (err: any) {
        console.error("Upload Error:", err);
        showToast(`Upload failed: ${err.message}`, 'error');
        throw err;
    }
  };

  const createOrder = async (o: any) => {
    const id = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newOrder = { ...o, id, date: new Date().toLocaleDateString(), status: 'Processing' };
    
    // Firestore set with specific ID
    try {
        await db.collection('orders').doc(id).set(newOrder);
        setOrders(prev => [newOrder, ...prev]); // Optimistic
        return id;
    } catch(e) {
        showToast("Failed to create order", "error");
        throw e;
    }
  };

  const updateOrderStatus = async (id: string, s: any) => {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: s } : o));
      await wrapDbOp(db.collection('orders').doc(id).update({ status: s }), "Order updated");
  };

  const addMessage = async (m: any) => {
      const id = Date.now().toString();
      const newMsg = { ...m, id, date: new Date().toLocaleDateString(), read: false };
      setMessages(prev => [newMsg, ...prev]);
      await wrapDbOp(db.collection('messages').doc(id).set(newMsg));
  };

  const markMessageRead = async (id: string, status: boolean) => {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: !status } : m));
      await wrapDbOp(db.collection('messages').doc(id).update({ read: !status }));
  };

  const deleteMessage = async (id: string) => {
      setMessages(prev => prev.filter(m => m.id !== id));
      await wrapDbOp(db.collection('messages').doc(id).delete(), "Message deleted");
  };
  
  const toggleWishlist = async (id: string) => {
    if (!currentUser) {
        showToast("Please login to save favorites", "info");
        return;
    }
    const isIn = currentUser.wishlist.includes(id);
    const next = isIn ? currentUser.wishlist.filter(x => x !== id) : [...currentUser.wishlist, id];
    
    setCurrentUser({ ...currentUser, wishlist: next });
    await db.collection('users').doc(currentUser.id).update({ wishlist: next });
  };
  
  const updateUserProfile = async (d: any) => { 
      if (currentUser) {
          const updated = {...currentUser, ...d};
          setCurrentUser(updated);
          await wrapDbOp(db.collection('users').doc(currentUser.id).update(d), "Profile updated");
      }
  };
  
  // --- Admin Actions ---

  const updateSiteContent = async (s: keyof SiteContent, d: any) => {
      setSiteContent(prev => ({ ...prev, [s]: d })); 
      // Use merge true to update fields without overwriting entire doc if other fields exist
      await wrapDbOp(db.collection('content').doc(s).set(d, { merge: true }), "Content saved");
  };

  const setCategories = async (c: NavCategory[]) => {
      setCategoriesState(c); 
      await wrapDbOp(db.collection('content').doc('navigation').set({ categories: c }), "Categories updated");
  };

  const addProduct = async (p: Product) => {
      setProducts(prev => {
          const exists = prev.find(x => x.id === p.id);
          if (exists) return prev.map(x => x.id === p.id ? p : x);
          return [...prev, p];
      });
      await wrapDbOp(db.collection('products').doc(p.id).set(p), "Product saved");
  };

  const updateProduct = async (p: Product) => {
      setProducts(prev => prev.map(x => x.id === p.id ? p : x));
      await wrapDbOp(db.collection('products').doc(p.id).set(p, { merge: true }), "Product updated");
  };

  const removeProduct = async (id: string) => {
      setProducts(prev => prev.filter(x => x.id !== id));
      await wrapDbOp(db.collection('products').doc(id).delete(), "Product deleted");
  };

  const addBlogPost = async (b: BlogPost) => {
      setBlogPosts(prev => [...prev, b]);
      await wrapDbOp(db.collection('blogs').doc(b.id).set(b), "Blog post saved");
  };

  const updateBlogPost = async (b: BlogPost) => {
      setBlogPosts(prev => prev.map(x => x.id === b.id ? b : x));
      await wrapDbOp(db.collection('blogs').doc(b.id).set(b, { merge: true }), "Blog post updated");
  };

  const removeBlogPost = async (id: string) => {
      setBlogPosts(prev => prev.filter(x => x.id !== id));
      await wrapDbOp(db.collection('blogs').doc(id).delete(), "Blog post deleted");
  };
  
  const addTestimonial = async (t: Testimonial) => {
      setTestimonials(prev => [...prev, t]);
      await wrapDbOp(db.collection('testimonials').doc(t.id).set(t));
  };

  const updateTestimonial = async (t: Testimonial) => {
      setTestimonials(prev => prev.map(x => x.id === t.id ? t : x));
      await wrapDbOp(db.collection('testimonials').doc(t.id).set(t, { merge: true }), "Testimonial updated");
  };

  const removeTestimonial = async (id: string) => {
      setTestimonials(prev => prev.filter(x => x.id !== id));
      await wrapDbOp(db.collection('testimonials').doc(id).delete());
  };

  return (
    <StoreContext.Provider value={{
      products, categories, siteContent, currentUser, loading, cart,
      login, register, logout, addToCart, removeFromCart, updateCartQuantity, clearCart,
      createOrder, updateOrderStatus, addMessage, markMessageRead, deleteMessage, toggleWishlist, updateUserProfile, uploadFile,
      updateSiteContent, setCategories, blogPosts, 
      addBlogPost, updateBlogPost, removeBlogPost,
      testimonials, addTestimonial, updateTestimonial, removeTestimonial,
      messages, orders,
      addProduct, updateProduct, removeProduct
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
