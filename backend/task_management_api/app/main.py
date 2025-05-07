from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from typing import List

from app.models import Task, TaskCreate, TaskStatus
from app.database import get_tasks, get_task, create_task, update_task, delete_task

app = FastAPI(title="Task Management API")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/tasks", response_model=List[Task])
async def read_tasks():
    return get_tasks()

@app.post("/tasks", response_model=Task, status_code=201)
async def create_new_task(task: TaskCreate):
    return create_task(task)

@app.get("/tasks/{task_id}", response_model=Task)
async def read_task(task_id: int):
    task = get_task(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.put("/tasks/{task_id}", response_model=Task)
async def update_existing_task(task_id: int, task: TaskCreate):
    updated_task = update_task(task_id, task)
    if updated_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task

@app.delete("/tasks/{task_id}", status_code=204)
async def delete_existing_task(task_id: int):
    success = delete_task(task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return None
