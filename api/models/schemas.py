from pydantic import BaseModel, field_validator
from typing import Literal

Platform = Literal["twitter", "linkedin", "substack", "instagram"]


class ReformatRequest(BaseModel):
    text: str
    platforms: list[Platform]
    preferences: str | None = None
    tone: str | None = None
    language: str | None = None

    @field_validator("text")
    @classmethod
    def text_nao_vazio(cls, v):
        if not v.strip():
            raise ValueError("Texto não pode ser vazio.")
        if len(v) > 10000:
            raise ValueError("Texto excede o limite de 10.000 caracteres.")
        return v

    @field_validator("platforms")
    @classmethod
    def plataformas_validas(cls, v):
        if not v:
            raise ValueError("Selecione ao menos uma plataforma.")
        return v


class ReformatResponse(BaseModel):
    twitter: str | None = None
    linkedin: str | None = None
    substack: str | None = None
    instagram: str | None = None
