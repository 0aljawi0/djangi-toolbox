using System;
using System.IO;

namespace DjangiToolbox.Models;

public class FileEntry
{
    public string Path { get; }
    public string Name { get; }
    public string SizeDisplay { get; }

    public FileEntry(string path)
    {
        Path = path;
        Name = System.IO.Path.GetFileName(path);
        try
        {
            var bytes = new FileInfo(path).Length;
            SizeDisplay = FormatSize(bytes);
        }
        catch
        {
            SizeDisplay = "?";
        }
    }

    private static string FormatSize(long bytes) => bytes switch
    {
        < 1024 => $"{bytes} B",
        < 1024 * 1024 => $"{bytes / 1024.0:F1} KB",
        _ => $"{bytes / (1024.0 * 1024.0):F1} MB"
    };
}