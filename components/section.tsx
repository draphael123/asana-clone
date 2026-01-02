"use client"

import { useState } from "react"
import { TaskItem } from "@/components/task-item"
import { CreateTaskForm } from "@/components/create-task-form"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Section {
  id: string
  name: string
  order: number
}

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: Date | null
  order: number
  sectionId: string | null
  assignees: Array<{
    user: {
      id: string
      name: string | null
      email: string
    }
  }>
  createdBy: {
    id: string
    name: string | null
  }
  _count: {
    subtasks: number
    comments: number
  }
}

interface SectionProps {
  section: Section
  tasks: Task[]
  projectId: string
  onTaskClick: (taskId: string) => void
}

export function Section({ section, tasks, projectId, onTaskClick }: SectionProps) {
  const [isCreating, setIsCreating] = useState(false)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 px-2">
        <h3 className="font-bold text-lg text-gray-800">{section.name}</h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
        ))}

        {isCreating ? (
          <div className="rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-4">
            <CreateTaskForm
              projectId={projectId}
              sectionId={section.id}
              onCancel={() => setIsCreating(false)}
              onSuccess={() => setIsCreating(false)}
            />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all rounded-lg"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add task
          </Button>
        )}
      </div>
    </div>
  )
}

