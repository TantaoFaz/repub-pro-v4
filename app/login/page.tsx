"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyLicense } from "@/lib/api";
import { Layers, ArrowRight, Lock } from "lucide-react";

export default function LoginPage() {
  const [licenseKey, setLicenseKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!licenseKey.trim()) return;

    setLoading(true);
    setError(null);

    const result = await verifyLicense(licenseKey.trim());

    if (result.success) {
      localStorage.setItem("repub_license_key", licenseKey.trim());
      router.push("/");
    } else {
      setError(result.message || "Licença inválida.");
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-shell animate-fade" style={{ alignItems: "center", justifyContent: "center", background: "var(--bg-app)" }}>
      <div className="card" style={{ maxWidth: "400px", width: "100%", padding: "48px 32px" }}>
        
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <div style={{ background: "var(--text-primary)", padding: "8px", borderRadius: "8px" }}>
            <Layers color="white" size={32} />
          </div>
        </div>
        
        <h1 className="h1" style={{ fontSize: "1.8rem", textAlign: "center", marginBottom: "8px" }}>Acesso Restrito</h1>
        <p className="p-muted" style={{ textAlign: "center", marginBottom: "32px", fontSize: "0.95rem" }}>
          Insira sua chave de licença enviada por e-mail no ato da compra.
        </p>

        <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="textarea-group">
            <label className="label">License Key</label>
            <input
              type="text"
              className="input-standard"
              placeholder="XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              style={{ fontFamily: "monospace", letterSpacing: "1px" }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", padding: "16px" }}
            disabled={loading || !licenseKey.trim()}
          >
            {loading ? (
              <span className="animate-pulse">Validando...</span>
            ) : (
              <>Validar Acesso <ArrowRight size={18} /></>
            )}
          </button>

          {error && (
            <div style={{ padding: "12px", background: "var(--bg-app)", color: "var(--error)", border: "2px solid var(--error)", borderRadius: "var(--radius-md)", fontWeight: 600, fontSize: "0.85rem", textAlign: "center" }}>
              <Lock size={14} style={{ display: "inline", marginRight: "6px" }} /> {error}
            </div>
          )}
        </form>

        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <a href="https://gumroad.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-tertiary)", fontSize: "0.85rem", textDecoration: "underline", fontWeight: 500 }}>
            Não possui uma licença? Assine agora
          </a>
        </div>
      </div>
    </div>
  );
}
