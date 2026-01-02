"use client"

import { formatDate } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Calendar, MessageSquare } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: Date | null
  assignees: Array<{
    user: {
      id: string
      name: string | null
      email: string
    }
  }>
  _count: {
    subtasks: number
    comments: number
  }
}

interface TaskItemProps {
  task: Task
  onClick: () => void
}

export function TaskItem({ task, onClick }: TaskItemProps) {
  const isCompleted = task.status === "DONE"
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-xl border-2 border-transparent bg-white/80 backdrop-blur-sm p-4 transition-all duration-200 hover:border-indigo-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer animate-fade-in",
        isCompleted && "opacity-60"
      )}
      onClick={onClick}
    >
      <Checkbox checked={isCompleted} className="mt-0.5 group-hover:scale-110 transition-transform" />

      <div className="flex-1 min-w-0">
        <h4
          className={cn(
            "font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors",
            isCompleted && "line-through text-gray-400"
          )}
        >
          {task.title}
        </h4>
        {task.description && (
          <p className="mt-1.5 text-sm text-gray-600 line-clamp-1">
            {task.description}
          </p>
        )}

        <div className="mt-3 flex items-center gap-3 text-xs">
          {task.dueDate && (
            <div
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-full",
                isOverdue 
                  ? "bg-red-100 text-red-700 font-medium" 
                  : "bg-blue-50 text-blue-700"
              )}
            >
              <Calendar className="h-3 w-3" />
              {formatDate(task.dueDate)}
            </div>
          )}

          {task._count.comments > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-50 text-purple-700">
              <MessageSquare className="h-3 w-3" />
              {task._count.comments}
            </div>
          )}
        </div>
      </div>

      {task.assignees.length > 0 && (
        <div className="flex -space-x-2">
          {task.assignees.slice(0, 3).map((assignee) => (
            <Avatar key={assignee.user.id} className="h-7 w-7 border-2 border-white shadow-md hover:scale-110 transition-transform">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-400 to-purple-400 text-white font-semibold">
                {assignee.user.name?.charAt(0).toUpperCase() || assignee.user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
          {task.assignees.length > 3 && (
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-gray-300 to-gray-400 text-white text-xs font-semibold shadow-md">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

