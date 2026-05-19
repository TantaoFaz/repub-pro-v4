"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { reformat, Platform, ReformatResponse } from "@/lib/api";
import { useHistory } from "@/hooks/useHistory";
import TextInput from "@/components/TextInput";
import PlatformSelector from "@/components/PlatformSelector";
import OutputTabs from "@/components/OutputTabs";
import DashboardShell from "@/components/DashboardShell";
import { Zap, Send, FileText, Settings as SettingsIcon, Info } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem("repub_license_key");
    if (!key) {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const [activeView, setActiveView] = useState<"workspace" | "history">("workspace");
  const [text, setText] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [preferences, setPreferences] = useState("");
  const [tone, setTone] = useState("Profissional");
  const [language, setLanguage] = useState("Português (BR)");

  const [results, setResults] = useState<ReformatResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { history, addHistory } = useHistory();

  const canSubmit = text.trim().length > 0 && platforms.length > 0 && !loading;
  
  if (!isAuthorized) return null; // Wait for auth resolution

  // Intelligent hint logic
  const len = text.length;
  let limitHint = null;
  if (platforms.includes("twitter") && len > 500) limitHint = "Seu texto base está longo. A IA precisará criar uma Thread longa no Twitter.";
  if (platforms.includes("linkedin") && len > 3000) limitHint = "Aviso: O texto excedeu o limite do LinkedIn (3.000). A IA fará um grande resumo.";

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await reformat(text, platforms, preferences, tone, language);
      setResults(data);
      addHistory(text, data, platforms); // Add to local storage
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  function loadHistoryItem(item: { originalText: string; platforms: Platform[]; results: ReformatResponse }) {
    setText(item.originalText);
    setPlatforms(item.platforms);
    setResults(item.results);
    setActiveView("workspace");
  }

  return (
    <DashboardShell activeView={activeView} onViewChange={setActiveView}>
      {activeView === "workspace" ? (
        <div className="animate-fade" style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ marginBottom: "40px" }}>
            <h2 className="h1">Novo Conteúdo</h2>
            <p className="p-muted">Crie uma publicação e adapte para suas redes com IA de alta precisão.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "800px", margin: "0 auto" }}>
            
            <div className="card">
              <div className="card-title">
                <FileText size={24} className="text-primary" />
                <span>Texto Original</span>
              </div>
              <TextInput value={text} onChange={setText} />
              
              {/* Intelligent Hint */}
              {limitHint && (
                <div style={{ marginTop: "16px", display: "flex", gap: "10px", alignItems: "center", color: "var(--warning)", fontWeight: 600 }}>
                  <Info size={18} />
                  <span>{limitHint}</span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="card" style={{ padding: "24px" }}>
                <PlatformSelector selected={platforms} onChange={setPlatforms} />
              </div>

              <div className="card" style={{ padding: "24px" }}>
                <div className="card-title" style={{ marginBottom: "16px", fontSize: "1.1rem" }}>
                  <SettingsIcon size={20} className="text-primary" />
                  <span>Configurações Essenciais</span>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="textarea-group">
                      <label className="label">Tom de Voz</label>
                      <select className="input-standard" value={tone} onChange={e => setTone(e.target.value)}>
                        <option>Profissional</option>
                        <option>Descontraído</option>
                        <option>Direto (Sem enrolação)</option>
                        <option>Humorado</option>
                      </select>
                    </div>

                    <div className="textarea-group">
                      <label className="label">Idioma</label>
                      <select className="input-standard" value={language} onChange={e => setLanguage(e.target.value)}>
                        <option>Português (BR)</option>
                        <option>English</option>
                        <option>Español</option>
                      </select>
                    </div>
                  </div>

                  <div className="textarea-group">
                    <label className="label">Diretrizes Extras (Opcional)</label>
                    <textarea
                      className="input-standard"
                      style={{ minHeight: "80px", resize: "vertical" }}
                      placeholder="Ex: Não use emojis. Foque no problema X."
                      value={preferences}
                      onChange={(e) => setPreferences(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ width: "100%", padding: "24px", fontSize: "1.2rem", marginTop: "8px" }}
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                {loading ? (
                  <><Zap className="animate-pulse" size={20} /> Processando seu texto...</>
                ) : (
                  <><Send size={20} /> Transformar Conteúdo</>
                )}
              </button>

              {error && (
                <div style={{ padding: "16px", background: "var(--bg-app)", color: "var(--error)", border: "2px solid var(--error)", borderRadius: "var(--radius-md)", fontWeight: 600 }}>
                  {error}
                </div>
              )}
            </div>

            <div style={{ marginTop: "24px" }}>
              {(results || loading) && (
                <OutputTabs results={results || {}} platforms={platforms} loading={loading} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-fade" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ marginBottom: "40px" }}>
            <h2 className="h1">Histórico</h2>
            <p className="p-muted">Suas gerações anteriores recentes. Salvas localmente no seu navegador.</p>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {history.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: "48px", color: "var(--text-tertiary)" }}>
                Nenhum histórico encontrado ainda.
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", marginBottom: "4px" }}>
                      {new Date(item.date).toLocaleString()}
                    </div>
                    <div style={{ fontWeight: 500 }}>
                      Texto com {item.originalText.length} caracteres
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                      {item.platforms.map(p => (
                        <span key={p} style={{ fontSize: "0.75rem", background: "#f1f5f9", padding: "2px 8px", borderRadius: "12px" }}>{p}</span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => loadHistoryItem(item)} className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                    Restaurar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
