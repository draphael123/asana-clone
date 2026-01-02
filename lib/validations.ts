import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const workspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
})

export const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  description: z.string().optional(),
})

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  color: z.string().optional(),
  teamId: z.string().optional(),
})

export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "BLOCKED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  sectionId: z.string().optional().nullable(),
  assigneeIds: z.array(z.string()).optional(),
})

export const sectionSchema = z.object({
  name: z.string().min(1, "Section name is required"),
})

export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
})

