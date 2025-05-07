import { useState, useEffect } from 'react'
import './App.css'
import { Task, TaskCreate } from './types/task'
import { getTasks, createTask, updateTask, deleteTask } from './lib/api'
import { TaskList } from './components/TaskList'
import { TaskForm } from './components/TaskForm'
import { Button } from './components/ui/button'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog'
import { Toaster } from './components/ui/toaster'
import { useToast } from './components/ui/use-toast'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const data = await getTasks()
      setTasks(data)
      setError(null)
    } catch (err) {
      setError('タスクの取得に失敗しました。')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = async (taskData: TaskCreate) => {
    try {
      const newTask = await createTask(taskData)
      setTasks([...tasks, newTask])
      setIsFormOpen(false)
      toast({
        title: "タスク作成",
        description: "タスクが正常に作成されました。",
      })
    } catch (err) {
      toast({
        title: "エラー",
        description: "タスクの作成に失敗しました。",
        variant: "destructive",
      })
      console.error(err)
    }
  }

  const handleUpdateTask = async (taskData: TaskCreate) => {
    if (!editingTask) return

    try {
      const updated = await updateTask(editingTask.id, taskData)
      setTasks(tasks.map(task => task.id === editingTask.id ? updated : task))
      setEditingTask(null)
      toast({
        title: "タスク更新",
        description: "タスクが正常に更新されました。",
      })
    } catch (err) {
      toast({
        title: "エラー",
        description: "タスクの更新に失敗しました。",
        variant: "destructive",
      })
      console.error(err)
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId)
      setTasks(tasks.filter(task => task.id !== taskId))
      toast({
        title: "タスク削除",
        description: "タスクが正常に削除されました。",
      })
    } catch (err) {
      toast({
        title: "エラー",
        description: "タスクの削除に失敗しました。",
        variant: "destructive",
      })
      console.error(err)
    }
  }

  const openCreateForm = () => {
    setEditingTask(null)
    setIsFormOpen(true)
  }

  const openEditForm = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingTask(null)
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">タスク管理システム</h1>
          <Button onClick={openCreateForm}>
            <Plus className="mr-2 h-4 w-4" /> 新規タスク
          </Button>
        </header>

        {isLoading ? (
          <div className="text-center py-8">
            <p>読み込み中...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onEditTask={openEditForm}
            onDeleteTask={handleDeleteTask}
          />
        )}

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTask ? 'タスクを編集' : '新規タスク作成'}
              </DialogTitle>
            </DialogHeader>
            <TaskForm
              initialData={editingTask ? {
                title: editingTask.title,
                description: editingTask.description,
                status: editingTask.status
              } : undefined}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={closeForm}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </>
  )
}

export default App
