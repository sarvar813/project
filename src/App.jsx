import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header/Header.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Home from './pages/Home/Home.jsx';
import Menu from './pages/Menu/Menu.jsx';
import About from './pages/About/About.jsx';
import Gallery from './pages/Gallery/Gallery.jsx';
import Blog from './pages/Blog/Blog.jsx';
import BuildBurger from './pages/Menu/BuildBurger.jsx';
import AdminPanel from './pages/Admin/AdminPanel.jsx';
import CourierPanel from './pages/Courier/CourierPanel.jsx';
import ProductDetails from './pages/ProductDetails/ProductDetails.jsx';
import OrderStatus from './pages/OrderStatus/OrderStatus.jsx';
import Profile from './pages/Profile/Profile.jsx';
import CartDrawer from './components/Cart/CartDrawer.jsx';
import Footer from './components/Footer/Footer.jsx';
import SupportChat from './components/SupportChat/SupportChat.jsx';
import WheelOfFortune from './components/WheelOfFortune/WheelOfFortune';
import MoodFood from './components/MoodFood/MoodFood';
import SocialProof from './components/SocialProof/SocialProof';
import EasterEgg from './components/EasterEgg/EasterEgg';
import SecretMenu from './components/SecretMenu/SecretMenu';

import './App.css';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

const PageWrapper = ({ children }) => (
  <div style={{ minHeight: '100vh' }}>
    {children}
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const isAdminOrCourierPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/courier');

  useEffect(() => {
    const originalTitle = document.title;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "Sizni sog'indik! 🍔";
      } else {
        document.title = originalTitle;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <div className="app">
      <ScrollToTop />
      <>
        {!isAdminOrCourierPage && <Header />}
        {!isAdminOrCourierPage && <Navbar />}
        {!isAdminOrCourierPage && <CartDrawer />}

        <div id="confetti-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 99999 }}></div>
      </>

      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/menu" element={<PageWrapper><Menu /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/build-burger" element={<BuildBurger />} />
        <Route path="/admin" element={<PageWrapper><AdminPanel /></PageWrapper>} />
        <Route path="/courier" element={<PageWrapper><CourierPanel /></PageWrapper>} />
        <Route path="/product/:id" element={<PageWrapper><ProductDetails /></PageWrapper>} />
        <Route path="/order-status/:id" element={<OrderStatus />} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
      </Routes>

      {!isAdminOrCourierPage && <Footer />}

      {
        !isAdminOrCourierPage && (
          <button className="scroll-up" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <i className="arrow-up"></i>
          </button>
        )
      }
      {!isAdminOrCourierPage && <SupportChat />}
      {!isAdminOrCourierPage && <WheelOfFortune />}
      {!isAdminOrCourierPage && <MoodFood />}
      {!isAdminOrCourierPage && <SocialProof />}
      {!isAdminOrCourierPage && <EasterEgg />}
      {!isAdminOrCourierPage && <SecretMenu />}
    </div >
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
