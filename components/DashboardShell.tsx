"use client";

import { Layers, History as HistoryIcon, Home } from "lucide-react";

interface DashboardShellProps {
  children: React.ReactNode;
  activeView: "workspace" | "history";
  onViewChange: (view: "workspace" | "history") => void;
}

export default function DashboardShell({ children, activeView, onViewChange }: DashboardShellProps) {
  return (
    <div className="dashboard-shell animate-fade">
      {/* Top Navbar */}
      <header className="top-navbar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ background: "var(--text-primary)", padding: "4px", borderRadius: "4px" }}>
            <Layers color="white" size={24} />
          </div>
          <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: "-0.04em" }}>
            REPUB
          </span>
        </div>

        <nav style={{ display: "flex", gap: "16px" }}>
          <button 
            className="btn-secondary" 
            style={{ 
              background: activeView === "workspace" ? "var(--text-primary)" : "var(--bg-card)",
              color: activeView === "workspace" ? "white" : "var(--text-primary)",
            }}
            onClick={() => onViewChange("workspace")}
          >
            <Home size={16} />
            <span style={{ display: "none" }} className="sm:block">Criar</span>
          </button>
          
          <button 
            className="btn-secondary"
            style={{ 
              background: activeView === "history" ? "var(--text-primary)" : "var(--bg-card)",
              color: activeView === "history" ? "white" : "var(--text-primary)",
            }}
            onClick={() => onViewChange("history")}
          >
            <HistoryIcon size={16} />
            <span style={{ display: "none" }} className="sm:block">Histórico</span>
          </button>
        </nav>
      </header>

      {/* Main Area */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
