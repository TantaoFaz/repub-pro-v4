const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export type Platform = "twitter" | "linkedin" | "substack" | "instagram";

export interface ReformatResponse {
  twitter?: string;
  linkedin?: string;
  substack?: string;
  instagram?: string;
}

export async function reformat(
  text: string,
  platforms: Platform[],
  preferences?: string,
  tone?: string,
  language?: string
): Promise<ReformatResponse> {
  const res = await fetch(`${API_URL}/api/reformat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, platforms, preferences, tone, language }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.detail || `Erro ao processar (${res.status}). Tente novamente.`
    );
  }

  return res.json();
}

export async function verifyLicense(licenseKey: string): Promise<{ success: boolean; message?: string; email?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/verify-license`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ license_key: licenseKey }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.detail || "Erro ao conectar com API." };
    }

    return await res.json();
  } catch {
    return { success: false, message: "Erro de rede ao validar licença." };
  }
}
