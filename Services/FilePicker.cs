using Avalonia.Controls;

namespace DjangiToolbox.Services;

/// <summary>
/// Global access to the app's TopLevel, so ViewModels can open
/// native file/folder pickers without holding a Window reference.
/// </summary>
public static class FilePicker
{
    public static TopLevel? Instance { get; private set; }

    public static void Register(TopLevel topLevel) => Instance = topLevel;
}