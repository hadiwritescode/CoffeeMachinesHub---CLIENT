
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, BlogPost, Order, User, SiteContent, NavCategory, Testimonial, Message, CartItem } from '../types';
import { BRAND_LOGOS, INITIAL_CATEGORIES, FAQS } from '../constants';
import { supabase } from '../supabase';
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
  
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [dataLoaded, setDataLoaded] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  
  const loading = !dataLoaded || !authLoaded;

  useEffect(() => {
    if (!currentUser) {
        try {
            const saved = localStorage.getItem('cmh_cart');
            if (saved) setCart(JSON.parse(saved));
        } catch (e) {
            console.error("Cart init error", e);
        }
    }
  }, [currentUser === null]);

  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            const [
                { data: pData },
                { data: bData },
                { data: tData },
                { data: mData },
                { data: oData },
                { data: cData }
            ] = await Promise.all([
                supabase.from('products').select('*'),
                supabase.from('blogs').select('*'),
                supabase.from('testimonials').select('*'),
                supabase.from('messages').select('*'),
                supabase.from('orders').select('*').order('date', { ascending: false }),
                supabase.from('content').select('*')
            ]);
            
            if (pData) setProducts(pData as Product[]);
            if (bData) setBlogPosts(bData as BlogPost[]);
            if (tData) setTestimonials(tData as Testimonial[]);
            if (mData) setMessages(mData as Message[]);
            if (oData) setOrders(oData as Order[]);
            
            if (cData) {
                const newContent: any = { ...defaultSiteContent };
                cData.forEach(doc => {
                    const key = doc.id;
                    const data = doc.data;
                    if (key === 'navigation') {
                        if (data.categories) setCategoriesState(data.categories);
                    } else {
                        newContent[key] = { ...newContent[key], ...data };
                    }
                });
                setSiteContent(newContent);
            }
        } catch (err) {
            console.error("Fetch Initial Data Error:", err);
        } finally {
            setDataLoaded(true);
        }
    };
    
    fetchInitialData();

    const channel = supabase.channel('public_db_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
            const doc = payload.new as Product;
            if (payload.eventType === 'INSERT') setProducts(prev => [...prev, doc]);
            if (payload.eventType === 'UPDATE') setProducts(prev => prev.map(p => p.id === doc.id ? doc : p));
            if (payload.eventType === 'DELETE') setProducts(prev => prev.filter(p => p.id !== payload.old.id));
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, payload => {
            const doc = payload.new as BlogPost;
            if (payload.eventType === 'INSERT') setBlogPosts(prev => [...prev, doc]);
            if (payload.eventType === 'UPDATE') setBlogPosts(prev => prev.map(p => p.id === doc.id ? doc : p));
            if (payload.eventType === 'DELETE') setBlogPosts(prev => prev.filter(p => p.id !== payload.old.id));
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, payload => {
            const doc = payload.new as Testimonial;
            if (payload.eventType === 'INSERT') setTestimonials(prev => [...prev, doc]);
            if (payload.eventType === 'UPDATE') setTestimonials(prev => prev.map(p => p.id === doc.id ? doc : p));
            if (payload.eventType === 'DELETE') setTestimonials(prev => prev.filter(p => p.id !== payload.old.id));
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => {
            const doc = payload.new as Message;
            if (payload.eventType === 'INSERT') setMessages(prev => [...prev, doc]);
            if (payload.eventType === 'UPDATE') setMessages(prev => prev.map(p => p.id === doc.id ? doc : p));
            if (payload.eventType === 'DELETE') setMessages(prev => prev.filter(p => p.id !== payload.old.id));
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
            const doc = payload.new as Order;
            if (payload.eventType === 'INSERT') setOrders(prev => [doc, ...prev]);
            if (payload.eventType === 'UPDATE') setOrders(prev => prev.map(p => p.id === doc.id ? doc : p));
            if (payload.eventType === 'DELETE') setOrders(prev => prev.filter(p => p.id !== payload.old.id));
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'content' }, payload => {
            if (payload.eventType === 'DELETE') return;
            const key = payload.new.id;
            const data = payload.new.data;
            if (key === 'navigation') {
                if (data.categories) setCategoriesState(data.categories);
            } else {
                setSiteContent(prev => ({ ...prev, [key]: { ...prev[key as keyof SiteContent], ...data } }));
            }
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    
    // Safety timer to prevent infinite loading
    const safetyTimer = setTimeout(() => {
        if (mounted) {
            setDataLoaded(true);
            setAuthLoaded(true);
        }
    }, 6000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
            try {
                const { data: userData, error } = await supabase.from('users').select('*').eq('id', session.user.id).single();
                
                if (userData && !error) {
                    if (mounted) {
                        setCurrentUser({ ...userData } as User);
                        if (userData.cart && Array.isArray(userData.cart)) setCart(userData.cart);
                    }
                } else if (!error || error.code === 'PGRST116') {
                    const newUser: User = {
                        id: session.user.id,
                        email: session.user.email || '',
                        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                        role: 'customer',
                        wishlist: [],
                        cart: []
                    };
                    await supabase.from('users').upsert(newUser);
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
        if (mounted) setAuthLoaded(true);
    });

    return () => {
        mounted = false;
        clearTimeout(safetyTimer);
        subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
       supabase.from('users').update({ cart }).eq('id', currentUser.id).then(({error}) => {
           if (error) console.error("Cart save error", error);
       });
    } else {
       localStorage.setItem('cmh_cart', JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  const wrapDbOp = async (op: Promise<any>, successMsg?: string) => {
      try {
          const { error } = await op;
          if (error) throw error;
          if (successMsg) showToast(successMsg);
      } catch (err: any) {
          console.error("DB Error:", err);
          showToast(err.message || "Operation failed", "error");
          throw err;
      }
  };

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
      const { data, error } = await supabase.auth.signInWithPassword({ email: e, password: p });
      if (error) throw error;
      if (data.user) {
          const { data: userData } = await supabase.from('users').select('*').eq('id', data.user.id).single();
          if (userData) {
              setCurrentUser(userData as User);
              if (userData.cart) setCart(userData.cart);
          }
      }
      showToast("Welcome back!");
  };
  
  const logout = async () => { 
      await supabase.auth.signOut();
      setCurrentUser(null);
      setCart([]); 
      showToast("Logged out"); 
  };

  const register = async (e: string, p: string, n: string) => {
    const { data: { user }, error } = await supabase.auth.signUp({ 
        email: e, 
        password: p,
        options: { data: { full_name: n } }
    });
    if (error) throw error;
    if (user) {
        const u: User = { id: user.id, name: n, email: e, role: 'customer', wishlist: [], cart: [] };
        await supabase.from('users').upsert(u);
        setCurrentUser(u); 
    }
  };

  const uploadFile = async (f: File, bucket: string) => {
    try {
        const safeName = `${Date.now()}_${f.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const { data, error } = await supabase.storage.from(bucket).upload(safeName, f);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        return urlData.publicUrl;
    } catch (err: any) {
        console.error("Upload Error:", err);
        showToast(`Upload failed: ${err.message}`, 'error');
        throw err;
    }
  };

  const createOrder = async (o: any) => {
    const id = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newOrder = { 
        ...o, 
        id, 
        userId: o.userId || currentUser?.id || 'guest',
        customerName: o.customerName || currentUser?.name || 'Guest',
        date: new Date().toLocaleDateString(), 
        status: 'Processing' 
    };
    await wrapDbOp(supabase.from('orders').insert(newOrder));
    return id;
  };

  const updateOrderStatus = async (id: string, s: any) => {
      await wrapDbOp(supabase.from('orders').update({ status: s }).eq('id', id), "Order updated");
  };

  const addMessage = async (m: any) => {
      const id = Date.now().toString();
      const newMsg = { ...m, id, date: new Date().toLocaleDateString(), read: false };
      await wrapDbOp(supabase.from('messages').insert(newMsg));
  };

  const markMessageRead = async (id: string, status: boolean) => {
      await wrapDbOp(supabase.from('messages').update({ read: !status }).eq('id', id));
  };

  const deleteMessage = async (id: string) => {
      await wrapDbOp(supabase.from('messages').delete().eq('id', id), "Message deleted");
  };
  
  const toggleWishlist = async (id: string) => {
    if (!currentUser) {
        showToast("Please login to save favorites", "info");
        return;
    }
    const isIn = currentUser.wishlist.includes(id);
    const next = isIn ? currentUser.wishlist.filter(x => x !== id) : [...currentUser.wishlist, id];
    setCurrentUser({ ...currentUser, wishlist: next });
    await supabase.from('users').update({ wishlist: next }).eq('id', currentUser.id);
  };
  
  const updateUserProfile = async (d: any) => { 
      if (currentUser) {
          setCurrentUser({...currentUser, ...d});
          await wrapDbOp(supabase.from('users').update(d).eq('id', currentUser.id), "Profile updated");
      }
  };
  
  const updateSiteContent = async (s: keyof SiteContent, d: any) => {
      setSiteContent(prev => ({ ...prev, [s]: d })); 
      await wrapDbOp(supabase.from('content').upsert({ id: s, data: d }), "Content saved");
  };

  const setCategories = async (c: NavCategory[]) => {
      setCategoriesState(c); 
      await wrapDbOp(supabase.from('content').upsert({ id: 'navigation', data: { categories: c } }), "Categories updated");
  };

  const addProduct = async (p: Product) => {
      await wrapDbOp(supabase.from('products').insert(p), "Product saved");
  };

  const updateProduct = async (p: Product) => {
      await wrapDbOp(supabase.from('products').update(p).eq('id', p.id), "Product updated");
  };

  const removeProduct = async (id: string) => {
      await wrapDbOp(supabase.from('products').delete().eq('id', id), "Product deleted");
  };

  const addBlogPost = async (b: BlogPost) => {
      await wrapDbOp(supabase.from('blogs').insert(b), "Blog post saved");
  };

  const updateBlogPost = async (b: BlogPost) => {
      await wrapDbOp(supabase.from('blogs').update(b).eq('id', b.id), "Blog post updated");
  };

  const removeBlogPost = async (id: string) => {
      await wrapDbOp(supabase.from('blogs').delete().eq('id', id), "Blog post deleted");
  };
  
  const addTestimonial = async (t: Testimonial) => {
      await wrapDbOp(supabase.from('testimonials').insert(t));
  };

  const updateTestimonial = async (t: Testimonial) => {
      await wrapDbOp(supabase.from('testimonials').update(t).eq('id', t.id), "Testimonial updated");
  };

  const removeTestimonial = async (id: string) => {
      await wrapDbOp(supabase.from('testimonials').delete().eq('id', id));
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
