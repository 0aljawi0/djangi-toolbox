using System.Collections.ObjectModel;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;

namespace DjangiToolbox.ViewModels;

public partial class BootViewModel : ViewModelBase
{
    // The scrolling log lines
    public ObservableCollection<string> Lines { get; } = new();

    [ObservableProperty]
    // [NotifyPropertyChangedFor(nameof(ProgressWidth))]
    [NotifyPropertyChangedFor(nameof(ProgressPercent))]
    private double _progress;

    [ObservableProperty]
    private bool _isComplete;

    [ObservableProperty]
    private bool _isVisible = true;

    // Progress bar is 600px wide in XAML — keep these in sync if you change it.
    // public double ProgressWidth => Progress * 600;
    public string ProgressPercent => $"{(int)(Progress * 100),3}%";

    public async Task RunAsync()
    {
        await Task.Delay(250);

        await Line("> INITIALIZING BOOT SEQUENCE .......... [OK]", 160);
        await Line("> LOADING KERNEL MODULES .............. [OK]", 180);
        await Line("> MOUNTING VIRTUAL FILESYSTEM ......... [OK]", 150);
        await Line("> ESTABLISHING NEURAL LINK ............ [OK]", 220);
        await Line("> DECRYPTING OPERATOR CREDENTIALS ..... [OK]", 200);
        await Line("> LOADING DJANGI TOOLBOX CORE .......... [OK]", 220);

        // Progress bar fill
        for (int i = 0; i <= 100; i++)
        {
            Progress = i / 100.0;
            await Task.Delay(10);
        }

        await Line("", 80);
        await Line("> ACCESS GRANTED", 350);
        IsComplete = true;
    }

    private async Task Line(string text, int delayMs)
    {
        Lines.Add(text);
        await Task.Delay(delayMs);
    }
}