using System;

namespace DjangiToolbox.Models;

public class LogEntry
{
    public string TimeText { get; }
    public string Level    { get; }
    public string Message  { get; }

    // Boolean flags for XAML class bindings
    public bool IsInfo  => Level == "INFO";
    public bool IsWarn  => Level == "WARN";
    public bool IsError => Level == "ERROR";

    public LogEntry(string message, string level = "INFO")
    {
        TimeText = DateTime.Now.ToString("HH:mm:ss");
        Level    = level;
        Message  = message;
    }
}