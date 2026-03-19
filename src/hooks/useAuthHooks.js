import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function useAbortController() {
  const abortControllerRef = useRef(null);

  const getController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, []);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  useEffect(() => {
    return () => abort();
  }, [abort]);

  return { getController, abort };
}

export function useFocusTrap(ref, isActive) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = element.querySelectorAll(focusableSelectors);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [ref, isActive]);
}

export function useKeyboardNavigation(handlers) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (handlers[e.key]) {
        handlers[e.key](e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}

export function useAnalytics() {
  const trackEvent = useCallback((eventName, properties = {}) => {
    if (import.meta.env.DEV) {
      console.log(`[Analytics] ${eventName}`, properties);
    }
    if (window.gtag) {
      window.gtag('event', eventName, properties);
    }
  }, []);

  const trackLoginAttempt = useCallback(() => {
    trackEvent('login_attempt', { timestamp: Date.now() });
  }, [trackEvent]);

  const trackLoginSuccess = useCallback((method = 'email') => {
    trackEvent('login_success', { method, timestamp: Date.now() });
  }, [trackEvent]);

  const trackLoginFailure = useCallback((reason) => {
    trackEvent('login_failure', { reason, timestamp: Date.now() });
  }, [trackEvent]);

  const trackPerformance = useCallback((metric, value) => {
    trackEvent('performance', { metric, value });
  }, [trackEvent]);

  return {
    trackEvent,
    trackLoginAttempt,
    trackLoginSuccess,
    trackLoginFailure,
    trackPerformance,
  };
}

export function useFeatureFlags() {
  const flags = useMemo(() => ({
    socialLoginGoogle: import.meta.env.VITE_FEATURE_GOOGLE_LOGIN !== 'false',
    socialLoginFacebook: import.meta.env.VITE_FEATURE_FACEBOOK_LOGIN !== 'false',
    socialLoginTwitter: import.meta.env.VITE_FEATURE_TWITTER_LOGIN !== 'false',
    passwordStrengthMeter: import.meta.env.VITE_FEATURE_PASSWORD_STRENGTH !== 'false',
    rememberMe: import.meta.env.VITE_FEATURE_REMEMBER_ME !== 'false',
    bruteForceProtection: import.meta.env.VITE_FEATURE_BRUTE_FORCE !== 'false',
  }), []);

  const isEnabled = useCallback((flag) => flags[flag] ?? false, [flags]);

  return { flags, isEnabled };
}

export function useRateLimit(maxAttempts = 5, windowMs = 900000) {
  const [attempts, setAttempts] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const recentAttempts = attempts.filter(t => now - t < windowMs);
    setAttempts(recentAttempts);
    const blocked = recentAttempts.length >= maxAttempts;
    setIsBlocked(blocked);
    return !blocked;
  }, [attempts, maxAttempts, windowMs]);

  const recordAttempt = useCallback(() => {
    setAttempts(prev => [...prev, Date.now()]);
  }, []);

  const resetAttempts = useCallback(() => {
    setAttempts([]);
    setIsBlocked(false);
  }, []);

  const getRemainingTime = useCallback(() => {
    if (!isBlocked || attempts.length === 0) return 0;
    const oldestRelevant = Math.min(...attempts);
    return Math.max(0, Math.ceil((oldestRelevant + windowMs - Date.now()) / 1000));
  }, [isBlocked, attempts, windowMs]);

  return { isBlocked, checkRateLimit, recordAttempt, resetAttempts, getRemainingTime };
}
