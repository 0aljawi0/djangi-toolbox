using System;
using Avalonia.Controls;
using Avalonia.Threading;
using DjangiToolbox.ViewModels.Pages;

namespace DjangiToolbox.Views.Pages;

public partial class CodeZipperView : UserControl
{
    public CodeZipperView()
    {
        InitializeComponent();
    }

    protected override void OnDataContextChanged(EventArgs e)
    {
        base.OnDataContextChanged(e);

        if (DataContext is not CodeZipperViewModel vm) return;

        vm.Logs.CollectionChanged += (_, _) =>
        {
            // Wait for layout pass, then scroll
            Dispatcher.UIThread.Post(
                () => this.FindControl<ScrollViewer>("LogScroll")?.ScrollToEnd(),
                DispatcherPriority.Background);
        };
    }
}