import { useState, type KeyboardEvent, type ClipboardEvent } from "react";
import { X } from "lucide-react";

type Props = {
    values: string[];
    onChange: (next: string[]) => void;
    placeholder?: string;
    /** Extension inputs get lowercased & dot-stripped; folders don't. */
    mode?: "extension" | "folder";
    /** Text shown inside the input as a helper hint. */
    helperText?: string;
};

function normalize(v: string, mode: "extension" | "folder") {
    const trimmed = v.trim();
    return mode === "extension"
        ? trimmed.replace(/^\.+/, "").toLowerCase()
        : trimmed;
}

export function ChipInput({
    values,
    onChange,
    placeholder = "Add…",
    mode = "folder",
    helperText,
}: Props) {
    const [draft, setDraft] = useState("");

    const commit = (raw: string) => {
        const parts = raw
            .split(/[,\n]/)
            .map((p) => normalize(p, mode))
            .filter(Boolean);
        if (parts.length === 0) return;
        const next = [...values];
        for (const p of parts) {
            if (!next.some((v) => v.toLowerCase() === p.toLowerCase())) next.push(p);
        }
        onChange(next);
        setDraft("");
    };

    const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit(draft);
        } else if (e.key === "Backspace" && draft === "" && values.length > 0) {
            onChange(values.slice(0, -1));
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData("text");
        if (/[,\n]/.test(text)) {
            e.preventDefault();
            commit(text);
        }
    };

    const remove = (v: string) => onChange(values.filter((x) => x !== v));

    return (
        <div className="rounded-md-md border border-md-outline-variant bg-md-surface-container-high p-2 transition-colors focus-within:border-md-primary">
            <div className="flex flex-wrap items-center gap-1.5">
                {values.map((v) => (
                    <span
                        key={v}
                        className="group inline-flex items-center gap-1 rounded-md-sm bg-md-secondary-container py-1 pl-3 pr-1.5 text-xs font-medium text-md-on-secondary-container"
                    >
                        {v}
                        <button
                            type="button"
                            onClick={() => remove(v)}
                            className="grid h-4 w-4 place-items-center rounded-full text-md-on-secondary-container transition-colors hover:bg-md-on-secondary-container/15"
                            aria-label={`Remove ${v}`}
                        >
                            <X size={10} />
                        </button>
                    </span>
                ))}
                <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKey}
                    onPaste={handlePaste}
                    onBlur={() => draft && commit(draft)}
                    placeholder={values.length === 0 ? placeholder : ""}
                    className="min-w-30 flex-1 bg-transparent px-2 py-1 text-sm text-md-on-surface outline-none placeholder:text-md-on-surface-variant"
                />
            </div>
            {helperText && (
                <p className="px-2 pt-1 text-[11px] text-md-on-surface-variant">{helperText}</p>
            )}
        </div>
    );
}