"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { FolderKanban } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string | null
  color: string | null
  _count: {
    tasks: number
  }
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/app/projects/${project.id}`}>
      <Card className="group cursor-pointer p-6 gradient-card border-2 border-transparent hover:border-indigo-200 transition-all duration-300 hover:shadow-2xl hover:scale-105 animate-fade-in">
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110"
            style={{ 
              background: project.color 
                ? `linear-gradient(135deg, ${project.color} 0%, ${project.color}dd 100%)`
                : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
            }}
          >
            <FolderKanban className="h-7 w-7 text-white drop-shadow-sm" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 transition-colors">
              {project.name}
            </h3>
            {project.description && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {project.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {project._count.tasks} tasks
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

