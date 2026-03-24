import { useState, useEffect } from 'react';
import Icon from './Icon';

export default function LoadingScreen() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setIsLoaded(true), 1500);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    const fallback = setTimeout(() => setIsLoaded(true), 3000);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div className={`loading-screen ${isLoaded ? 'loaded' : ''}`} aria-hidden={isLoaded}>
      <div className="loading-logo">
        <Icon name="utensils" />
        Rasoi
      </div>
      <div className="loading-bar-container">
        <div className="loading-bar"></div>
      </div>
      <p className="loading-text">Loading delicious experience...</p>
    </div>
  );
}
