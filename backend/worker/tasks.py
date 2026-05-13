from worker.celery_app import celery_app

@celery_app.task
def transcribe_voice(file_path: str) -> str:
    """Transcribe voice message using OpenAI Whisper"""
    import openai
    from app.core.config import settings
    
    client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
    
    with open(file_path, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )
    
    return transcript.text

@celery_app.task
def process_task_notification(task_id: int):
    """Send notification when task status changes"""
    print(f"Task {task_id} status updated")