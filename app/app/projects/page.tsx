import { getWorkspaces } from "@/app/actions/workspace"
import { getProjects } from "@/app/actions/project"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function ProjectsPage() {
  const workspaces = await getWorkspaces()
  const workspaceId = workspaces[0]?.id

  if (!workspaceId) {
    return <div>No workspace found</div>
  }

  const projects = await getProjects(workspaceId)

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your projects and tasks
          </p>
        </div>
        <Link href="/app/projects/new">
          <Button className="gradient-primary text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-16 glass">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center mb-6 shadow-lg">
            <Plus className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            Get started by creating your first project and organizing your work
          </p>
          <Link href="/app/projects/new">
            <Button className="gradient-primary text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 px-8">
              Create Your First Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <div key={project.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

