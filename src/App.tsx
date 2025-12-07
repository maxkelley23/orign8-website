import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SEO } from './components/SEO';
import { ThemeProvider } from './contexts/ThemeContext';
import { trackPageView } from './services/analytics';

// Route-level code splitting for better initial load performance
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Product = lazy(() => import('./pages/Product').then(m => ({ default: m.Product })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Privacy = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));

/**
 * Loading fallback for lazy-loaded routes
 * Minimal skeleton to prevent layout shift
 */
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading...</span>
    </div>
  </div>
);

/**
 * Skip Navigation Link Component
 * Allows keyboard users to skip directly to main content
 */
const SkipLink: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-brand-400"
  >
    Skip to main content
  </a>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // Track page view on route change
    trackPageView({
      path: pathname,
      title: document.title,
    });
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

      // Check for valid internal links (relative paths starting with /)
      if (!anchor || !href || !href.startsWith('/')) return;

      // Skip external links
      if (anchor.origin !== window.location.origin) return;

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

      document.startViewTransition(() => {
        // Force synchronous React update to ensure DOM matches new state before snapshot
        flushSync(() => {
          navigate(href);
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
      
      <main id="main-content" className="flex-grow relative z-10">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product" element={<Product />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      
      {!isAuthPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <SkipLink />
          <SEO />
          <ScrollToTop />
          <AppContent />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;