import { useState, useEffect } from 'react';
import Icon from './Icon';
import './LazyImage.css';

export default function LazyImage({ src, alt, className = '' }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setHasError(true);
  }, [src]);

  return (
    <div className={`lazy-image-container ${className}`}>
      {!isLoaded && !hasError && (
        <div className="lazy-image-skeleton">
          <div className="skeleton-shimmer"></div>
        </div>
      )}
      {hasError ? (
        <div className="lazy-image-fallback">
          <Icon name="image" />
          <span>Image not available</span>
        </div>
      ) : (
        <img 
          src={src} 
          alt={alt} 
          className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
          loading="lazy"
        />
      )}
    </div>
  );
}
