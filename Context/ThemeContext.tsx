'use client';
import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useMemo,
  useEffect,
} from "react";

type ThemeContextType = {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState<boolean>(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("isDark");
      if (stored !== null) {
        setIsDark(JSON.parse(stored));
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDark(prefersDark);
      }
    } catch {}
  }, []);

  // Apply theme
  useEffect(() => {
    localStorage.setItem("isDark", JSON.stringify(isDark));

    // THE FIX ❗⬇️  
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);

  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);

  const value = useMemo(() => ({ isDark, setIsDark, toggle }), [isDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
