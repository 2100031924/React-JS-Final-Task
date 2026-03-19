import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { sanitizeInput, sanitizeEmail } from '../utils/sanitize';

const AuthContext = createContext(null);

const AUTH_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000,
  SESSION_TIMEOUT: 30 * 60 * 1000,
  REFRESH_THRESHOLD: 5 * 60 * 1000,
  RATE_LIMIT_BASE_DELAY: 1000,
  RATE_LIMIT_MAX_DELAY: 32000,
  API_BASE_URL: import.meta.env.VITE_API_URL || '/api',
};

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginAttempts: 0,
  lockoutUntil: null,
  sessionExpiresAt: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        loginAttempts: 0,
        lockoutUntil: null,
        error: null,
        sessionExpiresAt: Date.now() + AUTH_CONFIG.SESSION_TIMEOUT,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        loginAttempts: state.loginAttempts + 1,
      };
    case 'AUTH_LOGOUT':
      return { ...initialState };
    case 'SET_LOCKOUT':
      return {
        ...state,
        lockoutUntil: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'REFRESH_SESSION':
      return {
        ...state,
        sessionExpiresAt: Date.now() + AUTH_CONFIG.SESSION_TIMEOUT,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState, () => {
    try {
      const saved = sessionStorage.getItem('auth_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sessionExpiresAt && parsed.sessionExpiresAt > Date.now()) {
          return parsed;
        }
      }
    } catch {
      sessionStorage.removeItem('auth_state');
    }
    return initialState;
  });

  const rateLimitRef = useRef({ attempts: 0, lastAttempt: 0 });

  useEffect(() => {
    sessionStorage.setItem('auth_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!state.isAuthenticated) return;

    const checkSession = () => {
      if (state.sessionExpiresAt && Date.now() > state.sessionExpiresAt) {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, [state.isAuthenticated, state.sessionExpiresAt]);

  const isLockedOut = useCallback(() => {
    if (!state.lockoutUntil) return false;
    if (Date.now() > state.lockoutUntil) {
      dispatch({ type: 'AUTH_LOGOUT' });
      return false;
    }
    return true;
  }, [state.lockoutUntil]);

  const getRemainingLockoutTime = useCallback(() => {
    if (!state.lockoutUntil) return 0;
    return Math.max(0, Math.ceil((state.lockoutUntil - Date.now()) / 1000));
  }, [state.lockoutUntil]);

  const getRetryDelay = useCallback(() => {
    const { attempts } = rateLimitRef.current;
    const delay = Math.min(
      AUTH_CONFIG.RATE_LIMIT_BASE_DELAY * Math.pow(2, attempts),
      AUTH_CONFIG.RATE_LIMIT_MAX_DELAY
    );
    return delay;
  }, []);

  const login = useCallback(async (email, password, rememberMe = false) => {
    if (isLockedOut()) {
      const remaining = getRemainingLockoutTime();
      dispatch({
        type: 'AUTH_FAILURE',
        payload: `Too many attempts. Try again in ${Math.ceil(remaining / 60)} minutes.`,
      });
      return { success: false, error: 'locked_out' };
    }

    dispatch({ type: 'AUTH_START' });

    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedPassword = sanitizeInput(password);

    try {
      const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: sanitizedEmail,
          password: sanitizedPassword,
          rememberMe,
        }),
      });

      if (response.status === 429) {
        rateLimitRef.current.attempts++;
        const delay = getRetryDelay();
        await new Promise(resolve => setTimeout(resolve, delay));
        return login(email, password, rememberMe);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Authentication failed');
      }

      const data = await response.json();
      rateLimitRef.current = { attempts: 0, lastAttempt: Date.now() };
      dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
      return { success: true };
    } catch {
      rateLimitRef.current.lastAttempt = Date.now();

      if (state.loginAttempts + 1 >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
        dispatch({
          type: 'SET_LOCKOUT',
          payload: Date.now() + AUTH_CONFIG.LOCKOUT_DURATION,
        });
        dispatch({
          type: 'AUTH_FAILURE',
          payload: `Account locked for ${AUTH_CONFIG.LOCKOUT_DURATION / 60000} minutes due to too many failed attempts.`,
        });
        return { success: false, error: 'account_locked' };
      }

      dispatch({
        type: 'AUTH_FAILURE',
        payload: 'Invalid email or password. Please try again.',
      });
      return { success: false, error: 'invalid_credentials' };
    }
  }, [isLockedOut, getRemainingLockoutTime, getRetryDelay, state.loginAttempts]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${AUTH_CONFIG.API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      }).catch(() => {});
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
      sessionStorage.removeItem('auth_state');
    }
  }, []);

  const refreshSession = useCallback(() => {
    if (state.isAuthenticated) {
      dispatch({ type: 'REFRESH_SESSION' });
    }
  }, [state.isAuthenticated]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    ...state,
    login,
    logout,
    refreshSession,
    clearError,
    isLockedOut,
    getRemainingLockoutTime,
    config: AUTH_CONFIG,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export { AUTH_CONFIG };
