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
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const toggle = () => setIsDark((p) => !p);
  const value = useMemo(() => ({ isDark, setIsDark, toggle }), [isDark]);

  // Initialize theme on mount
  useEffect(() => {
    const initializeTheme = () => {
      try {
        const stored = localStorage.getItem("isDark");
        if (stored !== null) {
          setIsDark(JSON.parse(stored));
        } else {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setIsDark(systemPrefersDark);
        }
      } catch {
        setIsDark(false);
      }
      requestAnimationFrame(() => setIsMounted(true));
    };

    // Run initialization
    initializeTheme();

    // Optional: Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("isDark")) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("isDark", JSON.stringify(isDark));
        document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
      } catch { }
    }
  }, [isDark, isMounted]);

  // Use a stable provider value and handle mounting in a way that doesn't break hook order
  return (
    <ThemeContext.Provider value={value}>
      <div style={{ visibility: isMounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
