# 🗂️ Omni Task Manager

A production-ready Omni-Channel Task Management System built for the AI Engineering Internship assessment.

## 🚀 Features

- **Telegram Bot** — Create tasks via text or voice messages
- **Voice Transcription** — Automatic speech-to-text using Faster-Whisper
- **REST API** — FastAPI backend with full CRUD operations
- **Real-time Dashboard** — React Kanban board with WebSocket updates
- **Async Processing** — Redis + Celery for voice transcription queue
- **Persistent Storage** — PostgreSQL database

## 🏗️ Architecture



Telegram Bot (text/voice) ↓ FastAPI Backend ←→ Redis (Celery queue) ←→ Worker (Whisper) ↓ PostgreSQL ↓ React Dashboard (WebSockets)



## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| Queue | Redis + Celery |
| Transcription | Faster-Whisper (tiny model) |
| Frontend | React + Vite |
| Real-time | WebSockets |
| Bot | python-telegram-bot |
| DevOps | Docker + Docker Compose |

## ⚙️ Setup & Installation

### Prerequisites
- Docker & Docker Compose
- Telegram Bot Token (from @BotFather)

### 1. Clone the repository
```bash
git clone https://github.com/DavidTshagharyan/omni-task-manager.git
cd omni-task-manager
```

### 2. Configure environment
```bash
cp .env.example .env
```

Fill in your `.env` file:



DATABASE_URL=postgresql+asyncpg://postgres:password@db:5432/taskmanager
REDIS_URL=redis://redis:6379/0
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
OPENAI_API_KEY=your_openai_api_key
SECRET_KEY=your_secret_key



### 3. Run with Docker
```bash
docker-compose up --build
```

### 4. Access the services
| Service | URL |
|---------|-----|
| Frontend Dashboard | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Documentation | http://localhost:8000/docs |

## 📱 Usage

### Telegram Bot
1. Find your bot on Telegram
2. Send `/start` to begin
3. Send a **text message** to create a task
4. Send a **voice message** to transcribe and create a task
5. Send `/tasks` to see all tasks

### Dashboard
- View all tasks in **Kanban board** (Pending / In Progress / Completed)
- Click status button to **update task status**
- Add new tasks directly from the dashboard
- **Real-time updates** when tasks are created via Telegram

## 🐳 Docker Services

| Service | Description |
|---------|-------------|
| `backend` | FastAPI server (port 8000) |
| `frontend` | React app (port 5173) |
| `db` | PostgreSQL database |
| `redis` | Redis message broker |
| `worker` | Celery worker for transcription |
| `bot` | Telegram bot |



