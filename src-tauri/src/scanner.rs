use serde::{Deserialize, Serialize};
use std::path::Path;
use walkdir::WalkDir;

// ---------------------------------------------------------------------------
// Models
// ---------------------------------------------------------------------------

#[derive(Serialize, Clone)]
pub struct FileEntry {
    pub path: String,
    pub name: String,
    pub size: u64,
}

#[derive(Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ScanOptions {
    #[serde(default)]
    pub use_recommended_folders: bool,
    #[serde(default)]
    pub use_recommended_extensions: bool,
    #[serde(default)]
    pub extra_excluded_folders: Vec<String>,
    #[serde(default)]
    pub extra_included_extensions: Vec<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RecommendedScanSettings {
    pub folders: Vec<String>,
    pub extensions: Vec<String>,
}

// ---------------------------------------------------------------------------
// Recommended lists (single source of truth)
// ---------------------------------------------------------------------------

const RECOMMENDED_FOLDERS: &[&str] = &[
    // Build output / caches
    "bin",
    "obj",
    "dist",
    "build",
    "out",
    "target",
    "coverage",
    ".cache",
    ".parcel-cache",
    ".turbo",
    ".next",
    ".nuxt",
    ".svelte-kit",
    "release",
    "debug",
    // Version control / IDE
    ".git",
    ".svn",
    ".hg",
    ".vs",
    ".vscode",
    ".idea",
    // Package managers
    "node_modules",
    "packages",
    "vendor",
    ".pnpm-store",
    ".yarn",
    // Python
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
    "venv",
    ".venv",
    "env",
    ".tox",
    "site-packages",
    "*.egg-info",
    // JVM
    ".gradle",
    ".mvn",
    "*.iml",
    // Misc
    "*.log",
    ".terraform",
    ".serverless",
    "tmp",
    "temp",
];

const RECOMMENDED_EXTENSIONS: &[&str] = &[
    // .NET / XAML
    "cs",
    "xaml",
    "axaml",
    "fs",
    "fsx",
    "vb",
    "csproj",
    "fsproj",
    "vbproj",
    "sln",
    "props",
    "targets",
    // Web
    "html",
    "htm",
    "css",
    "scss",
    "sass",
    "less",
    "js",
    "jsx",
    "mjs",
    "cjs",
    "ts",
    "tsx",
    "mts",
    "cts",
    "vue",
    "svelte",
    "astro",
    // Other languages
    "java",
    "kt",
    "kts",
    "scala",
    "go",
    "rs",
    "c",
    "cpp",
    "cc",
    "cxx",
    "h",
    "hpp",
    "hh",
    "py",
    "rb",
    "php",
    "pl",
    "lua",
    "dart",
    "swift",
    "m",
    "mm",
    // Shell
    "sh",
    "bash",
    "zsh",
    "fish",
    "ps1",
    "psm1",
    "bat",
    "cmd",
    // Config / data
    "json",
    "jsonc",
    "json5",
    "yaml",
    "yml",
    "toml",
    "ini",
    "config",
    "xml",
    "env",
    "properties",
    "gradle",
    // Docs
    "md",
    "mdx",
    "rst",
    "txt",
    "adoc",
    // Data / query
    "sql",
    "prisma",
    "graphql",
    "gql",
    "proto",
    // Templates
    "hbs",
    "handlebars",
    "ejs",
    "pug",
    "mustache",
    "liquid",
    "jinja",
    "jinja2",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fn normalize_ext(s: &str) -> String {
    s.trim().trim_start_matches('.').to_lowercase()
}

fn entry_for(path: &Path) -> Option<FileEntry> {
    let meta = std::fs::metadata(path).ok()?;
    Some(FileEntry {
        path: path.to_string_lossy().to_string(),
        name: path.file_name()?.to_string_lossy().to_string(),
        size: meta.len(),
    })
}

fn build_skip_list(opts: &ScanOptions) -> Vec<String> {
    let mut out: Vec<String> = Vec::new();
    if opts.use_recommended_folders {
        out.extend(RECOMMENDED_FOLDERS.iter().map(|s| s.to_string()));
    }
    out.extend(
        opts.extra_excluded_folders
            .iter()
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty()),
    );
    out.iter().map(|s| s.to_lowercase()).collect()
}

fn build_ext_list(opts: &ScanOptions) -> Vec<String> {
    let mut out: Vec<String> = Vec::new();
    if opts.use_recommended_extensions {
        out.extend(RECOMMENDED_EXTENSIONS.iter().map(|s| s.to_string()));
    }
    out.extend(
        opts.extra_included_extensions
            .iter()
            .map(|s| normalize_ext(s))
            .filter(|s| !s.is_empty()),
    );
    out
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

#[tauri::command]
pub fn get_recommended_scan_settings() -> RecommendedScanSettings {
    RecommendedScanSettings {
        folders: RECOMMENDED_FOLDERS.iter().map(|s| s.to_string()).collect(),
        extensions: RECOMMENDED_EXTENSIONS
            .iter()
            .map(|s| s.to_string())
            .collect(),
    }
}

#[tauri::command]
pub fn scan_folder(root: String, options: Option<ScanOptions>) -> Vec<FileEntry> {
    let opts = options.unwrap_or(ScanOptions {
        use_recommended_folders: true,
        use_recommended_extensions: true,
        ..Default::default()
    });

    let skip = build_skip_list(&opts);
    let exts = build_ext_list(&opts);

    let mut out = Vec::new();

    for entry in WalkDir::new(&root).into_iter().filter_entry(|e| {
        if !e.file_type().is_dir() {
            return true;
        }
        let name = e.file_name().to_string_lossy().to_lowercase();
        !skip.iter().any(|s| {
            // Support simple glob patterns like "*.egg-info"
            if let Some(suffix) = s.strip_prefix('*') {
                name.ends_with(suffix)
            } else {
                name == *s
            }
        })
    }) {
        let Ok(e) = entry else { continue };
        if !e.file_type().is_file() {
            continue;
        }

        let ext = e
            .path()
            .extension()
            .and_then(|s| s.to_str())
            .map(normalize_ext)
            .unwrap_or_default();

        if !exts.iter().any(|c| c == &ext) {
            continue;
        }

        if let Some(fe) = entry_for(e.path()) {
            out.push(fe);
        }
    }

    out
}

#[tauri::command]
pub fn file_entry(path: String) -> Option<FileEntry> {
    entry_for(Path::new(&path))
}
