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
  console.log(" node env=", process.env.NODE_ENV)
  //REACT_APP_API_ROOT
  console.log("RootUrlProvider process.env.REACT_APP_API_ROOT=", process.env.REACT_APP_API_ROOT)
  let rootUrl: string;
  if (process.env.NODE_ENV === 'production') {
    rootUrl = process.env.REACT_APP_API_ROOT || ''; // Replace with your production API URL
  } else {
    rootUrl = 'http://localhost:5002'; // Replace with your development API URL
  }
  //const rootUrl = process.env.REACT_APP_API_ROOT || 'http://localhost:5002';

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