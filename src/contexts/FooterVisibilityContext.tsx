"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface FooterVisibilityContextType {
  isFooterVisible: boolean;
  setFooterVisible: (visible: boolean) => void;
}

const FooterVisibilityContext = createContext<
  FooterVisibilityContextType | undefined
>(undefined);

export const useFooterVisibility = () => {
  const context = useContext(FooterVisibilityContext);
  if (!context) {
    throw new Error(
      "useFooterVisibility must be used within FooterVisibilityProvider",
    );
  }
  return context;
};

export const FooterVisibilityProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isFooterVisible, setIsVisible] = useState(false);

  const setFooterVisible = useCallback((visible: boolean) => {
    setIsVisible(visible);
  }, []);

  return (
    <FooterVisibilityContext.Provider
      value={{ isFooterVisible, setFooterVisible }}
    >
      {children}
    </FooterVisibilityContext.Provider>
  );
};
