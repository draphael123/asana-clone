"use client"

import { useState } from "react"
import { TaskItem } from "@/components/task-item"
import { CreateTaskForm } from "@/components/create-task-form"
import { Section } from "@/components/section"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Project {
  id: string
  sections: Array<{
    id: string
    name: string
    order: number
  }>
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

interface ListViewProps {
  project: Project
  tasks: Task[]
  onTaskClick: (taskId: string) => void
}

export function ListView({ project, tasks, onTaskClick }: ListViewProps) {
  const [creatingSection, setCreatingSection] = useState(false)

  const sections = project.sections.sort((a, b) => a.order - b.order)

  const tasksBySection = sections.reduce((acc, section) => {
    acc[section.id] = tasks
      .filter((task) => task.sectionId === section.id)
      .sort((a, b) => a.order - b.order)
    return acc
  }, {} as Record<string, Task[]>)

  return (
    <div className="p-6">
      <div className="space-y-6">
        {sections.map((section) => (
          <Section
            key={section.id}
            section={section}
            tasks={tasksBySection[section.id] || []}
            projectId={project.id}
            onTaskClick={onTaskClick}
          />
        ))}

        {creatingSection ? (
          <div className="rounded-lg border-2 border-dashed p-4">
            <CreateTaskForm
              projectId={project.id}
              onCancel={() => setCreatingSection(false)}
              onSuccess={() => setCreatingSection(false)}
            />
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setCreatingSection(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Button>
        )}
      </div>
    </div>
  )
}

