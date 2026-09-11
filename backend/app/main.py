import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router, ensure_initialized

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("firewatch.main")

app = FastAPI(
    title="FireWatch AI - Satellite Industrial Fire & Thermal Persistence Platform",
    description="AI-based detection, classification, and persistence monitoring of industrial fires and gas flares (SIH26162 / NTRO).",
    version="1.0.0"
)

# Enable CORS for frontend Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API endpoints under /api
app.include_router(api_router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    logger.info("Starting FireWatch AI Backend Services...")
    ensure_initialized()
    logger.info("FireWatch AI ready to serve satellite thermal intelligence.")

@app.get("/")
def root():
    return {
        "service": "FireWatch AI API",
        "problem_statement": "SIH26162 - NTRO",
        "status": "ONLINE",
        "docs": "/docs",
        "endpoints": [
            "/api/hotspots",
            "/api/persistent",
            "/api/stats",
            "/api/industrial-zones",
            "/api/presets",
            "/api/export/csv"
        ]
    }

@app.get("/health")
def health():
    return {"status": "healthy"}
