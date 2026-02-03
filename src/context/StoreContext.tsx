
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

  const fetchAll = async () => {
    try {
        const { data: prodData } = await supabase.from('products').select('*');
        if (prodData) setProducts(prodData);

        const { data: blogData } = await supabase.from('blogs').select('*');
        if (blogData) setBlogPosts(blogData);

        const { data: testData } = await supabase.from('testimonials').select('*');
        if (testData) setTestimonials(testData);

        const { data: msgData } = await supabase.from('messages').select('*');
        if (msgData) setMessages(msgData);

        const { data: ordData } = await supabase.from('orders').select('*');
        if (ordData) setOrders(ordData);

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
    } catch (error) {
        console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAll();
    const channels = [
        supabase.channel('public:products').on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchAll).subscribe(),
        supabase.channel('public:blogs').on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, fetchAll).subscribe(),
        supabase.channel('public:testimonials').on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, fetchAll).subscribe(),
        supabase.channel('public:messages').on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchAll).subscribe(),
        supabase.channel('public:orders').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchAll).subscribe(),
        supabase.channel('public:content').on('postgres_changes', { event: '*', schema: 'public', table: 'content' }, fetchAll).subscribe(),
    ];
    return () => { channels.forEach(c => supabase.removeChannel(c)); };
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) {
            setCurrentUser(profile);
            if (profile.cart && Array.isArray(profile.cart)) setCart(profile.cart);
        } else {
            const newUser: User = { 
                id: session.user.id, 
                name: session.user.user_metadata?.name || 'User', 
                email: session.user.email || '', 
                role: 'customer', 
                wishlist: [], 
                cart: [] 
            };
            const { error: insertError } = await supabase.from('profiles').insert(newUser);
            if (!insertError) setCurrentUser(newUser);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

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

  const wrapDbOp = async (op: Promise<any>, successMsg?: string) => {
    try {
        const { data, error } = await op;
        if (error) {
            console.error("Database Operation Error:", error);
            showToast(error.message || "Operation failed. Check permissions.", "error");
            throw error;
        }
        if (successMsg) showToast(successMsg);
        return data;
    } catch (err: any) {
        throw err;
    }
  };

  const login = async (e: string, p: string) => { 
      const { error } = await supabase.auth.signInWithPassword({ email: e, password: p });
      if (error) { showToast(error.message, "error"); throw error; }
      showToast("Welcome back!"); 
  };
  
  const logout = async () => { await supabase.auth.signOut(); clearCart(); showToast("Logged out"); };

  const register = async (e: string, p: string, n: string) => {
    const { data, error } = await supabase.auth.signUp({ email: e, password: p, options: { data: { name: n } } });
    if (error) { showToast(error.message, "error"); throw error; }
    if (data.user) {
        const u: User = { id: data.user.id, name: n, email: e, role: 'customer', wishlist: [], cart: [] };
        await supabase.from('profiles').insert(u);
        setCurrentUser(u);
    }
  };

  const uploadFile = async (f: File, bucket: string) => {
    const safeName = `${Date.now()}_${f.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const { data, error } = await supabase.storage.from(bucket).upload(safeName, f);
    if (error) { showToast("Upload failed", "error"); throw error; }
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(safeName);
    return publicUrl;
  };

  const createOrder = async (o: any) => {
    const id = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    await wrapDbOp(supabase.from('orders').insert({ ...o, id, date: new Date().toLocaleDateString(), status: 'Processing' }));
    return id;
  };

  const updateOrderStatus = async (id: string, s: any) => { await wrapDbOp(supabase.from('orders').update({ status: s }).eq('id', id), "Order updated"); };
  const addMessage = async (m: any) => { await wrapDbOp(supabase.from('messages').insert({ ...m, date: new Date().toLocaleDateString(), read: false }), "Message sent"); };
  const markMessageRead = async (id: string, status: boolean) => { await wrapDbOp(supabase.from('messages').update({ read: !status }).eq('id', id)); };
  const deleteMessage = async (id: string) => { await wrapDbOp(supabase.from('messages').delete().eq('id', id), "Message deleted"); };
  
  const toggleWishlist = async (id: string) => {
    if (!currentUser) { showToast("Please login to save favorites", "info"); return; }
    const isIn = currentUser.wishlist.includes(id);
    const next = isIn ? currentUser.wishlist.filter(x => x !== id) : [...currentUser.wishlist, id];
    await supabase.from('profiles').update({ wishlist: next }).eq('id', currentUser.id);
    setCurrentUser({ ...currentUser, wishlist: next });
  };
  
  const updateUserProfile = async (d: any) => { 
      if (currentUser) {
          await wrapDbOp(supabase.from('profiles').update(d).eq('id', currentUser.id), "Profile updated");
          setCurrentUser({...currentUser, ...d});
      }
  };
  
  const updateSiteContent = async (s: keyof SiteContent, d: any) => { 
      setSiteContent(prev => ({ ...prev, [s]: d }));
      await wrapDbOp(supabase.from('content').upsert({ key: s, data: d }), "Content saved"); 
  };
  
  const setCategories = async (c: NavCategory[]) => { 
      setCategoriesState(c);
      await wrapDbOp(supabase.from('content').upsert({ key: 'navigation', data: { categories: c } }), "Categories saved"); 
  };

  return (
    <StoreContext.Provider value={{
      products, categories, siteContent, currentUser, loading, cart,
      login, register, logout, addToCart, removeFromCart, updateCartQuantity, clearCart,
      createOrder, updateOrderStatus, addMessage, markMessageRead, deleteMessage, toggleWishlist, updateUserProfile, uploadFile,
      updateSiteContent, setCategories, blogPosts, 
      addBlogPost: async b => { await wrapDbOp(supabase.from('blogs').upsert(b), "Blog post saved"); },
      updateBlogPost: async b => { await wrapDbOp(supabase.from('blogs').update(b).eq('id', b.id), "Blog post updated"); },
      removeBlogPost: async id => { await wrapDbOp(supabase.from('blogs').delete().eq('id', id), "Blog post deleted"); },
      testimonials, 
      addTestimonial: async (t: Testimonial) => { await wrapDbOp(supabase.from('testimonials').insert(t), "Testimonial added"); },
      updateTestimonial: async t => { await wrapDbOp(supabase.from('testimonials').update(t).eq('id', t.id), "Testimonial updated"); },
      removeTestimonial: async id => { await wrapDbOp(supabase.from('testimonials').delete().eq('id', id), "Testimonial removed"); },
      messages, orders,
      addProduct: async (p: Product) => { await wrapDbOp(supabase.from('products').upsert(p), "Product added"); },
      updateProduct: async (p: Product) => { await wrapDbOp(supabase.from('products').update(p).eq('id', p.id), "Product updated"); },
      removeProduct: async (id: string) => { await wrapDbOp(supabase.from('products').delete().eq('id', id), "Product deleted"); }
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
