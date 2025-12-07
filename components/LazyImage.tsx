import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderClassName?: string;
  /** Optional low-res placeholder (e.g., data URI or tiny image) */
  placeholder?: string;
}

/**
 * LazyImage Component
 * Implements native lazy loading with Intersection Observer fallback
 * Features:
 * - Native loading="lazy" attribute
 * - Intersection Observer for older browsers
 * - Smooth fade-in transition
 * - Optional blur-up placeholder
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  placeholder,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for browsers without native lazy loading
  useEffect(() => {
    // Check if native lazy loading is supported
    if ('loading' in HTMLImageElement.prototype) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before entering viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={`relative ${placeholderClassName}`}>
      {/* Placeholder (shown while loading) */}
      {!isLoaded && (
        <div
          className={`absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse ${placeholderClassName}`}
          style={placeholder ? { backgroundImage: `url(${placeholder})`, backgroundSize: 'cover', filter: 'blur(20px)' } : undefined}
        />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
