/** @jsxImportSource react */
import { Task, TaskStatus } from "../types/task";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onStatusChange?: (taskId: number, newStatus: TaskStatus) => void;
}

export function TaskList({ tasks, onEditTask, onDeleteTask, onStatusChange }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 rounded-lg p-8 shadow-sm border border-pink-100">
        <p className="text-gray-600 font-medium">タスクがありません。新しいタスクを追加してください。</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
