import { useState, useEffect } from 'react'
import './App.css'
import { Task, TaskCreate, TaskStatus } from './types/task'
import { getTasks, createTask, updateTask, deleteTask } from './lib/api'
import { TaskList } from './components/TaskList'
import { TaskForm } from './components/TaskForm'
import { Button } from './components/ui/button'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog'
import { Toaster } from './components/ui/toaster'
import { useToast } from './hooks/use-toast'

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

  const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId)
      if (!taskToUpdate) return

      const updateData: TaskCreate = {
        title: taskToUpdate.title,
        description: taskToUpdate.description,
        status: newStatus
      }

      const updated = await updateTask(taskId, updateData)
      setTasks(tasks.map(task => task.id === taskId ? updated : task))
      
      toast({
        title: "ステータス更新",
        description: `タスクのステータスが「${
          newStatus === TaskStatus.TODO ? "未着手" : 
          newStatus === TaskStatus.IN_PROGRESS ? "進行中" : "完了"
        }」に更新されました。`,
      })
    } catch (err) {
      toast({
        title: "エラー",
        description: "ステータスの更新に失敗しました。",
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto p-4">
          <header className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">タスク管理システム</h1>
            <Button onClick={openCreateForm} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Plus className="mr-2 h-4 w-4" /> 新規タスク
            </Button>
          </header>

          {isLoading ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <p>読み込み中...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p>{error}</p>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onEditTask={openEditForm}
              onDeleteTask={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          )}

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="bg-white rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
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
      </div>
      <Toaster />
    </>
  )
}

export default App
