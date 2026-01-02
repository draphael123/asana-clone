import { getProject } from "@/app/actions/project"
import { getTasks } from "@/app/actions/task"
import { ProjectView } from "@/components/project-view"
import { notFound } from "next/navigation"

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: { projectId: string }
  searchParams: { view?: string; task?: string }
}) {
  const project = await getProject(params.projectId)

  if (!project) {
    notFound()
  }

  const tasks = await getTasks(params.projectId)

  return (
    <ProjectView
      project={project}
      tasks={tasks}
      view={searchParams.view || "list"}
      selectedTaskId={searchParams.task}
    />
  )
}

