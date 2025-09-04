import React, { createContext, useContext, ReactNode } from 'react';

// Define the context type
interface RootUrlContextType {
  rootUrl: string;
}

// Create the context
const RootUrlContext = createContext<RootUrlContextType | undefined>(undefined);

// Create the provider component
interface RootUrlProviderProps {
  children: ReactNode;
}

export const RootUrlProvider: React.FC<RootUrlProviderProps> = ({ children }) => {
  // Define the root URL (you can modify this as needed)
  const rootUrl = process.env.REACT_APP_API_ROOT || 'http://localhost:5002';

  return (
    <RootUrlContext.Provider value={{ rootUrl }}>
      {children}
    </RootUrlContext.Provider>
  );
};

// Create a custom hook to use the RootUrlContext
export const useRootUrl = (): RootUrlContextType => {
  const context = useContext(RootUrlContext);
  if (!context) {
    throw new Error('useRootUrl must be used within a RootUrlProvider');
  }
  return context;
};