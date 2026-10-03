# Djangit Toolbox

A cyberpunk-themed Avalonia desktop toolbox for developers.  
The first module, **CodeZipper**, collects source files/folders and exports them into a single PDF with line numbers and file headers.

![Djangit Toolbox](https://via.placeholder.com/1100x700/0A0E14/FCE22A?text=DJANGI+TOOLBOX)

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