import asyncio
import aiohttp
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from app.core.config import settings

API_URL = "http://backend:8000"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "👋 Բարև! Ես Omni Task Manager Bot-ն եմ!\n\n"
        "📝 Ուղարկիր ինձ տեքստ — կստեղծեմ task\n"
        "🎤 Ուղարկիր voice message — կտranscribe անեմ և կստեղծեմ task\n\n"
        "Հրամաններ:\n"
        "/tasks — տեսնել բոլոր tasks-ները\n"
        "/start — սկսել"
    )

async def get_tasks(update: Update, context: ContextTypes.DEFAULT_TYPE):
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{API_URL}/tasks/") as response:
            tasks = await response.json()
    
    if not tasks:
        await update.message.reply_text("📭 Task-եր չկան։")
        return
    
    text = "📋 Քո task-երը:\n\n"
    for task in tasks:
        status_emoji = {
            "pending": "⏳",
            "in_progress": "🔄", 
            "completed": "✅"
        }.get(task["status"], "⏳")
        text += f"{status_emoji} {task['title']}\n"
    
    await update.message.reply_text(text)

async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    title = update.message.text
    
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"{API_URL}/tasks/",
            json={"title": title, "description": "Created via Telegram"}
        ) as response:
            task = await response.json()
    
    await update.message.reply_text(
        f"✅ Task ստեղծվեց!\n\n"
        f"📝 {task['title']}\n"
        f"🆔 ID: {task['id']}"
    )

def main():
    app = Application.builder().token(settings.TELEGRAM_BOT_TOKEN).build()
    
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("tasks", get_tasks))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))
    
    print("🤖 Bot is running...")
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()