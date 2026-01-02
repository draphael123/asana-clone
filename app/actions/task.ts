"use server"

import { prisma } from "@/lib/prisma"
import { taskSchema, sectionSchema } from "@/lib/validations"
import { requireProjectAccess } from "@/lib/auth-helpers"
import { revalidatePath } from "next/cache"

export async function createTask(projectId: string, data: unknown) {
  const { user, project } = await requireProjectAccess(projectId)
  const validated = taskSchema.parse(data)

  // Get max order in section or project
  const maxOrder = await prisma.task.aggregate({
    where: {
      projectId,
      sectionId: validated.sectionId || null,
    },
    _max: { order: true },
  })

  const task = await prisma.task.create({
    data: {
      title: validated.title,
      description: validated.description,
      status: validated.status || "TODO",
      priority: validated.priority || "MEDIUM",
      dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
      startDate: validated.startDate ? new Date(validated.startDate) : null,
      projectId,
      sectionId: validated.sectionId || null,
      createdById: user.id,
      order: (maxOrder._max.order ?? -1) + 1,
      assignees: validated.assigneeIds
        ? {
            create: validated.assigneeIds.map((userId) => ({
              userId,
            })),
          }
        : undefined,
    },
    include: {
      assignees: {
        include: {
          user: true,
        },
      },
      createdBy: true,
    },
  })

  // Create notifications for assignees
  if (validated.assigneeIds && validated.assigneeIds.length > 0) {
    await prisma.notification.createMany({
      data: validated.assigneeIds.map((userId) => ({
        type: "TASK_ASSIGNED",
        title: "Task assigned",
        message: `You've been assigned to "${task.title}"`,
        userId,
        taskId: task.id,
        projectId,
      })),
    })
  }

  await prisma.eventLog.create({
    data: {
      type: "TASK_CREATED",
      description: `Task "${task.title}" created`,
      userId: user.id,
      workspaceId: project.workspaceId,
      projectId,
      taskId: task.id,
    },
  })

  revalidatePath(`/app/projects/${projectId}`)
  return { success: true, task }
}

export async function getTasks(projectId: string, sectionId?: string) {
  await requireProjectAccess(projectId)

  return await prisma.task.findMany({
    where: {
      projectId,
      sectionId: sectionId || undefined,
      parentId: null, // Only top-level tasks
    },
    include: {
      assignees: {
        include: {
          user: true,
        },
      },
      createdBy: true,
      _count: {
        select: {
          subtasks: true,
          comments: true,
        },
      },
    },
    orderBy: { order: "asc" },
  })
}

export async function getTask(taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          workspace: true,
        },
      },
      assignees: {
        include: {
          user: true,
        },
      },
      createdBy: true,
      subtasks: {
        include: {
          assignees: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { order: "asc" },
      },
      comments: {
        include: {
          user: true,
        },
        orderBy: { createdAt: "asc" },
      },
      section: true,
    },
  })

  if (!task) {
    return null
  }

  // Verify access
  await requireProjectAccess(task.projectId)

  return task
}

export async function updateTask(taskId: string, data: unknown) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  })

  if (!task) {
    return { error: "Task not found" }
  }

  const { user, project } = await requireProjectAccess(task.projectId)
  const validated = taskSchema.partial().parse(data)

  const updateData: any = {
    ...validated,
    dueDate: validated.dueDate ? new Date(validated.dueDate) : validated.dueDate === null ? null : undefined,
    startDate: validated.startDate ? new Date(validated.startDate) : validated.startDate === null ? null : undefined,
  }

  // Remove undefined values
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined) {
      delete updateData[key]
    }
  })

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
    include: {
      assignees: {
        include: {
          user: true,
        },
      },
    },
  })

  // Handle assignee updates
  if (validated.assigneeIds !== undefined) {
    // Remove all existing assignees
    await prisma.taskAssignee.deleteMany({
      where: { taskId },
    })

    // Add new assignees
    if (validated.assigneeIds.length > 0) {
      await prisma.taskAssignee.createMany({
        data: validated.assigneeIds.map((userId) => ({
          taskId,
          userId,
        })),
      })

      // Create notifications
      await prisma.notification.createMany({
        data: validated.assigneeIds.map((userId) => ({
          type: "TASK_ASSIGNED",
          title: "Task assigned",
          message: `You've been assigned to "${updated.title}"`,
          userId,
          taskId: updated.id,
          projectId: project.id,
        })),
      })
    }
  }

  await prisma.eventLog.create({
    data: {
      type: "TASK_UPDATED",
      description: `Task "${updated.title}" updated`,
      userId: user.id,
      workspaceId: project.workspaceId,
      projectId: project.id,
      taskId: updated.id,
    },
  })

  revalidatePath(`/app/projects/${task.projectId}`)
  return { success: true, task: updated }
}

export async function deleteTask(taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  })

  if (!task) {
    return { error: "Task not found" }
  }

  const { user, project } = await requireProjectAccess(task.projectId)

  await prisma.task.delete({
    where: { id: taskId },
  })

  await prisma.eventLog.create({
    data: {
      type: "TASK_DELETED",
      description: `Task "${task.title}" deleted`,
      userId: user.id,
      workspaceId: project.workspaceId,
      projectId: project.id,
    },
  })

  revalidatePath(`/app/projects/${task.projectId}`)
  return { success: true }
}

export async function createSection(projectId: string, data: unknown) {
  const { user, project } = await requireProjectAccess(projectId)
  const validated = sectionSchema.parse(data)

  const maxOrder = await prisma.section.aggregate({
    where: { projectId },
    _max: { order: true },
  })

  const section = await prisma.section.create({
    data: {
      name: validated.name,
      projectId,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  })

  revalidatePath(`/app/projects/${projectId}`)
  return { success: true, section }
}

export async function updateTaskOrder(
  taskId: string,
  newOrder: number,
  sectionId?: string | null
) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  })

  if (!task) {
    return { error: "Task not found" }
  }

  await requireProjectAccess(task.projectId)

  await prisma.task.update({
    where: { id: taskId },
    data: {
      order: newOrder,
      sectionId: sectionId || null,
    },
  })

  revalidatePath(`/app/projects/${task.projectId}`)
  return { success: true }
}

