using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Input;
using Avalonia.Interactivity;
using Avalonia.Media;
using Avalonia.VisualTree;
using DjangiToolbox.ViewModels;
using DjangiToolbox.Services;

namespace DjangiToolbox.Views;

public partial class MainWindow : Window
{
    // ---- Transition tuning knobs ----
    private const int BlockMinHeight   = 35;
    private const int BlockMaxHeight   = 85;
    private const int CoverFadeMs      = 40;    // per-block fade in
    private const int CoverMaxDelayMs  = 80;    // random stagger during cover
    private const int RevealFadeMs     = 60;    // per-block fade out
    private const int RevealMaxDelayMs = 80;    // random stagger during reveal
    private const double DarkChance = 0.45;  // 45% darker block, 55% lighter block
    private const string DarkBlockHex  = "#141B24";  // deep slate — barely lighter than bg
    private const string LightBlockHex = "#1A222C";  // slightly lighter slate

    private readonly Random _rng = new();
    private MainWindowViewModel? _subscribedVm;

    public MainWindow()
    {
        InitializeComponent();
    }

    protected override void OnOpened(EventArgs e)
    {
        base.OnOpened(e);
        _ = RunStartupAsync();
    }

    protected override void OnDataContextChanged(EventArgs e)
    {
        base.OnDataContextChanged(e);

        if (_subscribedVm is not null)
        {
            _subscribedVm.BeforePageChange -= PlayCoverAsync;
            _subscribedVm.AfterPageChange  -= PlayRevealAsync;
        }

        if (DataContext is MainWindowViewModel vm)
        {
            vm.BeforePageChange += PlayCoverAsync;
            vm.AfterPageChange  += PlayRevealAsync;
            _subscribedVm = vm;
        }
    }

    // ================= Digital dissolve =================

    private async Task PlayCoverAsync()
    {
        var layer = this.FindControl<StackPanel>("DissolveLayer");
        if (layer is null) return;

        layer.Children.Clear();

        double height = (layer.Parent as Visual)?.Bounds.Height ?? 0;
        if (height <= 0) height = Bounds.Height - 44;

        // Build blocks whose heights sum to exactly `height`.
        var blocks = new List<Border>();
        double y = 0;
        while (y < height - 1)
        {
            double h = _rng.Next(BlockMinHeight, BlockMaxHeight);
            if (y + h > height) h = height - y;

            var block = new Border
            {
                Height = h,
                Background = new SolidColorBrush(
                    Color.Parse(_rng.NextDouble() < DarkChance ? DarkBlockHex : LightBlockHex)),
                Opacity = 0
            };
            layer.Children.Add(block);
            blocks.Add(block);
            y += h;
        }

        var tasks = blocks.Select(b => FadeInBlockAsync(b)).ToList();
        await Task.WhenAll(tasks);
    }

    private async Task PlayRevealAsync()
    {
        var layer = this.FindControl<StackPanel>("DissolveLayer");
        if (layer is null) return;

        var tasks = layer.Children.OfType<Border>()
            .Select(b => FadeOutBlockAsync(b))
            .ToList();
        await Task.WhenAll(tasks);

        layer.Children.Clear();
    }

    private async Task FadeInBlockAsync(Border block)
    {
        await Task.Delay(_rng.Next(0, CoverMaxDelayMs));

        const int steps = 4;
        for (int i = 1; i <= steps; i++)
        {
            block.Opacity = i / (double)steps;
            await Task.Delay(CoverFadeMs / steps);
        }
        block.Opacity = 1;
    }

    private async Task FadeOutBlockAsync(Border block)
    {
        await Task.Delay(_rng.Next(0, RevealMaxDelayMs));

        const int steps = 4;
        for (int i = steps - 1; i >= 0; i--)
        {
            block.Opacity = i / (double)steps;
            await Task.Delay(RevealFadeMs / steps);
        }
        block.Opacity = 0;
    }

    // ------

    private async Task RunStartupAsync()
    {
        FilePicker.Register(this);

        // 1) fade window in
        await Task.Delay(80);
        const int steps = 20;
        for (int i = 1; i <= steps; i++)
        {
            Opacity = i / (double)steps;
            await Task.Delay(12);
        }
        Opacity = 1;
        SyncWindowStateUi();

        // 2) play boot sequence
        if (DataContext is not MainWindowViewModel vm) return;
        await vm.Boot.RunAsync();

        // hold "ACCESS GRANTED" for a beat
        await Task.Delay(450);

        // 3) fade out the overlay
        if (this.FindControl<Grid>("BootOverlay") is { } overlay)
        {
            const int fadeSteps = 18;
            for (int i = fadeSteps; i >= 0; i--)
            {
                overlay.Opacity = i / (double)fadeSteps;
                await Task.Delay(18);
            }
        }

        // 4) hide it via the VM (overlay binds IsVisible to Boot.IsVisible)
        vm.Boot.IsVisible = false;
    }

    protected override void OnPropertyChanged(AvaloniaPropertyChangedEventArgs change)
    {
        base.OnPropertyChanged(change);

        if (change.Property == WindowStateProperty)
            SyncWindowStateUi();
    }

    private void SyncWindowStateUi()
    {
        var isMax = WindowState == WindowState.Maximized;

        // Change the maximize/restore glyph
        if (this.FindControl<Button>("MaximizeBtn") is { } btn)
            btn.Content = isMax ? "❐" : "▢";

        // Hide resize grips when maximized (you can't resize a maximized window)
        if (this.FindControl<Grid>("ResizeGrips") is { } grips)
            grips.IsVisible = !isMax;
    }

    private void OnTitleBarPressed(object? sender, PointerPressedEventArgs e)
    {
        if (e.GetCurrentPoint(this).Properties.IsLeftButtonPressed)
            BeginMoveDrag(e);
    }

    private void OnMinimize(object? sender, RoutedEventArgs e)
        => WindowState = WindowState.Minimized;

    private void OnMaximizeToggle(object? sender, RoutedEventArgs e)
        => WindowState = WindowState == WindowState.Maximized
            ? WindowState.Normal
            : WindowState.Maximized;

    private void OnClose(object? sender, RoutedEventArgs e)
        => Close();

    private void OnResizeTop(object? s, PointerPressedEventArgs e)          => BeginResizeDrag(WindowEdge.North, e);
    private void OnResizeBottom(object? s, PointerPressedEventArgs e)       => BeginResizeDrag(WindowEdge.South, e);
    private void OnResizeLeft(object? s, PointerPressedEventArgs e)         => BeginResizeDrag(WindowEdge.West, e);
    private void OnResizeRight(object? s, PointerPressedEventArgs e)        => BeginResizeDrag(WindowEdge.East, e);
    private void OnResizeTopLeft(object? s, PointerPressedEventArgs e)      => BeginResizeDrag(WindowEdge.NorthWest, e);
    private void OnResizeTopRight(object? s, PointerPressedEventArgs e)     => BeginResizeDrag(WindowEdge.NorthEast, e);
    private void OnResizeBottomLeft(object? s, PointerPressedEventArgs e)   => BeginResizeDrag(WindowEdge.SouthWest, e);
    private void OnResizeBottomRight(object? s, PointerPressedEventArgs e)  => BeginResizeDrag(WindowEdge.SouthEast, e);
}