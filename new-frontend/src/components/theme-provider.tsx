"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light"; // Only light theme supported

type ThemeProviderProps = {
    children: React.ReactNode;
    // defaultTheme removed, always light
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: "light",
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    storageKey = "vite-ui-theme",
    ...props
}: ThemeProviderProps) {
    // Force light theme, ignore any stored value
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("dark");
        root.classList.add("light");
    }, []);

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            // No-op, keep light theme
            setTheme(theme);
        },
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);
    if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};
