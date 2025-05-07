/** @jsxImportSource react */
import { Task, TaskStatus } from "../types/task";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Pencil, Trash2, CheckCircle, Clock, PlayCircle } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onStatusChange?: (taskId: number, newStatus: TaskStatus) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">未着手</Badge>;
      case TaskStatus.IN_PROGRESS:
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">進行中</Badge>;
      case TaskStatus.DONE:
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">完了</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy年MM月dd日 HH:mm", { locale: ja });
    } catch (error) {
      return "日付不明";
    }
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (onStatusChange && task.status !== newStatus) {
      onStatusChange(task.id, newStatus);
    }
  };

  const getCardBgColor = () => {
    switch (task.status) {
      case TaskStatus.TODO:
        return "bg-gradient-to-br from-yellow-50 to-white";
      case TaskStatus.IN_PROGRESS:
        return "bg-gradient-to-br from-blue-50 to-white";
      case TaskStatus.DONE:
        return "bg-gradient-to-br from-green-50 to-white";
      default:
        return "";
    }
  };

  return (
    <Card className={`border-l-4 ${getCardBgColor()} ${
      task.status === TaskStatus.TODO 
        ? "border-l-yellow-400" 
        : task.status === TaskStatus.IN_PROGRESS 
          ? "border-l-blue-400" 
          : "border-l-green-400"
    }`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          {getStatusBadge(task.status)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-2">
          作成日: {formatDate(task.created_at)}
        </p>
        {task.updated_at && (
          <p className="text-sm text-gray-500 mb-2">
            更新日: {formatDate(task.updated_at)}
          </p>
        )}
        <p className="text-sm mt-2">{task.description || "説明なし"}</p>
        
        {onStatusChange && (
          <div className="flex mt-4 space-x-2">
            <Button
              variant="outline"
              size="sm"
              className={`${task.status === TaskStatus.TODO ? 'bg-yellow-100 text-yellow-800' : ''}`}
              onClick={() => handleStatusChange(TaskStatus.TODO)}
              disabled={task.status === TaskStatus.TODO}
            >
              <Clock className="h-4 w-4 mr-1" />
              未着手
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' : ''}`}
              onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}
              disabled={task.status === TaskStatus.IN_PROGRESS}
            >
              <PlayCircle className="h-4 w-4 mr-1" />
              進行中
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${task.status === TaskStatus.DONE ? 'bg-green-100 text-green-800' : ''}`}
              onClick={() => handleStatusChange(TaskStatus.DONE)}
              disabled={task.status === TaskStatus.DONE}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              完了
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(task)}
        >
          <Pencil className="h-4 w-4 mr-1" />
          編集
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          削除
        </Button>
      </CardFooter>
    </Card>
  );
}
