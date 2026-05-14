from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.task import Task, TaskStatus
from app.api.websocket import manager
from pydantic import BaseModel
from typing import Optional
import json

router = APIRouter(prefix="/tasks", tags=["tasks"])

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None

class TaskUpdate(BaseModel):
    status: TaskStatus

@router.get("/")
async def get_tasks(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Task))
    tasks = result.scalars().all()
    return tasks

@router.post("/")
async def create_task(task: TaskCreate, db: AsyncSession = Depends(get_db)):
    new_task = Task(title=task.title, description=task.description)
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)
    
    # Broadcast to all connected dashboards
    await manager.broadcast(json.dumps({
        "type": "new_task",
        "task": {
            "id": new_task.id,
            "title": new_task.title,
            "description": new_task.description,
            "status": new_task.status.value,
            "source": new_task.source
        }
    }))
    
    return new_task

@router.patch("/{task_id}")
async def update_task_status(
    task_id: int,
    task_update: TaskUpdate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.status = task_update.status
    await db.commit()
    await db.refresh(task)

    # Broadcast status update
    await manager.broadcast(json.dumps({
        "type": "update_task",
        "task": {
            "id": task.id,
            "status": task.status.value
        }
    }))

    return task

@router.delete("/{task_id}")
async def delete_task(task_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    await db.delete(task)
    await db.commit()

    # Broadcast delete
    await manager.broadcast(json.dumps({
        "type": "delete_task",
        "task_id": task_id
    }))

    return {"message": "Task deleted"}