import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RewardsButton from './components/RewardsButton';
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

// Wrapper component to handle ScrollToTop and Animations
const PageWrapper = ({ children }: { children?: React.ReactNode }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); 
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    setTimeout(() => {
      const elements = document.querySelectorAll('.fade-up');
      elements.forEach(el => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, [pathname]);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <PageWrapper>
        <div className="flex flex-col min-h-screen font-sans text-nomad-black bg-[#1a1510] selection:bg-nomad-gold selection:text-white">
          {/* Main Content Wrapper - Shadows Footer */}
          {/* mb-0 on mobile (footer stacks), mb-[450px] on desktop (footer reveals) */}
          <div className="relative z-10 bg-nomad-paper shadow-2xl rounded-b-[2rem] md:rounded-b-[4rem] mb-0 md:mb-[450px] overflow-hidden min-h-screen flex flex-col transition-all duration-300">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/collections/blends" element={<Shop />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/pages/about" element={<About />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/:id" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
          </div>
          
          {/* Fixed Footer (Revealed on Scroll on Desktop, Static on Mobile) */}
          <Footer />
          
          <RewardsButton />
        </div>
      </PageWrapper>
    </Router>
  );
};

export default App;