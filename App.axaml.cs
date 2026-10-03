using System;
using System.IO;
using System.Reflection;
using Avalonia;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Markup.Xaml;
using DjangiToolbox.ViewModels;
using DjangiToolbox.Views;
using QuestPDF.Drawing;
using QuestPDF.Infrastructure;

namespace DjangiToolbox;

public partial class App : Application
{
    public override void Initialize()
    {
        QuestPDF.Settings.License = LicenseType.Community;
        RegisterQuestPdfFonts();
        AvaloniaXamlLoader.Load(this);
    }

    private void RegisterQuestPdfFonts()
    {
        // Get the current assembly where the fonts are embedded
        var assembly = Assembly.GetExecutingAssembly();

        // List the font files you want to register.
        // The resource name format is: [AssemblyName].Assets.Fonts.[FileName]
        // For example: "Djangitoolbox.Assets.Fonts.JetBrainsMono-Regular.ttf"
        var fontResources = new[]
        {
            "Djangitoolbox.Assets.Fonts.JetBrainsMono-Regular.ttf", // Replace with your actual font file name
            "Djangitoolbox.Assets.Fonts.Lato-Regular.ttf"          // Replace with your actual font file name
        };

        foreach (var resourceName in fontResources)
        {
            using var fontStream = assembly.GetManifestResourceStream(resourceName);
            if (fontStream != null)
            {
                // Register the font stream with QuestPDF.
                // The family name (e.g., "JetBrains Mono") is read from the font file itself.
                FontManager.RegisterFontFromStream(fontStream);
            }
            else
            {
                // Log or handle the case where the font resource is missing
                Console.WriteLine($"Warning: Could not find embedded font resource '{resourceName}'");
            }
        }
    }

    public override void OnFrameworkInitializationCompleted()
    {
        if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
        {
            desktop.MainWindow = new MainWindow
            {
                DataContext = new MainWindowViewModel(),
            };
        }

        base.OnFrameworkInitializationCompleted();
    }
}