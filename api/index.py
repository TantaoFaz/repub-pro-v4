from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers.reformat import router

app = FastAPI(title="Repub API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # More permissive for unified hosting
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

app.include_router(router)

from .routers.license import router as license_router
app.include_router(license_router)


@app.get("/health")
def health():
    return {"status": "ok"}
