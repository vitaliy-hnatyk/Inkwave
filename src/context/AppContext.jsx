import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, setState] = useState({
    loading: false,
    currentTool: null,
    selectedElements: [],
    canvasData: null,
    clipartList: [],
    overlaysList: [],
    templatesList: []
  });

  const value = {
    state,
    setState,
    // Add your methods here
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;