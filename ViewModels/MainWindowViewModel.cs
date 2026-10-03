using System;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using DjangiToolbox.ViewModels.Pages;

namespace DjangiToolbox.ViewModels;

public partial class MainWindowViewModel : ViewModelBase
{
    public BootViewModel Boot { get; } = new();

    private readonly HomeViewModel _home = new();
    private readonly CodeZipperViewModel _codeZipper = new();

    public event Func<Task>? BeforePageChange;
    public event Func<Task>? AfterPageChange;

    [ObservableProperty]
    private ViewModelBase _currentPage;

    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(IsHomeActive))]
    [NotifyPropertyChangedFor(nameof(IsZipActive))]
    private string _activeKey = "home";

    public bool IsHomeActive => ActiveKey == "home";
    public bool IsZipActive  => ActiveKey == "zip";

    public MainWindowViewModel()
    {
        _currentPage = _home;
    }

    [RelayCommand]
    private Task NavigateHome() => SetPageAsync("home", _home);

    [RelayCommand]
    private Task NavigateCodeZipper() => SetPageAsync("zip", _codeZipper);

    private async Task SetPageAsync(string key, ViewModelBase page)
    {
        if (ActiveKey == key) return;

        if (BeforePageChange is not null)
            await BeforePageChange.Invoke();

        ActiveKey = key;
        CurrentPage = page;

        if (AfterPageChange is not null)
            await AfterPageChange.Invoke();
    }
}
