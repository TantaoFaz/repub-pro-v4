from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import httpx

router = APIRouter()

class VerifyLicenseRequest(BaseModel):
    license_key: str

class VerifyLicenseResponse(BaseModel):
    success: bool
    email: str | None = None
    message: str | None = None

PRODUCT_PERMALINK = os.getenv("GUMROAD_PRODUCT_PERMALINK", "repub-pro") # Configure este valor no seu .env depois!

@router.post("/verify-license", response_model=VerifyLicenseResponse)
async def verify_license(req: VerifyLicenseRequest):
    if not req.license_key:
        raise HTTPException(status_code=400, detail="License key is required.")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://api.gumroad.com/v2/licenses/verify",
                data={
                    "product_permalink": PRODUCT_PERMALINK,
                    "license_key": req.license_key
                }
            )
            
            data = response.json()
            
            if data.get("success"):
                # Licença validada!
                purchase = data.get("purchase", {})
                if purchase.get("refunded") or purchase.get("chargebacked") or purchase.get("disputed"):
                    return VerifyLicenseResponse(success=False, message="Sua licença foi revogada, reembolsada ou contestada.")
                
                return VerifyLicenseResponse(
                    success=True, 
                    email=purchase.get("email"),
                    message="Licença ativada com sucesso!"
                )
            else:
                return VerifyLicenseResponse(success=False, message="Chave de licença inválida.")
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Erro de comunicação com o Gumroad.")
