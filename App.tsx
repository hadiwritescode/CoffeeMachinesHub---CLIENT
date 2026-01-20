
import React, { useEffect, Suspense } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import FeaturesBanner from './components/FeaturesBanner';
import ScrollToTop from './components/ScrollToTop';
import { Loader2 } from 'lucide-react';

// Production lazy loading strategy
const Home = React.lazy(() => import('./pages/Home'));
const Shop = React.lazy(() => import('./pages/Shop'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Services = React.lazy(() => import('./pages/Services'));
const About = React.lazy(() => import('./pages/About'));
const Blogs = React.lazy(() => import('./pages/Blogs'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Login = React.lazy(() => import('./pages/Login'));
const Profile = React.lazy(() => import('./pages/Profile'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Admin Pages
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const ProductManager = React.lazy(() => import('./pages/admin/ProductManager'));
const OrderManager = React.lazy(() => import('./pages/admin/OrderManager'));
const ContentManager = React.lazy(() => import('./pages/admin/ContentManager'));
const BlogManager = React.lazy(() => import('./pages/admin/BlogManager'));
const CategoryManager = React.lazy(() => import('./pages/admin/CategoryManager'));
const MessageManager = React.lazy(() => import('./pages/admin/MessageManager'));

const { BrowserRouter: Router, Routes, Route, useLocation } = ReactRouterDOM;

const PageWrapper = ({ children }: { children?: React.ReactNode }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Performance optimized observer - only targets elements currently on page
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Efficiency: stop watching once visible
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Use a small delay to ensure React has finished rendering the DOM
    const timer = setTimeout(() => {
      document.querySelectorAll('.fade-up-init').forEach(el => observer.observe(el));
    }, 100);

    return () => {
        clearTimeout(timer);
        observer.disconnect();
    };
  }, [pathname]);

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
      <ScrollToTop />
    </>
  );
};

const PageLoader = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-nomad-paper">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-nomad-gold" size={40} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-nomad-black/40">Loading Hub</span>
        </div>
    </div>
);

const LayoutWithHeaderFooter = ({ children }: { children?: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      {children}
    </main>
    <FeaturesBanner />
    <Footer />
    <WhatsAppWidget />
  </div>
);

const AppContent = () => {
  const { loading } = useStore();

  if (loading) return <PageLoader />;

  return (
    <Router>
      <PageWrapper>
        <Routes>
          {/* Admin Routes (No Layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductManager />} />
          <Route path="/admin/categories" element={<CategoryManager />} />
          <Route path="/admin/orders" element={<OrderManager />} />
          <Route path="/admin/messages" element={<MessageManager />} />
          <Route path="/admin/blogs" element={<BlogManager />} />
          <Route path="/admin/content" element={<ContentManager />} />
          
          {/* Main App Routes */}
          <Route path="*" element={
            <LayoutWithHeaderFooter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blogs" element={<Blogs />} />
                  <Route path="/blogs/:id" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
            </LayoutWithHeaderFooter>
          } />
        </Routes>
      </PageWrapper>
    </Router>
  );
};

const App = () => (
  <StoreProvider>
      <AppContent />
  </StoreProvider>
);

export default App;
