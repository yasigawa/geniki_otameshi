/** @jsxImportSource react */
import { Task, TaskStatus } from "../types/task";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return <Badge variant="outline">未着手</Badge>;
      case TaskStatus.IN_PROGRESS:
        return <Badge variant="secondary">進行中</Badge>;
      case TaskStatus.DONE:
        return <Badge variant="default">完了</Badge>;
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

  return (
    <Card>
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
