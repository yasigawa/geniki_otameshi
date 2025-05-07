from datetime import datetime
from typing import Dict, List, Optional
from app.models import Task, TaskCreate, TaskStatus

tasks_db: Dict[int, Task] = {}
task_id_counter = 1


def get_tasks() -> List[Task]:
    return list(tasks_db.values())


def get_task(task_id: int) -> Optional[Task]:
    return tasks_db.get(task_id)


def create_task(task: TaskCreate) -> Task:
    global task_id_counter
    now = datetime.now()
    
    new_task = Task(
        id=task_id_counter,
        title=task.title,
        description=task.description,
        status=task.status,
        created_at=now,
        updated_at=None
    )
    
    tasks_db[task_id_counter] = new_task
    task_id_counter += 1
    
    return new_task


def update_task(task_id: int, task_data: TaskCreate) -> Optional[Task]:
    if task_id not in tasks_db:
        return None
    
    task = tasks_db[task_id]
    
    updated_task = Task(
        id=task.id,
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        created_at=task.created_at,
        updated_at=datetime.now()
    )
    
    tasks_db[task_id] = updated_task
    return updated_task


def delete_task(task_id: int) -> bool:
    if task_id not in tasks_db:
        return False
    
    del tasks_db[task_id]
    return True
