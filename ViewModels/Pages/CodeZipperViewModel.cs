using System;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Avalonia.Platform.Storage;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using DjangiToolbox.Models;
using DjangiToolbox.Services;

namespace DjangiToolbox.ViewModels.Pages;

public partial class CodeZipperViewModel : ViewModelBase
{
    public ObservableCollection<FileEntry> Files { get; } = new();
    public ObservableCollection<LogEntry> Logs { get; } = new();

    [ObservableProperty]
    private string _outputPath = "";

    public int FileCount => Files.Count;
    public bool HasFiles => Files.Count > 0;
    public string FileCountText => $"{Files.Count} file(s) queued";

    public CodeZipperViewModel()
    {
        // ObservableCollection raises events, but not PropertyChanged
        // for computed props. So we wire them up manually.
        Files.CollectionChanged += (_, _) =>
        {
            OnPropertyChanged(nameof(FileCount));
            OnPropertyChanged(nameof(HasFiles));
            OnPropertyChanged(nameof(FileCountText));
        };

        Log("// codezipper online — add files to begin");
    }

    private void Log(string message, string level = "INFO")
    {
        Logs.Add(new LogEntry(message, level));
    }

    // Source extensions we consider "code" for the folder scanner.
    private static readonly string[] CodeExtensions =
    {
        ".cs", ".xaml", ".axaml", ".json", ".xml", ".config", ".md", ".txt",
        ".yml", ".yaml", ".ps1", ".sh", ".sql", ".html", ".css", ".js", ".ts",
        ".py", ".java", ".go", ".rs", ".cpp", ".h", ".hpp"
    };

    private static readonly string[] SkipFolders =
    {
        "bin", "obj", ".git", ".vs", ".vscode", "node_modules",
        "packages", "dist", "build", ".idea"
    };

    [RelayCommand]
    private async Task AddFilesAsync()
    {
        var storage = FilePicker.Instance?.StorageProvider;
        if (storage is null) return;

        var picked = await storage.OpenFilePickerAsync(new FilePickerOpenOptions
        {
            Title = "Select source files",
            AllowMultiple = true
        });

        if (picked is null || picked.Count == 0) return;

        int added = 0;
        foreach (var file in picked)
        {
            var path = file.Path.LocalPath;
            if (Files.Any(f => f.Path.Equals(path, StringComparison.OrdinalIgnoreCase)))
                continue;
            Files.Add(new FileEntry(path));
            added++;
        }

        Log(added > 0
            ? $"// added {added} file(s)"
            : "// no new files (already in queue)");
    }

    [RelayCommand]
    private async Task AddFolderAsync()
    {
        var storage = FilePicker.Instance?.StorageProvider;
        if (storage is null) return;

        var picked = await storage.OpenFolderPickerAsync(new FolderPickerOpenOptions
        {
            Title = "Select source folder",
            AllowMultiple = false
        });

        if (picked is null || picked.Count == 0) return;
        var root = picked[0].Path.LocalPath;

        int added = 0;
        foreach (var file in Directory.EnumerateFiles(root, "*.*", SearchOption.AllDirectories))
        {
            var segments = file.Split(Path.DirectorySeparatorChar);
            if (segments.Any(s => SkipFolders.Contains(s, StringComparer.OrdinalIgnoreCase)))
                continue;

            var ext = Path.GetExtension(file);
            if (!CodeExtensions.Contains(ext, StringComparer.OrdinalIgnoreCase))
                continue;

            if (Files.Any(f => f.Path.Equals(file, StringComparison.OrdinalIgnoreCase)))
                continue;

            Files.Add(new FileEntry(file));
            added++;
        }

        Log($"// scanned folder — added {added} file(s)");
    }

    [RelayCommand]
    private void RemoveFile(FileEntry? entry)
    {
        if (entry is null) return;
        Files.Remove(entry);
        Log("// file removed");
    }

    [RelayCommand]
    private void ClearAll()
    {
        Files.Clear();
        Log("// queue cleared");
    }

    [RelayCommand]
    private async Task PickOutputAsync()
    {
        var storage = FilePicker.Instance?.StorageProvider;
        if (storage is null) return;

        var file = await storage.SaveFilePickerAsync(new FilePickerSaveOptions
        {
            Title = "Save PDF as",
            SuggestedFileName = "source-code.pdf",
            DefaultExtension = "pdf",
            FileTypeChoices = new[]
            {
                new FilePickerFileType("PDF document")
                {
                    Patterns = new[] { "*.pdf" }
                }
            }
        });

        if (file is null) return;
        OutputPath = file.Path.LocalPath;
        Log("// output path set");
    }

    [RelayCommand]
    private async Task RunAsync()
    {
        if (!HasFiles)
        {
            Log("// queue is empty — add files first", "WARN");
            return;
        }
        if (string.IsNullOrWhiteSpace(OutputPath))
        {
            Log("// no output path — pick one first", "WARN");
            return;
        }

        Log("// generating PDF...");
        
        try
        {
            var files = Files.ToList();
            var output = OutputPath;

            await Task.Run(() => PdfGenerator.Generate(output, files));

            Log($"// PDF written: {System.IO.Path.GetFileName(output)}");
        }
        catch (Exception ex)
        {
            Log($"// error: {ex.Message}", "ERROR");
        }
    }
}