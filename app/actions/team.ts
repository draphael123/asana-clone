"use server"

import { prisma } from "@/lib/prisma"
import { teamSchema } from "@/lib/validations"
import { requireWorkspaceAccess } from "@/lib/auth-helpers"
import { revalidatePath } from "next/cache"

export async function createTeam(workspaceId: string, data: unknown) {
  const { user } = await requireWorkspaceAccess(workspaceId)
  const validated = teamSchema.parse(data)

  const team = await prisma.team.create({
    data: {
      name: validated.name,
      description: validated.description,
      workspaceId,
    },
  })

  await prisma.eventLog.create({
    data: {
      type: "PROJECT_CREATED",
      description: `Team "${team.name}" created`,
      userId: user.id,
      workspaceId,
    },
  })

  revalidatePath("/app")
  return { success: true, team }
}

export async function getTeams(workspaceId: string) {
  await requireWorkspaceAccess(workspaceId)

  return await prisma.team.findMany({
    where: { workspaceId },
    include: {
      _count: {
        select: {
          projects: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

