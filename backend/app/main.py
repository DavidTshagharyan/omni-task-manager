from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base

app = FastAPI(title="Omni Task Manager", version="1.0.0")

# CORS - React frontend-ի հետ աշխատելու համար
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {"message": "Omni Task Manager API is running!"}

@app.get("/health")
async def health():
    return {"status": "ok"}