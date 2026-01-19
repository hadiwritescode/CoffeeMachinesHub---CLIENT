import React, { useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import FeaturesBanner from './components/FeaturesBanner';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Services from './pages/Services';
import About from './pages/About';
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Profile from './pages/Profile';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ProductManager from './pages/admin/ProductManager';
import OrderManager from './pages/admin/OrderManager';
import ContentManager from './pages/admin/ContentManager';
import BlogManager from './pages/admin/BlogManager';
import CategoryManager from './pages/admin/CategoryManager';

const { BrowserRouter: Router, Routes, Route, useLocation } = ReactRouterDOM;

// Wrapper component to handle ScrollToTop and Animations
const PageWrapper = ({ children }: { children?: React.ReactNode }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediate scroll to top on route change
    window.scrollTo(0, 0);

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); 
        }
      });
    }, observerOptions);

    // Small delay to ensure DOM is rendered before observing
    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll('.fade-up, .fade-right');
      elements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [pathname]);

  return (
    <>
      {children}
      <ScrollToTop />
    </>
  );
};

const LayoutWithHeaderFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen font-sans text-nomad-black bg-nomad-black selection:bg-nomad-gold selection:text-white">
    <Header />
    <div className="relative z-10 bg-nomad-paper shadow-2xl rounded-b-[2rem] md:rounded-b-[4rem] mb-0 md:mb-[450px] overflow-hidden min-h-screen flex flex-col transition-all duration-300 w-full">
      <main className="flex-grow">
        {children}
      </main>
      <FeaturesBanner />
    </div>
    <Footer />
    <WhatsAppWidget />
  </div>
);

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <PageWrapper>
          <Routes>
            {/* Admin Routes (No Header/Footer) */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/products" element={<ProductManager />} />
            <Route path="/admin/categories" element={<CategoryManager />} />
            <Route path="/admin/orders" element={<OrderManager />} />
            <Route path="/admin/blogs" element={<BlogManager />} />
            <Route path="/admin/content" element={<ContentManager />} />
            
            {/* Public Routes */}
            <Route path="*" element={
              <LayoutWithHeaderFooter>
                 <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/collections/:collectionId" element={<Shop />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/blogs/:id" element={<BlogPost />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                 </Routes>
              </LayoutWithHeaderFooter>
            } />
          </Routes>
        </PageWrapper>
      </Router>
    </StoreProvider>
  );
};

export default App;