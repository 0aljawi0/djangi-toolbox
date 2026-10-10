import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "djangi.theme";

export function useTheme() {
    const [mode, setMode] = useState<ThemeMode>(() => {
        if (typeof window === "undefined") return "system";
        const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
        return saved ?? "system";
    });

    useEffect(() => {
        const root = document.documentElement;
        const mql = window.matchMedia("(prefers-color-scheme: dark)");

        const apply = () => {
            const isDark =
                mode === "dark" || (mode === "system" && mql.matches);
            root.classList.toggle("dark", isDark);
            // keep the native title bar / scrollbars in sync on Win/mac
            root.style.colorScheme = isDark ? "dark" : "light";
        };

        apply();
        localStorage.setItem(STORAGE_KEY, mode);

        // Only listen to system changes when in "system" mode
        if (mode === "system") {
            mql.addEventListener("change", apply);
            return () => mql.removeEventListener("change", apply);
        }
    }, [mode]);

    // Cycle light → dark → system
    const cycle = useCallback(() => {
        setMode((m) => (m === "light" ? "dark" : m === "dark" ? "system" : "light"));
    }, []);

    return { mode, setMode, cycle };
}