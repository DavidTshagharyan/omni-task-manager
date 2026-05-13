from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api.tasks import router as tasks_router

app = FastAPI(title="Omni Task Manager", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Routers
app.include_router(tasks_router)

@app.get("/")
async def root():
    return {"message": "Omni Task Manager API is running!"}

@app.get("/health")
async def health():
    return {"status": "ok"}