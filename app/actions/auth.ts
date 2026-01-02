"use server"

import { prisma } from "@/lib/prisma"
import { registerSchema, loginSchema } from "@/lib/validations"
import bcrypt from "bcryptjs"
import { signIn } from "next-auth/react"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function register(data: unknown) {
  const validated = registerSchema.parse(data)

  const existingUser = await prisma.user.findUnique({
    where: { email: validated.email },
  })

  if (existingUser) {
    return { error: "User with this email already exists" }
  }

  const hashedPassword = await bcrypt.hash(validated.password, 10)

  const user = await prisma.user.create({
    data: {
      email: validated.email,
      name: validated.name,
      password: hashedPassword,
    },
  })

  return { success: true, userId: user.id }
}

export async function login(data: unknown) {
  const validated = loginSchema.parse(data)

  const user = await prisma.user.findUnique({
    where: { email: validated.email },
  })

  if (!user || !user.password) {
    return { error: "Invalid email or password" }
  }

  const isValid = await bcrypt.compare(validated.password, user.password)

  if (!isValid) {
    return { error: "Invalid email or password" }
  }

  // Sign in will be handled by the client
  return { success: true }
}

