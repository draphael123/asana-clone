"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ListView } from "@/components/list-view"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { TaskDetailModal } from "@/components/task-detail-modal"

interface Project {
  id: string
  name: string
  description: string | null
  color: string | null
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

interface ProjectViewProps {
  project: Project
  tasks: Task[]
  view: string
  selectedTaskId?: string
}

export function ProjectView({
  project,
  tasks,
  view,
  selectedTaskId,
}: ProjectViewProps) {
  const router = useRouter()
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(!!selectedTaskId)

  const handleViewChange = (newView: string) => {
    router.push(`/app/projects/${project.id}?view=${newView}`)
  }

  const handleTaskClick = (taskId: string) => {
    router.push(`/app/projects/${project.id}?view=${view}&task=${taskId}`)
    setIsTaskModalOpen(true)
  }

  const handleCloseTaskModal = () => {
    router.push(`/app/projects/${project.id}?view=${view}`)
    setIsTaskModalOpen(false)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b glass shadow-sm px-6 py-6 bg-gradient-to-r from-white via-indigo-50/30 to-purple-50/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {project.name}
            </h1>
            {project.description && (
              <p className="mt-2 text-gray-600">{project.description}</p>
            )}
          </div>
          <Button 
            onClick={() => {
              // TODO: Open task creation form
            }}
            className="gradient-primary text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        <div className="mt-4">
          <Tabs value={view} onValueChange={handleViewChange}>
            <TabsList className="bg-white/60 backdrop-blur-sm">
              <TabsTrigger value="list" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                List
              </TabsTrigger>
              <TabsTrigger value="board" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                Board
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                Timeline
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {view === "list" && (
          <ListView
            project={project}
            tasks={tasks}
            onTaskClick={handleTaskClick}
          />
        )}
        {view === "board" && (
          <div className="p-6">
            <p className="text-gray-500">Board view coming in Milestone 2</p>
          </div>
        )}
        {view === "timeline" && (
          <div className="p-6">
            <p className="text-gray-500">Timeline view coming in Milestone 4</p>
          </div>
        )}
      </div>

      {selectedTaskId && (
        <TaskDetailModal
          taskId={selectedTaskId}
          open={isTaskModalOpen}
          onClose={handleCloseTaskModal}
        />
      )}
    </div>
  )
}

