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

// Helper component to handle layout logic that depends on the router
const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

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
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-nomad-black bg-[#1a1510] selection:bg-nomad-gold selection:text-white">
      {/* 
        Main Content Wrapper 
        - Shadows Footer
        - mb-0 on mobile (footer stacks)
        - mb-[450px] on desktop (footer reveals)
        - isHome ? 'bg-transparent' : 'bg-nomad-paper': Keeps Hero video visible on home, while other pages have paper background.
      */}
      <div className={`relative z-10 ${isHome ? 'bg-nomad-paper md:bg-transparent' : 'bg-nomad-paper'} shadow-2xl rounded-b-[2rem] md:rounded-b-[4rem] mb-0 md:mb-[450px] overflow-hidden min-h-screen flex flex-col transition-all duration-300`}>
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
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;