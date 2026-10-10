import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
    Home,
    FileCode2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import logoUrl from "../assets/logo.png";
import type { PageKey } from "../types";

type Item = { key: PageKey; label: string; icon: React.ReactNode };

const ITEMS: Item[] = [
    { key: "home", label: "Home", icon: <Home size={18} /> },
    { key: "zip", label: "CodeZipper", icon: <FileCode2 size={18} /> },
];

type Props = {
    active: PageKey;
    onChange: (k: PageKey) => void;
};

const EASE = [0.2, 0, 0, 1] as const;
const STORAGE_KEY = "djangi.sidebar.collapsed";

export function Sidebar({ active, onChange }: Props) {
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem(STORAGE_KEY) === "true";
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, String(collapsed));
    }, [collapsed]);

    return (
        <motion.nav
            animate={{ width: collapsed ? 80 : 240 }}
            initial={false}
            transition={{ duration: 0.28, ease: EASE }}
            className={[
                "glass",
                "flex h-full shrink-0 flex-col overflow-hidden",
                "border-r",
                "relative",
            ].join(" ")}
        >
            {/* Vertical sheen overlay — gives the glass its "reflective" quality */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.04) 100%)",
                }}
            />
            {/* ============ Header (aligns with titlebar height) ============ */}
            <div
                data-tauri-drag-region
                className="flex h-12 shrink-0 items-center justify-between px-3"
            >
                {/* Left: logo + (name when expanded) */}
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-md-sm bg-md-primary">
                        <img
                            src={logoUrl}
                            alt=""
                            draggable={false}
                            className="h-full w-full object-contain p-0.5"
                        />
                    </div>

                    <AnimatePresence initial={false} mode="popLayout">
                        {!collapsed && (
                            <motion.span
                                key="app-name"
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -6 }}
                                transition={{ duration: 0.2, ease: EASE }}
                                className="truncate whitespace-nowrap text-sm font-medium text-md-on-surface"
                            >
                                Djangi Toolbox
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: collapse toggle (icon only) */}
                <button
                    type="button"
                    onClick={() => setCollapsed((c) => !c)}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-md-sm text-md-on-surface-variant transition-colors duration-200 hover:bg-md-on-surface/8 active:bg-md-on-surface/12"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={collapsed ? "expand" : "collapse"}
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            transition={{ duration: 0.15, ease: EASE }}
                            className="grid place-items-center"
                        >
                            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </motion.span>
                    </AnimatePresence>
                </button>
            </div>

            {/* ============ Nav items ============ */}
            <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden px-3 pt-2">
                {ITEMS.map((item) => {
                    const isActive = active === item.key;
                    return (
                        <button
                            key={item.key}
                            onClick={() => onChange(item.key)}
                            title={collapsed ? item.label : undefined}
                            className={[
                                "group relative flex items-center gap-3 rounded-md-xl py-2.5 text-sm font-medium",
                                "transition-colors duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                                collapsed ? "justify-center px-0" : "px-3",
                                isActive
                                    ? "bg-md-secondary-container text-md-on-secondary-container"
                                    : "text-md-on-surface-variant hover:bg-md-on-surface/8",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                        >
                            <span className="shrink-0">{item.icon}</span>

                            <AnimatePresence initial={false} mode="popLayout">
                                {!collapsed && (
                                    <motion.span
                                        key="label"
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -6 }}
                                        transition={{ duration: 0.2, ease: EASE }}
                                        className="whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    );
                })}
            </div>
        </motion.nav>
    );
}