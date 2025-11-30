import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Contact } from './pages/Contact';
import { Product } from './pages/Product';
import { Login } from './pages/Login';
import { About } from './pages/About';
import { ThemeProvider } from './contexts/ThemeContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/login';

  // Global Navigation Interceptor for View Transitions
  useEffect(() => {
    // Only proceed if View Transition API is supported
    if (!document.startViewTransition) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      const href = anchor?.getAttribute('href');

      // Check for valid HashRouter links (e.g., "#/product")
      if (!anchor || !href || !href.startsWith('#/')) return;

      // Ignore special clicks (modifiers, new tab)
      if (
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        e.shiftKey ||
        anchor.target === '_blank'
      ) {
        return;
      }

      e.preventDefault();
      
      // Extract path from hash (remove leading #)
      const to = href.replace(/^#/, '');

      document.startViewTransition(() => {
        // Force synchronous React update to ensure DOM matches new state before snapshot
        flushSync(() => {
          navigate(to);
        });
      });
    };

    // Use capture to intercept before React Router's internal handling
    document.addEventListener('click', handleAnchorClick, true);
    return () => document.removeEventListener('click', handleAnchorClick, true);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-brand-500 selection:text-white flex flex-col relative transition-colors duration-300">
      
      {/* Global Ambient Background - Only show on non-auth pages */}
      {!isAuthPage && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Noise Texture */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-10"></div>
          
          {/* Floating Orbs - Adjusted for dark mode compatibility */}
          <div className="hidden dark:block absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-900/20 blur-[120px] animate-drift" />
          <div className="hidden dark:block absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px] animate-drift" style={{ animationDelay: '-5s' }} />
        </div>
      )}

      {!isAuthPage && <Navbar />}
      
      <main className="flex-grow relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      
      {!isAuthPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;