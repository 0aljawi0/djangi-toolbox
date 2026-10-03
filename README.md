# Djangit Toolbox

A cyberpunk-themed Avalonia desktop toolbox for developers.  
The first module, **CodeZipper**, collects source files/folders and exports them into a single PDF with line numbers and file headers.

<img width="1100" height="800" alt="Screenshot 2026-10-03 235733" src="https://github.com/user-attachments/assets/0947b4f8-574b-4333-8a94-c76c973469ac" />
<img width="1100" height="800" alt="Screenshot 2026-10-03 235720" src="https://github.com/user-attachments/assets/ff5b58a2-06a3-485d-9905-66a9ab4bef11" />
<img width="1100" height="800" alt="Screenshot 2026-10-03 235713" src="https://github.com/user-attachments/assets/6f16fcdd-9cef-467a-af22-31cfff292bb4" />

## Features

- Cyberpunk UI theme with custom window chrome, glitch buttons, boot overlay, and dissolve page transitions.
- **CodeZipper** module:
  - Add individual source files or entire folders.
  - Filters by common code extensions (`.cs`, `.xaml`, `.json`, `.md`, etc.).
  - Skips build/IDE folders like `bin`, `obj`, `.git`, `node_modules`, etc.
  - Generates a single PDF with line numbers, file paths, and page numbers.
- MVVM architecture using `CommunityToolkit.Mvvm`.
- PDF generation using [QuestPDF](https://www.questpdf.com/).
- Portable publish support (self-contained / single-file).

## Tech Stack

- .NET 10
- Avalonia UI
- CommunityToolkit.Mvvm
- QuestPDF
- JetBrains Mono font

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- Windows is the primary target. Avalonia is cross-platform, but the custom title bar and resize grips are Windows-oriented.

### Clone and Run

```bash
git clone <your-repo-url>
cd Djangitoolbox
dotnet restore
dotnet run
