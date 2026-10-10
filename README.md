<div align="center">

# Djangi Toolbox

**A focused, offline-first developer toolbox with a Material You interface.**

Collect source code, export to PDF, and stop alt-tabbing to random web tools.

[![Tauri](https://img.shields.io/badge/Tauri-2.x-24C8DB?logo=tauri&logoColor=white)](https://tauri.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

---

## Overview

**Djangi Toolbox** is a lightweight desktop app built for developers who want quick, deterministic utilities without leaving their machine. The first module, **CodeZipper**, walks a directory tree, filters out build artefacts and IDE clutter, and stitches every remaining source file into a single, well-formatted PDF — perfect for code reviews, documentation, or handing a snapshot to a client or teammate.

Everything runs locally. No telemetry. No cloud. No login.

---

## Screenshots

<img width="1202" height="802" alt="image" src="https://github.com/user-attachments/assets/ac720a83-48e4-466a-a75b-1cce1fa3b864" />


## Features

### 📦 CodeZipper

- Add individual files **or** entire folders
- **Skip rules** for build, cache, and IDE folders (`bin`, `node_modules`, `.git`, `target`, …)
- **Extension whitelist** covering 100+ source / config / doc formats
- **Custom rules** — add your own excluded folders and included extensions in Settings
- **Line-numbered PDF export** with file headers, page numbers, and monospace formatting

### ⚙️ Under the hood

- **Rust-powered** file scanner (`walkdir`) and PDF generator (`printpdf`)
- **Portable mode** — settings live next to the `.exe`, nothing written to `AppData`
- **Offline-first** — no network access required at runtime
- **Cross-platform** — Windows, macOS, Linux (Windows is the primary target)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Desktop shell** | [Tauri 2](https://tauri.app) |
| **Frontend** | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + Material 3 design tokens |
| **Animation** | [Motion](https://motion.dev) (formerly Framer Motion) |
| **Icons** | [Lucide](https://lucide.dev) |
| **Bundler** | [Vite](https://vitejs.dev) |
| **Backend** | Rust — `walkdir`, `printpdf`, `serde` |
| **File dialogs** | `@tauri-apps/plugin-dialog` |

---

## Prerequisites

Before you begin, install:

- **[Rust](https://rustup.rs)** — 1.77 or later
- **[Node.js](https://nodejs.org)** — 20 or later
- **[pnpm](https://pnpm.io)** — recommended (`npm i -g pnpm`)
- **Windows:** [MSVC Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) + [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/) (pre-installed on Windows 11)
- **macOS:** Xcode Command Line Tools (`xcode-select --install`)
- **Linux:** `webkit2gtk-4.1`, `libappindicator3-dev`, `librsvg2-dev`, `build-essential`

Verify:

```bash
rustc --version
node --version
pnpm --version
