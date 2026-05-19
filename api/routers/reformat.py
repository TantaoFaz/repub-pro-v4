import asyncio
from fastapi import APIRouter, HTTPException
from groq import RateLimitError
from ..models.schemas import ReformatRequest, ReformatResponse
from ..services.groq_client import reformat_for_platform

router = APIRouter()


@router.post("/reformat", response_model=ReformatResponse)
async def reformat(request: ReformatRequest):
    try:
        tasks = {
            platform: reformat_for_platform(
                request.text, 
                platform, 
                request.preferences,
                request.tone,
                request.language
            )
            for platform in request.platforms
        }
        results = await asyncio.gather(*tasks.values(), return_exceptions=True)

        response = {}
        for platform, result in zip(tasks.keys(), results):
            if isinstance(result, Exception):
                raise result
            response[platform] = result

        return ReformatResponse(**response)

    except RateLimitError:
        raise HTTPException(
            status_code=429,
            detail="Muitas requisições. Aguarde alguns segundos e tente novamente.",
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=500, detail="Erro ao processar. Tente novamente."
        )
