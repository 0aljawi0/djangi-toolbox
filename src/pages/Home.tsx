import { motion } from "motion/react";
import {
    ArrowUpRight,
    CheckCircle2,
    Command,
    FileCode2,
    Sparkles,
    Zap,
} from "lucide-react";
import logoUrl from "../assets/logo.png";
import type { PageKey } from "../types";

type Props = {
    onNavigate: (key: PageKey) => void;
};

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item = {
    hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.5, ease: [0.2, 0, 0, 1] as const },
    },
};

export function Home({ onNavigate }: Props) {
    return (
        <div className="relative h-full overflow-auto">
            {/* ---------- Ambient blobs ---------- */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="blob blob-a"
                    style={{
                        width: 420,
                        height: 420,
                        top: -120,
                        left: -80,
                        background: "var(--md-primary)",
                    }}
                />
                <div
                    className="blob blob-b"
                    style={{
                        width: 380,
                        height: 380,
                        top: 120,
                        right: -120,
                        background: "var(--md-tertiary)",
                    }}
                />
                <div
                    className="blob blob-c"
                    style={{
                        width: 320,
                        height: 320,
                        bottom: -100,
                        left: "35%",
                        background: "var(--md-secondary)",
                    }}
                />
            </div>

            {/* ---------- Content ---------- */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 mx-auto flex min-h-full max-w-5xl flex-col px-8 py-12"
            >
                {/* ============ HERO ============ */}
                <motion.section
                    variants={item}
                    className="flex flex-col items-center text-center"
                >
                    {/* Logo with glow ring */}
                    <div className="relative mb-6 grid h-24 w-24 place-items-center">
                        <span
                            aria-hidden
                            className="hero-glow absolute inset-0 rounded-md-xl"
                            style={{ background: "var(--md-primary)", filter: "blur(28px)" }}
                        />
                        <div className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-md-xl bg-md-primary-container shadow-lg">
                            <img
                                src={logoUrl}
                                alt=""
                                draggable={false}
                                className="h-12 w-12 object-contain"
                            />
                        </div>
                    </div>

                    <h1 className="text-5xl font-medium tracking-tight text-md-on-surface">
                        Djangi Toolbox
                    </h1>
                    <p className="mt-3 max-w-md text-base text-md-on-surface-variant">
                        A focused workspace for the tools you actually use. Fast, quiet,
                        offline.
                    </p>
                </motion.section>

                {/* ============ BENTO GRID ============ */}
                <motion.section
                    variants={item}
                    className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3"
                >
                    {/* ---------- Big feature: CodeZipper ---------- */}
                    <button
                        onClick={() => onNavigate("zip")}
                        className="group relative col-span-1 overflow-hidden rounded-md-xl border border-md-outline-variant bg-md-surface-container p-6 text-left transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:-translate-y-0.5 hover:border-md-primary/40 hover:md-elev-2 md:col-span-2"
                    >
                        {/* gradient sheen */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-45"
                            style={{ background: "var(--md-primary)" }}
                        />

                        <div className="relative flex items-start justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-md-md bg-md-primary text-md-on-primary">
                                <FileCode2 size={22} />
                            </div>
                            <ArrowUpRight
                                size={18}
                                className="text-md-on-surface-variant transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-md-primary"
                            />
                        </div>

                        <h3 className="relative mt-6 text-xl font-medium text-md-on-surface">
                            CodeZipper
                        </h3>
                        <p className="relative mt-1.5 max-w-md text-sm text-md-on-surface-variant">
                            Collect source files and folders, then export them into a single
                            PDF with line numbers and file headers. Skip build artefacts and
                            IDE clutter automatically.
                        </p>

                        {/* Mini "file list → PDF" visual */}
                        <div className="relative mt-6 space-y-1.5">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.75, duration: 0.4 }}
                                className="flex items-center justify-center gap-2 pt-1 text-[11px] text-md-on-surface-variant"
                            >
                                <span className="h-px w-6 bg-md-outline-variant" />
                                exported to PDF
                                <span className="h-px w-6 bg-md-outline-variant" />
                            </motion.div>
                        </div>
                    </button>

                    {/* ---------- System status ---------- */}
                    <div className="relative overflow-hidden rounded-md-xl border border-md-outline-variant bg-md-surface-container p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-md-md bg-md-tertiary-container text-md-on-primary-container">
                                <Zap size={20} />
                            </div>
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-md-primary opacity-60" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-md-primary" />
                            </span>
                        </div>

                        <h3 className="mt-6 text-base font-medium text-md-on-surface">
                            System status
                        </h3>
                        <p className="mt-1 text-xs text-md-on-surface-variant">
                            Everything is running smoothly.
                        </p>

                        <ul className="mt-5 space-y-2.5 text-sm">
                            {["PDF engine", "File scanner", "Settings store"].map((s) => (
                                <li key={s} className="flex items-center gap-2.5 text-md-on-surface">
                                    <CheckCircle2 size={15} className="shrink-0 text-md-primary" />
                                    <span className="text-xs">{s}</span>
                                    <span className="ml-auto text-[10px] uppercase tracking-wide text-md-on-surface-variant">
                                        ok
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ---------- Shortcuts ---------- */}
                    <div className="relative overflow-hidden rounded-md-xl border border-md-outline-variant bg-md-surface-container p-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-md-md bg-md-secondary-container text-md-on-secondary-container">
                            <Command size={20} />
                        </div>
                        <h3 className="mt-6 text-base font-medium text-md-on-surface">
                            Shortcuts
                        </h3>
                        <ul className="mt-4 space-y-2.5 text-xs text-md-on-surface-variant">
                            {[
                                { k: "Ctrl+R", a: "Reload" },
                                { k: "F12", a: "DevTools" },
                                { k: "Esc", a: "Close dialog" },
                            ].map((s) => (
                                <li key={s.k} className="flex items-center justify-between">
                                    <span>{s.a}</span>
                                    <kbd className="rounded-md-xs border border-md-outline-variant bg-md-surface px-2 py-0.5 font-mono text-[10px] text-md-on-surface">
                                        {s.k}
                                    </kbd>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ---------- Tips ---------- */}
                    <div className="relative overflow-hidden rounded-md-xl border border-md-outline-variant bg-md-surface-container p-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-md-md bg-md-primary-container text-md-on-primary-container">
                            <Sparkles size={20} />
                        </div>
                        <h3 className="mt-6 text-base font-medium text-md-on-surface">
                            Pro tip
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-md-on-surface-variant">
                            Tune <span className="font-medium text-md-on-surface">CodeZipper settings</span> per
                            project — the excluded folders and included extensions are
                            remembered separately from your file queue.
                        </p>
                    </div>

                    {/* ---------- About ---------- */}
                    <div className="relative overflow-hidden rounded-md-xl border border-md-outline-variant bg-md-surface-container p-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-md-md bg-md-surface-container-high text-md-on-surface-variant">
                            <img src={logoUrl} alt="" className="h-6 w-6 object-contain" />
                        </div>
                        <h3 className="mt-6 text-base font-medium text-md-on-surface">
                            About
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-md-on-surface-variant">
                            Built with <span className="text-md-on-surface">Tauri 2</span>,{" "}
                            <span className="text-md-on-surface">React</span>, and{" "}
                            <span className="text-md-on-surface">Tailwind v4</span>. Local-first,
                            no telemetry, your files never leave the machine.
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-wide text-md-on-surface-variant">
                            <span className="rounded-md-xs bg-md-surface-container-high px-2 py-1">v0.1.0</span>
                            <span className="rounded-md-xs bg-md-surface-container-high px-2 py-1">offline</span>
                        </div>
                    </div>
                </motion.section>

                <div className="h-10" />
            </motion.div>
        </div>
    );
}