import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { prisma } from "./prisma"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return null
  }

  return await prisma.user.findUnique({
    where: { id: session.user.id },
  })
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function requireWorkspaceAccess(workspaceId: string) {
  const user = await requireAuth()

  const membership = await prisma.membership.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
  })

  if (!membership) {
    throw new Error("Access denied: Not a member of this workspace")
  }

  return { user, membership }
}

export async function requireProjectAccess(projectId: string) {
  const user = await requireAuth()

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      workspace: {
        include: {
          memberships: {
            where: { userId: user.id },
          },
        },
      },
    },
  })

  if (!project) {
    throw new Error("Project not found")
  }

  const membership = project.workspace.memberships[0]
  if (!membership) {
    throw new Error("Access denied: Not a member of this workspace")
  }

  return { user, project, membership }
}

