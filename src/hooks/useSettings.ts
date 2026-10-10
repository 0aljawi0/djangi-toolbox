import { useEffect, useState } from "react";
import {
    DEFAULT_SCAN_SETTINGS,
    type ScanSettings,
} from "../types";

const STORAGE_KEY = "djangi.scanSettings";

function load(): ScanSettings {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_SCAN_SETTINGS;
        const parsed = JSON.parse(raw) as Partial<ScanSettings>;
        return { ...DEFAULT_SCAN_SETTINGS, ...parsed };
    } catch {
        return DEFAULT_SCAN_SETTINGS;
    }
}

export function useSettings() {
    const [settings, setSettings] = useState<ScanSettings>(load);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }, [settings]);

    const reset = () => setSettings(DEFAULT_SCAN_SETTINGS);

    /** True when the user has changed anything from the defaults. */
    const isCustomized =
        !settings.useRecommendedFolders ||
        !settings.useRecommendedExtensions ||
        settings.extraExcludedFolders.length > 0 ||
        settings.extraIncludedExtensions.length > 0;

    return { settings, setSettings, reset, isCustomized };
}