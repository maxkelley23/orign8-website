import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Sun, Moon } from 'lucide-react';
import { Button } from './Button';
import { ButtonVariant } from '../types';
import { useTheme } from '../contexts/ThemeContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  // Define pages that should have a transparent navbar at the top
  const isTransparentNavPage = ['/', '/product'].some(path => location.pathname === path || location.pathname.startsWith(path + '/'));
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Product', path: '/product' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Variant State Logic
  const isTransparent = isTransparentNavPage && !isScrolled && !isMobileMenuOpen;
  
  // Navbar Container Classes
  const getNavClasses = () => {
    const baseClasses = "fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] left-1/2 -translate-x-1/2 will-change-transform";
    
    if (isMobileMenuOpen) {
      return `${baseClasses} !bg-white/95 dark:!bg-slate-900/95 backdrop-blur-2xl !rounded-3xl !w-[95%] !max-w-md !top-4 shadow-2xl border border-slate-100 dark:border-slate-800 ring-1 ring-black/5`;
    }
    
    if (isScrolled) {
      return `${baseClasses} top-4 w-[92%] max-w-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg shadow-slate-200/10 dark:shadow-black/20 rounded-full py-3 px-6`;
    }
    
    return `${baseClasses} top-6 w-[95%] max-w-7xl bg-transparent border-transparent py-4 rounded-full backdrop-blur-0`;
  };

  // Content Color Logic
  const linkColorClass = isTransparent 
    ? "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white" 
    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white";

  const logoColorClass = isTransparent 
    ? "text-slate-900 dark:text-white" 
    : "text-slate-900 dark:text-white";

  const logoIconClass = isTransparent 
    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" 
    : "bg-slate-900 text-white dark:bg-white dark:text-slate-900";

  // Active Link Background
  const getActiveLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    if (!isActive) return '';
    
    if (isTransparent) {
      return 'bg-slate-900/5 text-slate-900 dark:bg-white/10 dark:text-white font-medium';
    }
    return 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white font-medium';
  }

  return (
    <nav className={getNavClasses()}>
      <div className="w-full">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0 pl-2 md:pl-0" onClick={() => setIsMobileMenuOpen(false)}>
            <div className={`p-1.5 rounded-lg group-hover:scale-105 transition-transform duration-300 ${logoIconClass}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className={`text-lg font-bold tracking-tight font-display ${logoColorClass}`}>
              orign8
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className={`hidden md:flex items-center gap-1 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${linkColorClass} ${getActiveLinkClass(link.path)}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className={`hidden md:flex items-center gap-3 flex-shrink-0 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
             <button 
                onClick={(e) => toggleTheme(e)}
                className={`p-2 rounded-full transition-colors relative overflow-hidden w-9 h-9 flex items-center justify-center ${linkColorClass} hover:bg-slate-100 dark:hover:bg-slate-800`}
                aria-label="Toggle Theme"
             >
               <div className="relative w-5 h-5">
                 <Sun 
                    size={20} 
                    className={`absolute inset-0 transition-all duration-500 ${theme === 'dark' ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0'}`} 
                 />
                 <Moon 
                    size={20} 
                    className={`absolute inset-0 transition-all duration-500 ${theme === 'dark' ? 'rotate-90 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'}`} 
                 />
               </div>
             </button>
             {!isScrolled && (
               <Link to="/login" className={`text-sm font-medium px-3 ${linkColorClass}`}>
                 Log in
               </Link>
             )}
            <Link to="/contact">
              <Button 
                variant={ButtonVariant.PRIMARY} 
                className={`!rounded-full !px-5 !py-2 !text-xs font-semibold shadow-none ${isTransparent ? 'dark:!bg-white dark:!text-slate-900 dark:hover:!bg-slate-100' : ''}`}
              >
                Book Demo
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button 
                onClick={(e) => toggleTheme(e)}
                className={`p-2 rounded-full transition-colors relative w-9 h-9 flex items-center justify-center ${linkColorClass}`}
             >
                <div className="relative w-5 h-5">
                 <Sun 
                    size={20} 
                    className={`absolute inset-0 transition-all duration-500 ${theme === 'dark' ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0'}`} 
                 />
                 <Moon 
                    size={20} 
                    className={`absolute inset-0 transition-all duration-500 ${theme === 'dark' ? 'rotate-90 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'}`} 
                 />
               </div>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`focus:outline-none p-2 rounded-full transition-colors ${linkColorClass}`}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isMobileMenuOpen ? 'max-h-[80vh] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}
        `}
      >
        <div className="px-2 space-y-1 border-t border-slate-100 dark:border-slate-800 pt-4">
          {navLinks.map((link, idx) => (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center justify-between px-4 py-4 text-base font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all"
              style={{ transitionDelay: `${idx * 50}ms` }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-3">
                  {link.name}
              </span>
              <ChevronRight size={16} className="opacity-30" />
            </Link>
          ))}
          <div className="pt-6 px-2 pb-4 space-y-4">
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              <Button fullWidth variant={ButtonVariant.PRIMARY} className="!rounded-xl h-12 text-base shadow-lg shadow-slate-200 dark:shadow-none">
                Book Demo
              </Button>
            </Link>
            <div className="text-center">
               <Link to="/login" className="text-sm font-medium text-slate-500 dark:text-slate-400 p-2" onClick={() => setIsMobileMenuOpen(false)}>Log In to Platform</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};