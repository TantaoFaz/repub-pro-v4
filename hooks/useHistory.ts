import { useState, useEffect } from "react";
import { ReformatResponse, Platform } from "@/lib/api";

export interface HistoryItem {
  id: string;
  date: string;
  originalText: string;
  results: ReformatResponse;
  platforms: Platform[];
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("repub_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const addHistory = (
    originalText: string,
    results: ReformatResponse,
    platforms: Platform[]
  ) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      originalText,
      results,
      platforms,
    };

    const newHistory = [newItem, ...history].slice(0, 50); // Keep last 50
    setHistory(newHistory);
    try {
      localStorage.setItem("repub_history", JSON.stringify(newHistory));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("repub_history");
  };

  return { history, addHistory, clearHistory };
}
