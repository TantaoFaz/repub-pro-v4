import os
from groq import AsyncGroq
from .prompts import SYSTEM_PROMPT, build_prompt

client = AsyncGroq(api_key=os.environ.get("GROQ_API_KEY", ""))
MODEL = "llama-3.3-70b-versatile"


async def reformat_for_platform(
    text: str, 
    platform: str, 
    preferences: str | None = None,
    tone: str | None = None,
    language: str | None = None,
) -> str:
    completion = await client.chat.completions.create(
        model=MODEL,
        max_tokens=2048,
        temperature=0.7,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_prompt(text, platform, preferences, tone, language)},
        ],

    )
    return completion.choices[0].message.content or ""
