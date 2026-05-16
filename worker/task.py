from worker.celery_app import celery_app
from faster_whisper import WhisperModel
import os

# Load model once
model = WhisperModel("base", device="cpu", compute_type="int8")

@celery_app.task
def transcribe_voice(file_path: str) -> str:
    """Transcribe voice message using faster-whisper"""
    try:
        segments, info = model.transcribe(file_path, beam_size=5)
        text = " ".join([segment.text for segment in segments])
        return text.strip()
    except Exception as e:
        print(f"Transcription error: {e}")
        return ""
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

@celery_app.task
def process_task_notification(task_id: int):
    """Send notification when task status changes"""
    print(f"Task {task_id} status updated")