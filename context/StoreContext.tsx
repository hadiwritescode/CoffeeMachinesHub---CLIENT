import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, BlogPost, Order, User, SiteContent, NavCategory, Testimonial, Message, CartItem } from '../types';
import { BRAND_LOGOS, NAVIGATION_LINKS } from '../constants';
import { 
  collection, onSnapshot, doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, signOut, onAuthStateChanged 
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
  login: (email: string, password?: string) => Promise<void>;
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
  home: { brands: BRAND_LOGOS },
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
  
  const [cart, setCartState] = useState<CartItem[]>(() => {
    try {
        const saved = localStorage.getItem('nomad_cart');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
  });
  
  const [loading, setLoading] = useState(true);

  // --- Real-time Listeners ---

  useEffect(() => {
    // 1. Products
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProductsState(prods);
      // Removed automatic seeding logic for production safety
    });

    // 2. Categories
    const unsubCats = onSnapshot(doc(db, 'content', 'navigation'), (docSnap) => {
      if (docSnap.exists()) {
        setCategoriesState(docSnap.data().categories as NavCategory[]);
      } else {
         const initialCategories = NAVIGATION_LINKS.find(l => l.label === 'SHOP')?.subItems || [];
         // Create navigation doc if missing
         setDoc(doc(db, 'content', 'navigation'), { categories: initialCategories }).catch(console.error);
      }
    });

    // 3. Blogs
    const unsubBlogs = onSnapshot(collection(db, 'blogs'), (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
      setBlogPostsState(posts);
    });

    // 4. Orders
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      setOrdersState(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    });

    // 5. Messages
    const unsubMessages = onSnapshot(collection(db, 'messages'), (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    });

    // 6. Testimonials
    const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
        const tests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
        setTestimonialsState(tests);
    });

    // 7. Site Content
    const unsubContent = onSnapshot(collection(db, 'content'), (snapshot) => {
        const contentData: any = { ...defaultSiteContent };
        snapshot.docs.forEach(doc => {
            if (doc.id !== 'navigation') { 
                contentData[doc.id] = doc.data();
            }
        });
        setSiteContentState(prev => ({ ...prev, ...contentData }));
    });

    // 8. Auth & Persistent Cart
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
            const userDocRef = doc(db, 'users', user.uid);
            const snapshot = await getDoc(userDocRef);
            
            if (snapshot.exists()) {
                const userData = snapshot.data() as User;
                setCurrentUser(userData);
                if (userData.cart) {
                    setCartState(userData.cart);
                }
            } else {
                const newUser: User = {
                    id: user.uid,
                    name: user.displayName || user.email?.split('@')[0] || 'User',
                    email: user.email || '',
                    role: user.email?.includes('admin') ? 'admin' : 'customer',
                    wishlist: [],
                    cart: []
                };
                await setDoc(userDocRef, newUser);
                setCurrentUser(newUser);
                setCartState([]);
            }
        } catch (error) {
            console.error("Auth Error", error);
            showToast("Failed to load user profile", "error");
        }
      } else {
        setCurrentUser(null);
        setCartState([]);
      }
      setLoading(false);
    });

    return () => {
      unsubProducts(); unsubCats(); unsubBlogs(); unsubOrders(); unsubMessages(); unsubTestimonials(); unsubContent(); unsubAuth();
    };
  }, []);

  // --- Cart Sync Effect ---
  useEffect(() => {
      if (currentUser) {
          const userRef = doc(db, 'users', currentUser.id);
          updateDoc(userRef, { cart: cart }).catch(err => console.error("Error syncing cart", err));
      } else {
          localStorage.setItem('nomad_cart', JSON.stringify(cart));
      }
  }, [cart, currentUser]);


  // --- Actions with Toast & Error Handling ---

  const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
        const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    } catch (e) {
        showToast("File upload failed", "error");
        throw e;
    }
  };

  const addProduct = async (product: Product) => { 
      try {
        await setDoc(doc(db, 'products', product.id), product);
        showToast("Product added successfully");
      } catch (e) {
          showToast("Failed to add product", "error");
      }
  };
  
  const updateProduct = async (product: Product) => { 
      try {
        await updateDoc(doc(db, 'products', product.id), { ...product });
        showToast("Product updated");
      } catch (e) {
        showToast("Update failed", "error");
      }
  };
  
  const removeProduct = async (id: string) => { 
      try {
        await deleteDoc(doc(db, 'products', id));
        showToast("Product deleted");
      } catch (e) {
          showToast("Delete failed", "error");
      }
  };

  const setProducts = () => {}; // Managed by snapshot

  const setCategories = async (cats: NavCategory[]) => {
      try {
        await setDoc(doc(db, 'content', 'navigation'), { categories: cats });
        showToast("Navigation updated");
      } catch (e) {
        showToast("Failed to update navigation", "error");
      }
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
    try {
        await updateDoc(doc(db, 'orders', orderId), { status });
        showToast(`Order status updated to ${status}`);
    } catch (e) {
        showToast("Failed to update status", "error");
    }
  };

  const addBlogPost = async (post: BlogPost) => { 
      try {
        await setDoc(doc(db, 'blogs', post.id), post);
        showToast("Post published");
      } catch(e) { showToast("Failed to publish", "error"); }
  };
  
  const updateBlogPost = async (post: BlogPost) => { 
      try {
        await updateDoc(doc(db, 'blogs', post.id), { ...post });
        showToast("Post updated");
      } catch(e) { showToast("Update failed", "error"); }
  };
  
  const removeBlogPost = async (id: string) => { 
      try {
        await deleteDoc(doc(db, 'blogs', id));
        showToast("Post deleted");
      } catch (e) { showToast("Delete failed", "error"); }
  };
  
  const setBlogPosts = async () => {};

  const addTestimonial = async (t: Testimonial) => { await addDoc(collection(db, 'testimonials'), t); };
  const removeTestimonial = async (id: string) => { await deleteDoc(doc(db, 'testimonials', id)); };
  const setTestimonials = () => {};

  const addMessage = async (msg: Omit<Message, 'id' | 'date' | 'read'>) => {
      await addDoc(collection(db, 'messages'), { ...msg, date: new Date().toLocaleDateString(), read: false });
  };

  const updateSiteContent = async (section: keyof SiteContent, data: any) => {
      try {
        await setDoc(doc(db, 'content', section), data);
        showToast("Content saved");
      } catch (e) { showToast("Failed to save content", "error"); }
  };

  const login = async (email: string, password?: string) => {
      const pass = password || "password123"; 
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        showToast("Welcome back!");
      } catch (error: any) {
          showToast(error.message, "error");
      }
  };

  const logout = async () => { 
      await signOut(auth);
      showToast("Signed out successfully");
  };

  const toggleWishlist = async (productId: string) => {
      if (!currentUser) {
          showToast("Please sign in to save items", "info");
          return;
      }
      const isIn = currentUser.wishlist.includes(productId);
      const newWishlist = isIn ? currentUser.wishlist.filter(id => id !== productId) : [...currentUser.wishlist, productId];
      
      try {
        await updateDoc(doc(db, 'users', currentUser.id), { wishlist: newWishlist });
        // Local update for immediate UI response
        setCurrentUser(prev => prev ? { ...prev, wishlist: newWishlist } : null);
        if (!isIn) showToast("Added to wishlist");
      } catch (e) {
          showToast("Failed to update wishlist", "error");
      }
  };

  const updateUserProfile = async (data: Partial<User>) => {
      if (!currentUser) return;
      try {
        await updateDoc(doc(db, 'users', currentUser.id), data);
        setCurrentUser(prev => prev ? { ...prev, ...data } : null);
        showToast("Profile updated");
      } catch (e) {
          showToast("Update failed", "error");
      }
  };

  // Cart Logic
  const addToCart = (product: Product) => {
      setCartState(prev => {
          const existing = prev.find(p => p.id === product.id);
          showToast(`Added ${product.title} to inquiry`);
          if (existing) {
              return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
          }
          return [...prev, { ...product, quantity: 1 }];
      });
  };

  const removeFromCart = (productId: string) => {
      setCartState(prev => prev.filter(p => p.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
      setCartState(prev => prev.map(p => {
          if (p.id === productId) {
              const newQty = p.quantity + delta;
              return newQty > 0 ? { ...p, quantity: newQty } : p;
          }
          return p;
      }));
  };

  const clearCart = () => setCartState([]);

  return (
    <StoreContext.Provider value={{
      products, setProducts, addProduct, updateProduct, removeProduct,
      categories, setCategories,
      orders, createOrder, updateOrderStatus,
      blogPosts, setBlogPosts, addBlogPost, updateBlogPost, removeBlogPost,
      testimonials, setTestimonials: setTestimonials as any, addTestimonial, removeTestimonial,
      messages, addMessage,
      siteContent, updateSiteContent,
      currentUser, login, logout, toggleWishlist, updateUserProfile,
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