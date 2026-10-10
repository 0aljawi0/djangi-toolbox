import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X, Sun, Moon, Monitor } from "lucide-react";
import { IconButton } from "./IconButton";
import { useTheme } from "../hooks/useTheme";

const win = getCurrentWindow();

export function TitleBar() {
    const { mode, cycle } = useTheme();

    const Icon = mode === "light" ? Sun : mode === "dark" ? Moon : Monitor;
    const label =
        mode === "light"
            ? "Light theme"
            : mode === "dark"
                ? "Dark theme"
                : "System theme";

    return (
        <header
            data-tauri-drag-region
            className="glass relative flex h-12 shrink-0 items-center justify-end border-b"
        >
            <div className="relative z-10 flex items-center pr-1">
                <IconButton onClick={cycle} aria-label={label} title={label}>
                    <Icon size={16} />
                </IconButton>
                <IconButton onClick={() => win.minimize()} aria-label="Minimize">
                    <Minus size={16} />
                </IconButton>
                <IconButton onClick={() => win.toggleMaximize()} aria-label="Maximize">
                    <Square size={14} />
                </IconButton>
                <IconButton
                    danger
                    onClick={() => win.close()}
                    aria-label="Close"
                    className="mr-1"
                >
                    <X size={16} />
                </IconButton>
            </div>
        </header>
    );
}