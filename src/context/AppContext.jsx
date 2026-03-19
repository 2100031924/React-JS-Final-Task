import { createContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  isLoading: false,
  isCartOpen: false,
  searchQuery: '',
  selectedCategory: 'all',
  notifications: []
};

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('appState');
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  });

  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  const setLoading = useCallback((isLoading) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const toggleCart = useCallback(() => {
    setState(prev => ({ ...prev, isCartOpen: !prev.isCartOpen }));
  }, []);

  const setSearchQuery = useCallback((searchQuery) => {
    setState(prev => ({ ...prev, searchQuery }));
  }, []);

  const setSelectedCategory = useCallback((selectedCategory) => {
    setState(prev => ({ ...prev, selectedCategory }));
  }, []);

  const addNotification = useCallback((message, type = 'success') => {
    const id = Date.now();
    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, { id, message, type }]
    }));
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.filter(n => n.id !== id)
      }));
    }, 3000);
  }, []);

  const value = {
    ...state,
    setLoading,
    toggleCart,
    setSearchQuery,
    setSelectedCategory,
    addNotification
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export { AppContext };
