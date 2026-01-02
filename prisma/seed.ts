import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create users
  const hashedPassword = await bcrypt.hash("password123", 10)

  const user1 = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      name: "Alice Johnson",
      password: hashedPassword,
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      name: "Bob Smith",
      password: hashedPassword,
    },
  })

  console.log("Created users:", { user1: user1.email, user2: user2.email })

  // Create workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: "demo-workspace" },
    update: {},
    create: {
      name: "Demo Workspace",
      slug: "demo-workspace",
      description: "A demo workspace for testing",
      memberships: {
        create: [
          {
            userId: user1.id,
            role: "OWNER",
          },
          {
            userId: user2.id,
            role: "MEMBER",
          },
        ],
      },
    },
    include: {
      memberships: true,
    },
  })

  console.log("Created workspace:", workspace.name)

  // Create team
  const team = await prisma.team.create({
    data: {
      name: "Engineering",
      description: "Engineering team",
      workspaceId: workspace.id,
    },
  })

  console.log("Created team:", team.name)

  // Create project
  const project = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description: "Redesigning the company website",
      color: "#6366f1",
      workspaceId: workspace.id,
      teamId: team.id,
      sections: {
        create: [
          { name: "To do", order: 0 },
          { name: "In progress", order: 1 },
          { name: "Done", order: 2 },
        ],
      },
    },
    include: {
      sections: true,
    },
  })

  console.log("Created project:", project.name)

  // Create tasks
  const section1 = project.sections[0]
  const section2 = project.sections[1]

  const task1 = await prisma.task.create({
    data: {
      title: "Design homepage mockup",
      description: "Create initial design mockups for the new homepage",
      status: "TODO",
      priority: "HIGH",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      projectId: project.id,
      sectionId: section1.id,
      createdById: user1.id,
      order: 0,
      assignees: {
        create: {
          userId: user1.id,
        },
      },
    },
  })

  const task2 = await prisma.task.create({
    data: {
      title: "Implement responsive navigation",
      description: "Build the responsive navigation component",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      projectId: project.id,
      sectionId: section2.id,
      createdById: user1.id,
      order: 0,
      assignees: {
        create: [
          {
            userId: user1.id,
          },
          {
            userId: user2.id,
          },
        ],
      },
    },
  })

  const task3 = await prisma.task.create({
    data: {
      title: "Set up project repository",
      description: "Initialize Git repository and set up CI/CD",
      status: "DONE",
      priority: "LOW",
      projectId: project.id,
      sectionId: project.sections[2].id,
      createdById: user2.id,
      order: 0,
      completedAt: new Date(),
      assignees: {
        create: {
          userId: user2.id,
        },
      },
    },
  })

  console.log("Created tasks:", [task1.title, task2.title, task3.title])

  // Create comments
  await prisma.comment.create({
    data: {
      content: "Let's make sure we follow the design system guidelines",
      taskId: task1.id,
      userId: user2.id,
    },
  })

  await prisma.comment.create({
    data: {
      content: "I've started working on this. Should be done by Friday.",
      taskId: task2.id,
      userId: user1.id,
    },
  })

  console.log("Created comments")

  // Create notifications
  await prisma.notification.create({
    data: {
      type: "TASK_ASSIGNED",
      title: "Task assigned",
      message: `You've been assigned to "${task1.title}"`,
      userId: user1.id,
      taskId: task1.id,
      projectId: project.id,
    },
  })

  console.log("Created notifications")

  console.log("✅ Seeding completed!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

