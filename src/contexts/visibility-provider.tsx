"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface VisibilityContextType {
  isVisible: boolean;
  setVisibility: (visible: boolean) => void;
}

const VisibilityContext = createContext<VisibilityContextType | undefined>(
  undefined,
);

export const useVisibility = () => {
  const context = useContext(VisibilityContext);
  if (!context) {
    throw new Error("useVisibility must be used within a VisibilityProvider");
  }
  return context;
};

export const VisibilityProvider = ({ children }: { children: ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  const setVisibility = useCallback((visible: boolean) => {
    setIsVisible(visible);
  }, []);

  return (
    <VisibilityContext.Provider value={{ isVisible, setVisibility }}>
      {children}
    </VisibilityContext.Provider>
  );
};
