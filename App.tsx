
import React, { useEffect, Suspense, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './src/context/StoreContext';
import Header from './src/components/Header';
import Footer from './src/components/Footer';
import WhatsAppWidget from './src/components/WhatsAppWidget';
import FeaturesBanner from './src/components/FeaturesBanner';
import ScrollToTop from './src/components/ScrollToTop';

// Production lazy loading strategy
const Home = React.lazy(() => import('./src/pages/Home'));
const Shop = React.lazy(() => import('./src/pages/Shop'));
const ProductDetail = React.lazy(() => import('./src/pages/ProductDetail'));
const Services = React.lazy(() => import('./src/pages/Services'));
const About = React.lazy(() => import('./src/pages/About'));
const Blogs = React.lazy(() => import('./src/pages/Blogs'));
const BlogPost = React.lazy(() => import('./src/pages/BlogPost'));
const Contact = React.lazy(() => import('./src/pages/Contact'));
const Cart = React.lazy(() => import('./src/pages/Cart'));
const Login = React.lazy(() => import('./src/pages/Login'));
const Profile = React.lazy(() => import('./src/pages/Profile'));
const NotFound = React.lazy(() => import('./src/pages/NotFound'));

// Admin Pages
const AdminLogin = React.lazy(() => import('./src/pages/admin/AdminLogin'));
const Dashboard = React.lazy(() => import('./src/pages/admin/Dashboard'));
const ProductManager = React.lazy(() => import('./src/pages/admin/ProductManager'));
const OrderManager = React.lazy(() => import('./src/pages/admin/OrderManager'));
const ContentManager = React.lazy(() => import('./src/pages/admin/ContentManager'));
const BlogManager = React.lazy(() => import('./src/pages/admin/BlogManager'));
const CategoryManager = React.lazy(() => import('./src/pages/admin/CategoryManager'));
const MessageManager = React.lazy(() => import('./src/pages/admin/MessageManager'));

const PageWrapper = ({ children }: { children?: React.ReactNode }) => {
  const { pathname } = useLocation();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  // Dynamic Observer for async content
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const handleMutations = (mutations: MutationRecord[]) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
               if (node.classList.contains('fade-up-init')) {
                 observer.observe(node);
               }
               // Also check descendants
               const descendants = node.querySelectorAll('.fade-up-init');
               descendants.forEach(d => observer.observe(d));
            }
          });
        }
      });
    };

    const mutationObserver = new MutationObserver(handleMutations);
    
    if (document.getElementById('root')) {
      mutationObserver.observe(document.getElementById('root')!, {
        childList: true,
        subtree: true
      });
    }

    // Initial scan
    document.querySelectorAll('.fade-up-init').forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return (
    <div ref={wrapperRef} className="animate-fade-in min-h-screen">
      <Suspense fallback={null}>
        {children}
      </Suspense>
      <ScrollToTop />
    </div>
  );
};

const LayoutWithHeaderFooter = ({ children }: { children?: React.ReactNode }) => {
  const [footerHeight, setFooterHeight] = useState(0);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setFooterHeight(entry.contentRect.height);
      }
    });

    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      
      {/* 
        Stacking Context Strategy for Footer Reveal:
        1. Content Wrapper (z-10): Contains Header, Main, FeaturesBanner.
           It is transparent to allow FeaturesBanner's rounded corners to show the footer behind.
           It has margin-bottom equal to footer height to allow scrolling "past" content.
        2. Footer (z-0): Fixed at bottom. Visible when Content Wrapper scrolls up.
      */}
      <div 
        className="relative z-10"
        style={{ marginBottom: `${footerHeight}px` }}
      >
        <main className="flex-grow min-h-screen">
          {children}
        </main>
        <FeaturesBanner />
      </div>

      <div 
        ref={footerRef}
        className="fixed bottom-0 left-0 w-full z-0"
      >
        <Footer />
      </div>
      
      <WhatsAppWidget />
    </div>
  );
};

const AppContent = () => {
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
