"use server"

import { prisma } from "@/lib/prisma"
import { projectSchema } from "@/lib/validations"
import { requireWorkspaceAccess } from "@/lib/auth-helpers"
import { revalidatePath } from "next/cache"

export async function createProject(workspaceId: string, data: unknown) {
  const { user } = await requireWorkspaceAccess(workspaceId)
  const validated = projectSchema.parse(data)

  // Verify team belongs to workspace if provided
  if (validated.teamId) {
    const team = await prisma.team.findFirst({
      where: {
        id: validated.teamId,
        workspaceId,
      },
    })

    if (!team) {
      return { error: "Team not found in workspace" }
    }
  }

  const project = await prisma.project.create({
    data: {
      name: validated.name,
      description: validated.description,
      color: validated.color,
      workspaceId,
      teamId: validated.teamId || null,
      sections: {
        create: [
          { name: "To do", order: 0 },
          { name: "In progress", order: 1 },
          { name: "Done", order: 2 },
        ],
      },
    },
  })

  await prisma.eventLog.create({
    data: {
      type: "PROJECT_CREATED",
      description: `Project "${project.name}" created`,
      userId: user.id,
      workspaceId,
      projectId: project.id,
    },
  })

  revalidatePath("/app/projects")
  return { success: true, project }
}

export async function getProjects(workspaceId: string) {
  await requireWorkspaceAccess(workspaceId)

  return await prisma.project.findMany({
    where: {
      workspaceId,
      archivedAt: null,
    },
    include: {
      team: true,
      _count: {
        select: {
          tasks: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  })
}

export async function getProject(projectId: string) {
  const { project } = await requireProjectAccess(projectId)

  const projectWithDetails = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      workspace: true,
      team: true,
      sections: {
        orderBy: { order: "asc" },
      },
      columns: {
        orderBy: { order: "asc" },
      },
    },
  })

  return projectWithDetails
}

export async function updateProject(projectId: string, data: unknown) {
  const { user, project } = await requireProjectAccess(projectId)
  const validated = projectSchema.partial().parse(data)

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: validated,
  })

  await prisma.eventLog.create({
    data: {
      type: "PROJECT_UPDATED",
      description: `Project "${updated.name}" updated`,
      userId: user.id,
      workspaceId: project.workspaceId,
      projectId: updated.id,
    },
  })

  revalidatePath(`/app/projects/${projectId}`)
  return { success: true, project: updated }
}

export async function deleteProject(projectId: string) {
  const { user, project } = await requireProjectAccess(projectId)

  await prisma.project.update({
    where: { id: projectId },
    data: { archivedAt: new Date() },
  })

  await prisma.eventLog.create({
    data: {
      type: "PROJECT_DELETED",
      description: `Project "${project.name}" archived`,
      userId: user.id,
      workspaceId: project.workspaceId,
      projectId: project.id,
    },
  })

  revalidatePath("/app/projects")
  return { success: true }
}

