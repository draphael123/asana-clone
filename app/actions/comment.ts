"use server"

import { prisma } from "@/lib/prisma"
import { commentSchema } from "@/lib/validations"
import { requireAuth } from "@/lib/auth-helpers"
import { revalidatePath } from "next/cache"

export async function createComment(taskId: string, data: unknown) {
  const user = await requireAuth()
  const validated = commentSchema.parse(data)

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          workspace: {
            include: {
              memberships: {
                where: { userId: user.id },
              },
            },
          },
        },
      },
    },
  })

  if (!task) {
    return { error: "Task not found" }
  }

  if (task.project.workspace.memberships.length === 0) {
    return { error: "Access denied" }
  }

  const comment = await prisma.comment.create({
    data: {
      content: validated.content,
      taskId,
      userId: user.id,
    },
    include: {
      user: true,
    },
  })

  // Create notification for task assignees
  const assignees = await prisma.taskAssignee.findMany({
    where: { taskId },
    select: { userId: true },
  })

  if (assignees.length > 0) {
    await prisma.notification.createMany({
      data: assignees
        .filter((a) => a.userId !== user.id)
        .map((a) => ({
          type: "COMMENT_ADDED",
          title: "New comment",
          message: `${user.name || "Someone"} commented on "${task.title}"`,
          userId: a.userId,
          taskId,
          projectId: task.projectId,
        })),
    })
  }

  revalidatePath(`/app/projects/${task.projectId}`)
  return { success: true, comment }
}

export async function getComments(taskId: string) {
  const user = await requireAuth()

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          workspace: {
            include: {
              memberships: {
                where: { userId: user.id },
              },
            },
          },
        },
      },
    },
  })

  if (!task || task.project.workspace.memberships.length === 0) {
    return []
  }

  return await prisma.comment.findMany({
    where: { taskId },
    include: {
      user: true,
    },
    orderBy: { createdAt: "asc" },
  })
}

