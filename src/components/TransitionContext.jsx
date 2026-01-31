import { createContext, useContext, useState } from 'react';

const TransitionContext = createContext(null);

export function TransitionProvider({ children }) {
  const [transitioning, setTransitioning] = useState(false);
  const [nextPath, setNextPath] = useState(null);

  const startTransition = (path) => {
    setNextPath(path);
    setTransitioning(true);
  };

  const endTransition = () => {
    setTransitioning(false);
    setNextPath(null);
  };

  return (
    <TransitionContext.Provider value={{ transitioning, nextPath, startTransition, endTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) throw new Error('useTransition must be used within TransitionProvider');
  return context;
}