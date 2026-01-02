"use server"

import { prisma } from "@/lib/prisma"
import { workspaceSchema } from "@/lib/validations"
import { requireAuth } from "@/lib/auth-helpers"
import { revalidatePath } from "next/cache"

export async function createWorkspace(data: unknown) {
  const user = await requireAuth()
  const validated = workspaceSchema.parse(data)

  // Check if slug is taken
  const existing = await prisma.workspace.findUnique({
    where: { slug: validated.slug },
  })

  if (existing) {
    return { error: "Workspace slug already taken" }
  }

  const workspace = await prisma.workspace.create({
    data: {
      name: validated.name,
      slug: validated.slug,
      memberships: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
  })

  await prisma.eventLog.create({
    data: {
      type: "MEMBER_ADDED",
      description: `Workspace "${workspace.name}" created`,
      userId: user.id,
      workspaceId: workspace.id,
    },
  })

  revalidatePath("/app")
  return { success: true, workspace }
}

export async function getWorkspaces() {
  const user = await requireAuth()

  const memberships = await prisma.membership.findMany({
    where: { userId: user.id },
    include: {
      workspace: {
        include: {
          _count: {
            select: {
              memberships: true,
              projects: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return memberships.map((m) => m.workspace)
}

export async function getWorkspace(workspaceId: string) {
  const user = await requireAuth()

  const membership = await prisma.membership.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
    include: {
      workspace: {
        include: {
          teams: true,
          _count: {
            select: {
              memberships: true,
              projects: true,
            },
          },
        },
      },
    },
  })

  if (!membership) {
    return null
  }

  return membership.workspace
}

