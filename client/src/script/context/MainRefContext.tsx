import React, {
  createContext,
  useRef,
  useContext,
  ReactNode,
  useEffect,
} from "react";

// Define the context type
interface MainRefContextType {
  current: HTMLElement | null;
}

const MainRefContext = createContext<MainRefContextType | null>(null);

export const MainRefProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const mainRef = useRef<HTMLElement | null>(null);

  return (
    <MainRefContext.Provider value={mainRef}>
      {children}
    </MainRefContext.Provider>
  );
};

export function useMainRef(): MainRefContextType {
  const context = useContext(MainRefContext);
  if (!context) {
    throw new Error("useMainRef must be used within a MainRefProvider");
  }
  return context;
}

export function useScrollToMain() {
  const mainRef = useMainRef();

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mainRef]);
}
