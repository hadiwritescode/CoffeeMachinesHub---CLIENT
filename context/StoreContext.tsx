import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, BlogPost, Order, User, SiteContent, NavCategory, Testimonial, Message, CartItem } from '../types';
import { BRAND_LOGOS, NAVIGATION_LINKS, FAQS } from '../constants';
import { 
  collection, onSnapshot, doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged,
  setPersistence, browserSessionPersistence
} from 'firebase/auth';
import { 
  ref, uploadBytes, getDownloadURL 
} from 'firebase/storage';
import { db, auth, storage } from '../firebase';
import { useToast } from './ToastContext';

interface StoreContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  
  categories: NavCategory[];
  setCategories: (categories: NavCategory[]) => Promise<void>;
  
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'date' | 'status'>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  
  blogPosts: BlogPost[];
  setBlogPosts: (posts: BlogPost[]) => Promise<void>;
  addBlogPost: (post: BlogPost) => Promise<void>;
  updateBlogPost: (post: BlogPost) => Promise<void>;
  removeBlogPost: (id: string) => Promise<void>;
  
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  addTestimonial: (t: Testimonial) => Promise<void>;
  removeTestimonial: (id: string) => Promise<void>;
  
  messages: Message[];
  addMessage: (msg: Omit<Message, 'id' | 'date' | 'read'>) => Promise<void>;
  
  siteContent: SiteContent;
  updateSiteContent: (section: keyof SiteContent, data: any) => Promise<void>;
  
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  
  uploadFile: (file: File, path: string) => Promise<string>;
  loading: boolean;
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
    partnersText: "Trusted Partners & Global Brands"
  },
  shop: {
    heroTitle: "All Products",
    heroSubtitle: "Explore our complete collection of premium coffee and gear."
  },
  services: {
    heroTitle: "Elevate Your \n Coffee Business",
    heroSubtitle: "Comprehensive consulting...",
    heroImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1600",
    section1Title: "Wholesale Partner",
    section1Text: "We don't just supply beans; we supply consistency...",
    section1Image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
    section2Title: "Barista Training",
    section2Text: "Empower your staff...",
    section2Image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=800"
  },
  about: {
    heroTitle: "The Pursuit of \n Excellence",
    heroSubtitle: "We believe that every cup of coffee tells a story...",
    heroImage: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=1600",
    storyTitle: "Our Origins",
    storyText: "Coffee Machines Hub began as a small passion project..."
  },
  contact: {
    address: "G-22, City Star Mall, Model Town Link Road, Lahore, Pakistan",
    email: "Coffeemachineshub@gmail.com",
    phone: "+92 310 481 1011",
    faqs: FAQS
  },
  footer: {
    description: "Purveyors of the finest coffee gear and sustainably sourced beans. Crafting excellence, one cup at a time."
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

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children?: React.ReactNode }) => {
  const { showToast } = useToast();
  const [products, setProductsState] = useState<Product[]>([]);
  const [categories, setCategoriesState] = useState<NavCategory[]>([]);
  const [blogPosts, setBlogPostsState] = useState<BlogPost[]>([]);
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [testimonials, setTestimonialsState] = useState<Testimonial[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [siteContent, setSiteContentState] = useState<SiteContent>(defaultSiteContent);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [cart, setCartState] = useState<CartItem[]>(() => {
    try {
        const saved = localStorage.getItem('cmh_cart');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
  });

  useEffect(() => {
    // 1. Listen for Products (Safe)
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProductsState(snapshot.docs.map(doc => {
          const d = doc.data();
          return {
              id: doc.id,
              title: d.title || 'Untitled Product',
              price: d.price || 0,
              image: d.image || '',
              images: d.images || [],
              category: d.category || 'Uncategorized',
              tags: d.tags || [],
              description: d.description || '',
              soldOut: !!d.soldOut,
              isFeatured: !!d.isFeatured,
              features: d.features || [],
              ...d
          } as Product;
      }));
    });

    // 2. Listen for Categories (Safe)
    const unsubCats = onSnapshot(doc(db, 'content', 'navigation'), (docSnap) => {
      if (docSnap.exists()) {
        const rawCats = docSnap.data().categories || [];
        const safeCats = rawCats.map((c: any) => ({
            title: c.title || 'Untitled',
            items: Array.isArray(c.items) ? c.items : []
        }));
        setCategoriesState(safeCats as NavCategory[]);
      } else {
         const initialCategories = NAVIGATION_LINKS.find(l => l.label === 'SHOP')?.subItems || [];
         setDoc(doc(db, 'content', 'navigation'), { categories: initialCategories }).catch(console.error);
      }
    });

    // 3. Listen for Blog Posts
    const unsubBlogs = onSnapshot(collection(db, 'blogs'), (snapshot) => {
      setBlogPostsState(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
    });

    // 4. Listen for Orders
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      setOrdersState(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    });

    // 5. Listen for Messages
    const unsubMessages = onSnapshot(collection(db, 'messages'), (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    });

    // 6. Listen for Testimonials
    const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
        setTestimonialsState(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
    });

    // 7. Listen for Site Content (Safe Merging)
    const unsubContent = onSnapshot(collection(db, 'content'), (snapshot) => {
        setSiteContentState(prev => {
            const next = { ...prev };
            snapshot.docs.forEach(doc => {
                if (doc.id !== 'navigation') { 
                    const sectionKey = doc.id as keyof SiteContent;
                    const defaultSection = defaultSiteContent[sectionKey];
                    
                    if (defaultSection && typeof defaultSection === 'object' && !Array.isArray(defaultSection)) {
                        next[sectionKey] = { ...defaultSection, ...doc.data() };
                    } else {
                        next[sectionKey] = doc.data() as any;
                    }
                }
            });
            return next;
        });
    });

    // 8. Auth Listener (Critical Safe User Loading)
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
            const userDocRef = doc(db, 'users', user.uid);
            const snapshot = await getDoc(userDocRef);
            
            if (snapshot.exists()) {
                const userData = snapshot.data();
                
                const safeUser: User = {
                    id: user.uid,
                    name: userData.name || user.displayName || 'Customer',
                    email: userData.email || user.email || '',
                    role: userData.role || 'customer',
                    wishlist: Array.isArray(userData.wishlist) ? userData.wishlist : [],
                    cart: Array.isArray(userData.cart) ? userData.cart : [],
                    phone: userData.phone || '',
                    address: userData.address || '',
                    city: userData.city || ''
                };

                setCurrentUser(safeUser);
                if (safeUser.cart.length > 0) setCartState(safeUser.cart);
            } else {
                const newUser: User = {
                    id: user.uid,
                    name: user.displayName || 'Customer',
                    email: user.email || '',
                    role: 'customer',
                    wishlist: [],
                    cart: []
                };
                await setDoc(userDocRef, newUser);
                setCurrentUser(newUser);
            }
        } catch (error) {
            console.error("Profile Error:", error);
            showToast("Failed to load user profile", "error");
        } finally {
            setLoading(false);
        }
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubProducts(); unsubCats(); unsubBlogs(); unsubOrders(); 
      unsubMessages(); unsubTestimonials(); unsubContent(); unsubAuth();
    };
  }, []);

  // Sync Cart to LocalStorage for non-logged in users
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem('cmh_cart', JSON.stringify(cart));
    } else {
      updateDoc(doc(db, 'users', currentUser.id), { cart }).catch(console.error);
    }
  }, [cart, currentUser]);

  const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      
      // 30s Timeout to prevent infinite loading if config is wrong or network is dead
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Upload timed out. Check network or storage rules.")), 30000)
      );

      const snapshot = await Promise.race([
        uploadBytes(storageRef, file),
        timeout
      ]) as any;

      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error: any) {
      console.error("Storage upload error:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      showToast("Signed in successfully");
    } catch (error: any) {
      showToast(error.message, "error");
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, 'users', result.user.uid);
      const userData: User = {
        id: result.user.uid,
        name,
        email,
        role: 'customer',
        wishlist: [],
        cart: []
      };
      await setDoc(userDocRef, userData);
      showToast("Account created successfully");
    } catch (error: any) {
      showToast(error.message, "error");
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    showToast("Signed out");
  };

  const addProduct = async (product: Product) => {
    await setDoc(doc(db, 'products', product.id), product);
    showToast("Product added");
  };

  const updateProduct = async (product: Product) => {
    await updateDoc(doc(db, 'products', product.id), { ...product });
    showToast("Product updated");
  };

  const removeProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
    showToast("Product removed");
  };

  const setCategories = async (cats: NavCategory[]) => {
    await setDoc(doc(db, 'content', 'navigation'), { categories: cats });
    showToast("Navigation updated");
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      date: new Date().toLocaleDateString(),
      status: 'Processing'
    };
    await setDoc(doc(db, 'orders', orderId), newOrder);
    return orderId;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    await updateDoc(doc(db, 'orders', orderId), { status });
    showToast(`Order updated to ${status}`);
  };

  const addBlogPost = async (post: BlogPost) => {
    await setDoc(doc(db, 'blogs', post.id), post);
    showToast("Post published");
  };

  const updateBlogPost = async (post: BlogPost) => {
    await updateDoc(doc(db, 'blogs', post.id), { ...post });
  };

  const removeBlogPost = async (id: string) => {
    await deleteDoc(doc(db, 'blogs', id));
  };

  const addTestimonial = async (t: Testimonial) => {
    await addDoc(collection(db, 'testimonials'), t);
  };

  const removeTestimonial = async (id: string) => {
    await deleteDoc(doc(db, 'testimonials', id));
  };

  const addMessage = async (msg: Omit<Message, 'id' | 'date' | 'read'>) => {
    await addDoc(collection(db, 'messages'), { ...msg, date: new Date().toLocaleDateString(), read: false });
  };

  const updateSiteContent = async (section: keyof SiteContent, data: any) => {
    await setDoc(doc(db, 'content', section), data);
    showToast("Content updated");
  };

  const toggleWishlist = async (productId: string) => {
    if (!currentUser) {
      showToast("Please log in to save items", "info");
      return;
    }
    const isIn = currentUser.wishlist.includes(productId);
    const newWishlist = isIn 
      ? currentUser.wishlist.filter(id => id !== productId)
      : [...currentUser.wishlist, productId];
    
    await updateDoc(doc(db, 'users', currentUser.id), { wishlist: newWishlist });
    setCurrentUser({ ...currentUser, wishlist: newWishlist });
    if (!isIn) showToast("Added to wishlist");
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!currentUser) return;
    await updateDoc(doc(db, 'users', currentUser.id), data);
    setCurrentUser({ ...currentUser, ...data });
    showToast("Profile updated");
  };

  const addToCart = (product: Product) => {
    setCartState(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added ${product.title} to inquiry`);
  };

  const removeFromCart = (productId: string) => {
    setCartState(prev => prev.filter(p => p.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCartState(prev => prev.map(p => {
      if (p.id === productId) {
        const newQty = Math.max(1, p.quantity + delta);
        return { ...p, quantity: newQty };
      }
      return p;
    }));
  };

  const clearCart = () => setCartState([]);

  return (
    <StoreContext.Provider value={{
      products, setProducts: () => {}, addProduct, updateProduct, removeProduct,
      categories, setCategories,
      orders, createOrder, updateOrderStatus,
      blogPosts, setBlogPosts: async () => {}, addBlogPost, updateBlogPost, removeBlogPost,
      testimonials, setTestimonials: () => {}, addTestimonial, removeTestimonial,
      messages, addMessage,
      siteContent, updateSiteContent,
      currentUser, login, register, logout, toggleWishlist, updateUserProfile,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      uploadFile, loading
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