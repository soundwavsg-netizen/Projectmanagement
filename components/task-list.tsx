"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Edit2, 
  Trash2, 
  Calendar,
  Clock,
  Bot
} from "lucide-react"
import { format } from "date-fns"
import { EditTaskDialog } from "./edit-task-dialog"

interface Task {
  id: string
  title: string
  description?: string
  assignee: string
  status: string
  priority: string
  estimatedHours?: number
  actualHours?: number
  dueDate?: string
}

interface TaskListProps {
  tasks: Task[]
  onTaskUpdated: () => void
  projectId: string
}

export function TaskList({ tasks, onTaskUpdated, projectId }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        onTaskUpdated()
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive'
      case 'Medium': return 'secondary'
      case 'Low': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'default'
      case 'InProgress': return 'secondary'
      case 'Review': return 'outline'
      default: return 'outline'
    }
  }

  const groupedTasks = {
    Todo: tasks.filter(t => t.status === 'Todo'),
    InProgress: tasks.filter(t => t.status === 'InProgress'),
    Review: tasks.filter(t => t.status === 'Review'),
    Done: tasks.filter(t => t.status === 'Done'),
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(groupedTasks).map(([status, statusTasks]) => (
          <div key={status} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{status}</h3>
              <Badge variant="outline">{statusTasks.length}</Badge>
            </div>
            <div className="space-y-2">
              {statusTasks.map(task => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                        <Badge variant={getPriorityColor(task.priority as any)} className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Bot className="h-3 w-3" />
                      <span>{task.assignee}</span>
                    </div>

                    {task.dueDate && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                      </div>
                    )}

                    {task.estimatedHours && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {task.actualHours ? `${task.actualHours}h / ` : ''}
                          {task.estimatedHours}h est.
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-xs flex-1"
                        onClick={() => setEditingTask(task)}
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-xs flex-1 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(task.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {statusTasks.length === 0 && (
                <Card>
                  <CardContent className="p-4 text-center text-sm text-muted-foreground">
                    No tasks
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ))}
      </div>

      {editingTask && (
        <EditTaskDialog
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          onTaskUpdated={() => {
            setEditingTask(null)
            onTaskUpdated()
          }}
          task={editingTask}
        />
      )}
    </>
  )
}
