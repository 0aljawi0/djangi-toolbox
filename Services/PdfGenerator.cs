using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using DjangiToolbox.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace DjangiToolbox.Services;

public static class PdfGenerator
{
    public static void Generate(string outputPath, IReadOnlyList<FileEntry> files)
    {
        Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(24);
                page.DefaultTextStyle(t => t
                    .FontFamily("JetBrains Mono")
                    .FontSize(7)
                    .LineHeight(1.2f));

                // ---- Header (repeats on every page) ----
                page.Header().PaddingBottom(6).Column(h =>
                {
                    h.Spacing(2);
                    h.Item().Text("DJANGI TOOLBOX")
                        .FontSize(14).Bold().FontColor("#1F2A36");
                    h.Item().Text(
                        $"// SOURCE CODE EXPORT  •  {files.Count} file(s)  •  {DateTime.Now:yyyy-MM-dd HH:mm:ss}")
                        .FontSize(7).FontColor("#8A99A8");
                    h.Item().PaddingTop(2).LineHorizontal(0.5f).LineColor("#1F2A36");
                });

                // ---- Content: all files, continuous ----
                page.Content().Column(col =>
                {
                    col.Spacing(0);

                    foreach (var file in files)
                    {
                        // File header block
                        col.Item().PaddingTop(8).PaddingBottom(2).Column(fh =>
                        {
                            fh.Spacing(1);
                            fh.Item().Text(file.Name)
                                .FontSize(9).Bold().FontColor("#1F2A36");
                            fh.Item().Text(file.Path)
                                .FontSize(6).FontColor("#8A99A8");
                            fh.Item().PaddingTop(1)
                                .LineHorizontal(0.5f).LineColor("#1F2A36");
                        });

                        string[] lines;
                        try
                        {
                            lines = File.ReadAllLines(file.Path);
                        }
                        catch
                        {
                            col.Item().Text("// unable to read file")
                                .FontColor("#FF003C");
                            continue;
                        }

                        // Code lines — no truncation
                        int lineNo = 0;
                        foreach (var raw in lines)
                        {
                            lineNo++;
                            var escaped = Escape(raw);
                            col.Item().Text(text =>
                            {
                                text.Span(lineNo.ToString().PadLeft(5) + " | ")
                                    .FontColor("#8A99A8");
                                text.Span(escaped)
                                    .FontColor("#0A0E14");
                            });
                        }
                    }
                });

                // ---- Footer ----
                page.Footer().PaddingTop(4).Row(row =>
                {
                    row.RelativeItem().Text("DJANGI TOOLBOX // codezipper")
                        .FontSize(6).FontColor("#8A99A8");

                    row.ConstantItem(100).AlignRight().Text(text =>
                    {
                        text.DefaultTextStyle(t => t.FontSize(6).FontColor("#8A99A8"));
                        text.Span("Page ");
                        text.CurrentPageNumber();
                        text.Span(" / ");
                        text.TotalPages();
                    });
                });
            });
        })
        .GeneratePdf(outputPath);
    }

    private static string Escape(string line)
    {
        var sb = new StringBuilder(line.Length);
        foreach (var c in line)
        {
            if (c == '\t') sb.Append("    ");
            else if (c < 32) sb.Append(' ');
            else if (c > 126) sb.Append('?');
            else sb.Append(c);
        }
        return sb.ToString();
    }
}