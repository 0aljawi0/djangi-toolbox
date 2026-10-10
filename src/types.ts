export type FileEntry = {
	path: string;
	name: string;
	size: number;
};

export type LogLevel = "INFO" | "WARN" | "ERROR";

export type LogEntry = {
	id: number;
	time: string;
	level: LogLevel;
	message: string;
};

export type PageKey = "home" | "zip";

export const formatSize = (bytes: number) => {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export type ScanSettings = {
	useRecommendedFolders: boolean;
	useRecommendedExtensions: boolean;
	extraExcludedFolders: string[];
	extraIncludedExtensions: string[];
};

export type RecommendedScanSettings = {
	folders: string[];
	extensions: string[];
};

export const DEFAULT_SCAN_SETTINGS: ScanSettings = {
	useRecommendedFolders: true,
	useRecommendedExtensions: true,
	extraExcludedFolders: [],
	extraIncludedExtensions: [],
};