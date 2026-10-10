import { useCallback, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import { motion, AnimatePresence } from "motion/react";
import {
    FilePlus2,
    FolderPlus,
    Play,
    Trash2,
    X,
    FileText,
    Terminal,
    Settings2
} from "lucide-react";
import { Button } from "../components/Button";
import { IconButton } from "../components/IconButton";
import { useLogs } from "../hooks/useLogs";
import { formatSize, type FileEntry, type LogLevel } from "../types";
import { useSettings } from "../hooks/useSettings";
import { SettingsDialog } from "../components/SettingsDialog";

export function CodeZipper() {
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [outputPath, setOutputPath] = useState("");
    const [busy, setBusy] = useState(false);
    const { logs, log } = useLogs(["// CodeZipper online — add files to begin"]);
    const logRef = useRef<HTMLDivElement>(null);
    const { settings, setSettings, reset, isCustomized } = useSettings();
    const [settingsOpen, setSettingsOpen] = useState(false);

    useEffect(() => {
        logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
    }, [logs]);

    const append = useCallback(
        (entries: FileEntry[]) => {
            setFiles((prev) => {
                const seen = new Set(prev.map((f) => f.path.toLowerCase()));
                const next = [...prev];
                for (const e of entries) {
                    if (!seen.has(e.path.toLowerCase())) {
                        next.push(e);
                        seen.add(e.path.toLowerCase());
                    }
                }
                return next;
            });
        },
        [],
    );

    const addFiles = async () => {
        try {
            const picked = await open({ multiple: true, title: "Select source files" });
            log(`// picker returned: ${Array.isArray(picked) ? `${picked.length} path(s)` : (picked ?? "(cancelled)")}`);
            if (!picked) return;
            const paths = Array.isArray(picked) ? picked : [picked];
            const entries: FileEntry[] = [];
            for (const p of paths) {
                const fe = await invoke<FileEntry | null>("file_entry", { path: p });
                if (fe) entries.push(fe);
            }
            append(entries);
            log(`// added ${entries.length} file(s)`);
        } catch (e) {
            log(`// picker error: ${String(e)}`, "ERROR");
        }
    };

    const addFolder = async () => {
        try {
            const picked = await open({ directory: true, title: "Select source folder" });
            if (!picked || Array.isArray(picked)) return;

            const entries = await invoke<FileEntry[]>("scan_folder", {
                root: picked,
                options: {
                    useRecommendedFolders: settings.useRecommendedFolders,
                    useRecommendedExtensions: settings.useRecommendedExtensions,
                    extraExcludedFolders: settings.extraExcludedFolders,
                    extraIncludedExtensions: settings.extraIncludedExtensions,
                },
            });

            if (
                !settings.useRecommendedExtensions &&
                settings.extraIncludedExtensions.length === 0
            ) {
                log("// no extensions selected — nothing will be scanned", "WARN");
            }

            append(entries);
            log(`// scanned folder — added ${entries.length} file(s)`);
        } catch (e) {
            log(`// folder error: ${String(e)}`, "ERROR");
        }
    };

    const removeFile = (entry: FileEntry) => {
        setFiles((prev) => prev.filter((f) => f.path !== entry.path));
        log("// file removed");
    };

    const clearAll = () => {
        setFiles([]);
        log("// queue cleared");
    };

    const pickOutput = async () => {
        try {
            const path = await save({
                title: "Save PDF as",
                defaultPath: "source-code.pdf",
                filters: [{ name: "PDF document", extensions: ["pdf"] }],
            });
            log(`// dialog returned: ${path ?? "(cancelled)"}`);
            if (!path) return;
            setOutputPath(path);
            log(`// output set → ${path}`);
        } catch (e) {
            log(`// dialog error: ${String(e)}`, "ERROR");
        }
    };

    const run = async () => {
        if (files.length === 0) return log("// queue is empty — add files first", "WARN");
        if (!outputPath) return log("// no output path — pick one first", "WARN");

        setBusy(true);
        log("// generating PDF…");
        try {
            await invoke("generate_pdf_cmd", {
                output: outputPath,
                files: files.map((f) => f.path),
            });
            log(`// PDF written: ${outputPath.split(/[\\/]/).pop()}`);
        } catch (e) {
            log(`// error: ${String(e)}`, "ERROR" as LogLevel);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="flex h-full flex-col gap-4 p-6 overflow-hidden">
            {/* --- Files panel --- */}
            <section className="flex min-h-0 flex-1 flex-col rounded-md-lg border border-md-outline-variant bg-md-surface-container">
                <div className="flex items-center justify-between border-b border-md-outline-variant px-5 py-3">
                    <h2 className="text-sm font-medium text-md-on-surface">
                        Source files
                        <span className="ml-2 text-md-on-surface-variant">
                            {files.length} queued
                        </span>
                    </h2>
                    <div className="flex gap-2">
                        <Button variant="tonal" icon={<FilePlus2 size={16} />} onClick={addFiles}>
                            Add files
                        </Button>
                        <Button variant="tonal" icon={<FolderPlus size={16} />} onClick={addFolder}>
                            Add folder
                        </Button>
                        <Button variant={isCustomized ? "filled" : "text"} icon={<Settings2 size={16} />} onClick={() => setSettingsOpen(true)}>
                            Settings{isCustomized ? " •" : ""}
                        </Button>
                        <Button
                            variant="text"
                            icon={<Trash2 size={16} />}
                            onClick={clearAll}
                            disabled={files.length === 0}
                        >
                            Clear
                        </Button>
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-auto">
                    {files.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-md-on-surface-variant">
                            <FileText size={40} className="mb-3 opacity-40" />
                            <p className="text-sm">No files yet — add some to begin</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-md-outline-variant">
                            <AnimatePresence initial={false}>
                                {files.map((f) => (
                                    <motion.li
                                        key={f.path}
                                        layout
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0, x: -20 }}
                                        transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                                        className="flex items-center gap-4 px-5 py-3 hover:bg-md-on-surface/4"
                                    >
                                        <FileText size={16} className="shrink-0 text-md-primary" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm text-md-on-surface">{f.name}</p>
                                            <p className="truncate text-xs text-md-on-surface-variant">
                                                {f.path}
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-xs text-md-on-surface-variant tabular-nums">
                                            {formatSize(f.size)}
                                        </span>
                                        <IconButton danger onClick={() => removeFile(f)} aria-label="Remove">
                                            <X size={14} />
                                        </IconButton>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ul>
                    )}
                </div>
            </section>

            {/* --- Output + Run --- */}
            <section className="flex shrink-0 items-center gap-4 rounded-md-lg border border-md-outline-variant bg-md-surface-container p-4">
                <span className="text-sm font-medium text-md-on-surface-variant">Output</span>
                <input
                    readOnly
                    value={outputPath}
                    placeholder="No output selected"
                    className="h-10 min-w-0 flex-1 rounded-md-sm border border-md-outline-variant bg-md-surface px-3 font-mono text-sm text-md-on-surface placeholder:text-md-on-surface-variant focus:outline-none focus:ring-2 focus:ring-md-primary"
                />
                <Button variant="tonal" onClick={pickOutput}>
                    Browse
                </Button>
                <Button
                    variant="filled"
                    icon={busy ? <Terminal size={16} /> : <Play size={16} />}
                    onClick={run}
                    disabled={busy}
                >
                    {busy ? "Running…" : "Run"}
                </Button>
            </section>

            {/* --- Log panel --- */}
            <section className="flex h-48 shrink-0 flex-col overflow-hidden rounded-md-lg border border-md-outline-variant bg-md-surface-container">
                <div className="border-b border-md-outline-variant px-5 py-2">
                    <h2 className="text-xs font-medium uppercase tracking-wider text-md-on-surface-variant">
                        Output log
                    </h2>
                </div>
                <div ref={logRef} className="min-h-0 flex-1 overflow-auto px-5 py-3 font-mono text-xs">
                    <AnimatePresence initial={false}>
                        {logs.map((l) => (
                            <motion.div
                                key={l.id}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                                className="flex gap-3 py-0.5"
                            >
                                <span className="text-md-on-surface-variant tabular-nums">{l.time}</span>
                                <span
                                    className={
                                        l.level === "ERROR"
                                            ? "text-md-error"
                                            : l.level === "WARN"
                                                ? "text-md-tertiary"
                                                : "text-md-primary"
                                    }
                                >
                                    {l.level.padEnd(5)}
                                </span>
                                <span className="text-md-on-surface">{l.message}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </section>

            <SettingsDialog
                open={settingsOpen}
                settings={settings}
                onClose={() => setSettingsOpen(false)}
                onSave={setSettings}
                onReset={reset}
            />
        </div>
    );
}