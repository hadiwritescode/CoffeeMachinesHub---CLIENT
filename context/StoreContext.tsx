
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
  
  const [loading, setLoading] = useState(true);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cmh_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch Initial Data & Subscribe to Realtime Changes
  useEffect(() => {
    const fetchAll = async () => {
        // Products
        const { data: prodData } = await supabase.from('products').select('*');
        if (prodData) setProducts(prodData);

        // Blogs
        const { data: blogData } = await supabase.from('blogs').select('*');
        if (blogData) setBlogPosts(blogData);

        // Testimonials
        const { data: testData } = await supabase.from('testimonials').select('*');
        if (testData) setTestimonials(testData);

        // Messages
        const { data: msgData } = await supabase.from('messages').select('*');
        if (msgData) setMessages(msgData);

        // Orders
        const { data: ordData } = await supabase.from('orders').select('*');
        if (ordData) setOrders(ordData);

        // Content (Map key-value rows to SiteContent object)
        const { data: contentData } = await supabase.from('content').select('*');
        if (contentData) {
            const newContent: any = { ...defaultSiteContent };
            contentData.forEach((row: any) => {
                if (row.key === 'navigation') {
                    if (row.data?.categories) setCategoriesState(row.data.categories);
                } else {
                    newContent[row.key] = { ...newContent[row.key], ...row.data };
                }
            });
            setSiteContent(newContent);
        }
    };

    fetchAll();

    // Subscribe to changes
    const channels = [
        supabase.channel('public:products').on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchAll).subscribe(),
        supabase.channel('public:blogs').on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, fetchAll).subscribe(),
        supabase.channel('public:testimonials').on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, fetchAll).subscribe(),
        supabase.channel('public:messages').on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchAll).subscribe(),
        supabase.channel('public:orders').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchAll).subscribe(),
        supabase.channel('public:content').on('postgres_changes', { event: '*', schema: 'public', table: 'content' }, fetchAll).subscribe(),
    ];

    return () => {
        channels.forEach(c => supabase.removeChannel(c));
    };
  }, []);

  // Auth Listener
  useEffect(() => {
    // Safety timeout to prevent infinite loading
    const safetyTimer = setTimeout(() => setLoading(false), 5000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          // Fetch Profile
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
          if (profile) {
              setCurrentUser(profile);
              if (profile.cart && Array.isArray(profile.cart) && profile.cart.length > 0) {
                 setCart(profile.cart);
              }
          } else {
              // Create Profile if missing (e.g. first login)
              const newUser: User = { 
                  id: session.user.id, 
                  name: session.user.user_metadata?.name || 'User', 
                  email: session.user.email || '', 
                  role: 'customer', 
                  wishlist: [], 
                  cart: [] 
              };
              const { error: insertError } = await supabase.from('profiles').upsert(newUser);
              if (!insertError) setCurrentUser(newUser);
          }
        } else {
          setCurrentUser(null);
        }
      } catch (e) {
        console.error("Auth Listener Error:", e);
        // On error, assume logged out to unblock UI
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
        subscription.unsubscribe();
        clearTimeout(safetyTimer);
    };
  }, []);

  // Sync Cart
  useEffect(() => {
    if (currentUser) {
       supabase.from('profiles').update({ cart }).eq('id', currentUser.id).then();
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

  const login = async (e: string, p: string) => { 
      const { error } = await supabase.auth.signInWithPassword({ email: e, password: p });
      if (error) throw error;
      showToast("Welcome back!"); 
  };
  
  const logout = async () => { 
      await supabase.auth.signOut(); 
      clearCart(); 
      showToast("Logged out"); 
  };

  const register = async (e: string, p: string, n: string) => {
    const { data, error } = await supabase.auth.signUp({ 
        email: e, 
        password: p,
        options: { data: { name: n } } 
    });
    if (error) throw error;
    if (data.user) {
        // Explicitly create profile using Upsert to handle potential race conditions with DB triggers
        const u: User = { id: data.user.id, name: n, email: e, role: 'customer', wishlist: [], cart: [] };
        await supabase.from('profiles').upsert(u);
    }
  };

  const uploadFile = async (f: File, bucket: string) => {
    const safeName = `${Date.now()}_${f.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const { data, error } = await supabase.storage.from(bucket).upload(safeName, f);
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(safeName);
    return publicUrl;
  };

  const createOrder = async (o: any) => {
    const id = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    await supabase.from('orders').insert({ ...o, id, date: new Date().toLocaleDateString(), status: 'Processing' });
    return id;
  };

  const updateOrderStatus = async (id: string, s: any) => { await supabase.from('orders').update({ status: s }).eq('id', id); };
  
  const addMessage = async (m: any) => { await supabase.from('messages').insert({ ...m, date: new Date().toLocaleDateString(), read: false }); };
  const markMessageRead = async (id: string, status: boolean) => { await supabase.from('messages').update({ read: !status }).eq('id', id); };
  const deleteMessage = async (id: string) => { await supabase.from('messages').delete().eq('id', id); };
  
  const toggleWishlist = async (id: string) => {
    if (!currentUser) {
        showToast("Please login to save favorites", "info");
        return;
    }
    const isIn = currentUser.wishlist.includes(id);
    const next = isIn ? currentUser.wishlist.filter(x => x !== id) : [...currentUser.wishlist, id];
    
    await supabase.from('profiles').update({ wishlist: next }).eq('id', currentUser.id);
    setCurrentUser({ ...currentUser, wishlist: next });
  };
  
  const updateUserProfile = async (d: any) => { if (currentUser) await supabase.from('profiles').update(d).eq('id', currentUser.id); };
  
  const updateSiteContent = async (s: keyof SiteContent, d: any) => { 
      // Upsert: update if key exists, insert if not
      await supabase.from('content').upsert({ key: s, data: d }); 
  };
  
  const setCategories = async (c: NavCategory[]) => { 
      await supabase.from('content').upsert({ key: 'navigation', data: { categories: c } }); 
  };

  return (
    <StoreContext.Provider value={{
      products, categories, siteContent, currentUser, loading, cart,
      login, register, logout, addToCart, removeFromCart, updateCartQuantity, clearCart,
      createOrder, updateOrderStatus, addMessage, markMessageRead, deleteMessage, toggleWishlist, updateUserProfile, uploadFile,
      updateSiteContent, setCategories, blogPosts, 
      addBlogPost: async b => { await supabase.from('blogs').upsert(b); },
      updateBlogPost: async b => { await supabase.from('blogs').update(b).eq('id', b.id); },
      removeBlogPost: async id => { await supabase.from('blogs').delete().eq('id', id); },
      testimonials, 
      addTestimonial: async (t: Testimonial) => { await supabase.from('testimonials').insert(t); },
      updateTestimonial: async t => { await supabase.from('testimonials').update(t).eq('id', t.id); },
      removeTestimonial: async id => { await supabase.from('testimonials').delete().eq('id', id); },
      messages, orders,
      addProduct: async (p: Product) => { await supabase.from('products').upsert(p); },
      updateProduct: async (p: Product) => { await supabase.from('products').update(p).eq('id', p.id); },
      removeProduct: async (id: string) => { await supabase.from('products').delete().eq('id', id); }
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
