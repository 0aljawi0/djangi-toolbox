import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { invoke } from "@tauri-apps/api/core";
import { RotateCcw, X } from "lucide-react";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { Switch } from "./Switch";
import { ChipInput } from "./ChipInput";
import type { RecommendedScanSettings, ScanSettings } from "../types";

type Props = {
    open: boolean;
    settings: ScanSettings;
    onClose: () => void;
    onSave: (next: ScanSettings) => void;
    onReset: () => void;
};

const EASE = [0.2, 0, 0, 1] as const;

export function SettingsDialog({
    open,
    settings,
    onClose,
    onSave,
    onReset,
}: Props) {
    const [draft, setDraft] = useState<ScanSettings>(settings);
    const [recommended, setRecommended] = useState<RecommendedScanSettings>({
        folders: [],
        extensions: [],
    });

    // Re-sync the draft whenever the dialog is (re)opened
    useEffect(() => {
        if (open) setDraft(settings);
    }, [open, settings]);

    // Load recommended lists once (from Rust)
    useEffect(() => {
        invoke<RecommendedScanSettings>("get_recommended_scan_settings")
            .then(setRecommended)
            .catch(() => { });
    }, []);

    // Esc to close
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="settings-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: EASE }}
                    className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
                    onClick={onClose}
                >
                    <motion.div
                        key="settings-panel"
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: 8 }}
                        transition={{ duration: 0.28, ease: EASE }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex max-h-[85vh] w-[680px] max-w-[92vw] flex-col overflow-hidden rounded-md-xl bg-md-surface-container md-elev-3"
                    >
                        {/* Header */}
                        <header className="flex items-center justify-between px-6 pt-5 pb-3">
                            <div>
                                <h2 className="text-lg font-medium text-md-on-surface">
                                    CodeZipper settings
                                </h2>
                                <p className="text-xs text-md-on-surface-variant">
                                    Applied to folder scans. Existing queue is not affected.
                                </p>
                            </div>
                            <IconButton onClick={onClose} aria-label="Close">
                                <X size={18} />
                            </IconButton>
                        </header>

                        {/* Body */}
                        <div className="min-h-0 flex-1 space-y-6 overflow-auto px-6 pb-2">
                            {/* ---------- Excluded folders ---------- */}
                            <section className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-md-on-surface">
                                            Excluded folders
                                        </h3>
                                        <p className="text-xs text-md-on-surface-variant">
                                            Skipped during directory traversal.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={draft.useRecommendedFolders}
                                        onChange={(v) =>
                                            setDraft((d) => ({ ...d, useRecommendedFolders: v }))
                                        }
                                    />
                                </div>

                                <AnimatePresence initial={false}>
                                    {draft.useRecommendedFolders &&
                                        recommended.folders.length > 0 && (
                                            <motion.div
                                                key="folders-panel"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.28, ease: EASE }}
                                                style={{ overflow: "hidden" }}
                                            >
                                                <div className="flex flex-wrap gap-1.5 rounded-md-md bg-md-surface-container-high p-3">
                                                    {recommended.folders.map((f, i) => (
                                                        <motion.span
                                                            key={f}
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{
                                                                duration: 0.2,
                                                                delay: i * 0.004,
                                                                ease: EASE,
                                                            }}
                                                            className="rounded-md-sm bg-md-surface px-2 py-0.5 text-[11px] text-md-on-surface-variant"
                                                        >
                                                            {f}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                </AnimatePresence>

                                <ChipInput
                                    mode="folder"
                                    values={draft.extraExcludedFolders}
                                    onChange={(v) =>
                                        setDraft((d) => ({ ...d, extraExcludedFolders: v }))
                                    }
                                    placeholder="Add folder name — e.g. coverage, .terraform"
                                    helperText="Press Enter or comma to add. Wildcards like *.egg-info are supported."
                                />
                            </section>

                            {/* ---------- Included extensions ---------- */}
                            <section className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-md-on-surface">
                                            Included file types
                                        </h3>
                                        <p className="text-xs text-md-on-surface-variant">
                                            Only files with these extensions will be queued.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={draft.useRecommendedExtensions}
                                        onChange={(v) =>
                                            setDraft((d) => ({ ...d, useRecommendedExtensions: v }))
                                        }
                                    />
                                </div>

                                <AnimatePresence initial={false}>
                                    {draft.useRecommendedExtensions &&
                                        recommended.extensions.length > 0 && (
                                            <motion.div
                                                key="extensions-panel"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.28, ease: EASE }}
                                                style={{ overflow: "hidden" }}
                                            >
                                                <div className="flex flex-wrap gap-1.5 rounded-md-md bg-md-surface-container-high p-3">
                                                    {recommended.extensions.map((e, i) => (
                                                        <motion.span
                                                            key={e}
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{
                                                                duration: 0.2,
                                                                delay: i * 0.002,
                                                                ease: EASE,
                                                            }}
                                                            className="rounded-md-sm bg-md-surface px-2 py-0.5 font-mono text-[11px] text-md-on-surface-variant"
                                                        >
                                                            .{e}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                </AnimatePresence>

                                <ChipInput
                                    mode="extension"
                                    values={draft.extraIncludedExtensions}
                                    onChange={(v) =>
                                        setDraft((d) => ({ ...d, extraIncludedExtensions: v }))
                                    }
                                    placeholder="Add extension — e.g. ex, exs, pas"
                                    helperText="Case-insensitive. Leading dots are stripped automatically."
                                />
                            </section>
                        </div>

                        {/* Footer */}
                        <footer className="flex items-center justify-between gap-3 border-t border-md-outline-variant px-6 py-4">
                            <Button
                                variant="text"
                                icon={<RotateCcw size={16} />}
                                onClick={() => {
                                    onReset();
                                    setDraft({
                                        useRecommendedFolders: true,
                                        useRecommendedExtensions: true,
                                        extraExcludedFolders: [],
                                        extraIncludedExtensions: [],
                                    });
                                }}
                            >
                                Reset
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="text" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="filled"
                                    onClick={() => {
                                        onSave(draft);
                                        onClose();
                                    }}
                                >
                                    Save
                                </Button>
                            </div>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}