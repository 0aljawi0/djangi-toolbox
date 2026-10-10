import { useCallback, useState } from "react";
import type { LogEntry, LogLevel } from "../types";

let nextId = 1;

export function useLogs(initial: string[] = []) {
  const [logs, setLogs] = useState<LogEntry[]>(() =>
    initial.map((m) => ({
      id: nextId++,
      time: new Date().toLocaleTimeString([], { hour12: false }),
      level: "INFO",
      message: m,
    })),
  );

  const log = useCallback((message: string, level: LogLevel = "INFO") => {
    setLogs((prev) => [
      ...prev,
      {
        id: nextId++,
        time: new Date().toLocaleTimeString([], { hour12: false }),
        level,
        message,
      },
    ]);
  }, []);

  return { logs, log };
}