import React, { createContext, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (e?: React.MouseEvent) => void;
}


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (e?: React.MouseEvent) => {
    const isDark = theme === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';

    // Check if the browser supports View Transitions
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    // If triggered without an event (e.g., keyboard), just do a basic transition
    if (!e) {
      document.startViewTransition(() => {
        setTheme(nextTheme);
      });
      return;
    }

    // Get click coordinates
    const x = e.clientX;
    const y = e.clientY;

    // Calculate the radius needed to cover the screen from the click point
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      // Temporarily disable global CSS transitions.
      document.documentElement.classList.add('disable-transitions');
      // Mark as theme transition to prevent page-nav specific CSS from firing
      document.documentElement.classList.add('theme-transition');

      // Force React to resolve the state update and update DOM immediately
      flushSync(() => {
        setTheme(nextTheme);
      });

      const root = window.document.documentElement;
      if (nextTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    });

    transition.ready.then(() => {
      // Re-enable transitions once the snapshot is taken and animation begins
      document.documentElement.classList.remove('disable-transitions');

      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      // Animate the new view growing from the click point
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });

    // Cleanup the marker class
    transition.finished.finally(() => {
      document.documentElement.classList.remove('theme-transition');
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};