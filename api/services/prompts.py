SYSTEM_PROMPT = """Você é um especialista em adaptação de conteúdo para redes sociais.
Preserve 100% da ideia central e argumentos do autor.
Mantenha a voz e tom originais — não reescreva, reformate.
Não adicione informações que não existem no original.
Não use clichês de marketing.
Retorne APENAS o texto pronto para publicação, sem explicações ou comentários."""

PLATFORM_RULES = {
    "twitter": """
Reformate o texto abaixo como uma THREAD para X/Twitter:
- Tweet 1: gancho irresistível (máx 240 chars)
- Tweets 2 a N: desenvolva em tweets de até 270 chars cada
- Cada tweet funciona de forma independente mas cria sequência lógica
- Numere como 1/, 2/, 3/ etc
- Último tweet: CTA claro (seguir, responder, compartilhar)
- Separe cada tweet com uma linha em branco
- Não use hashtags
""",
    "linkedin": """
Reformate o texto abaixo para LINKEDIN:
- Primeira linha (antes do "ver mais"): afirmação ou pergunta — máx 150 chars
- Parágrafos de 1–3 linhas com espaço entre eles
- Tom: profissional mas humano, primeira pessoa
- Emojis com moderação (1–3 no total)
- Termine com pergunta aberta para gerar comentários
- Comprimento ideal: 800–1300 caracteres total
""",
    "substack": """
Reformate o texto abaixo para SUBSTACK/NEWSLETTER:
- Primeira linha: ASSUNTO: [assunto irresistível máx 50 chars]
- Mantenha texto completo e elaborado
- Use negrito (**palavra**) nos 2–3 pontos mais importantes
- Subtítulos se o texto tiver mais de 400 palavras
- Feche com CTA específico
- Tom: pessoal, como carta para um amigo inteligente
""",
    "instagram": """
Reformate o texto abaixo para INSTAGRAM CAPTION:
- Máximo 150 palavras no corpo
- Primeira frase: gancho (máx 125 chars)
- Parágrafos curtos (2–3 linhas)
- Tom mais pessoal e emocional
- CTA: "link na bio", "salva esse post", "manda pra alguém que precisa ver"
- Linha em branco após o texto
- 15–20 hashtags relevantes separadas por espaço
""",
}


def build_prompt(
    text: str,
    platform: str,
    preferences: str | None = None,
    tone: str | None = None,
    language: str | None = None,
) -> str:
    prefs_instruction = (
        f"PREFERÊNCIAS IMPORTANTES (Siga rigorosamente):\n{preferences}\n\n"
        if preferences
        else ""
    )
    
    tone_instruction = f"TOM DE VOZ EXIGIDO: {tone}\n\n" if tone else ""
    lang_instruction = f"IDIOMA DE SAÍDA EXIGIDO: {language}\n\n" if language else ""

    return (
        f"{PLATFORM_RULES[platform]}\n\n"
        f"{lang_instruction}"
        f"{tone_instruction}"
        f"{prefs_instruction}"
        f"TEXTO ORIGINAL:\n---\n{text}\n---"
    )
