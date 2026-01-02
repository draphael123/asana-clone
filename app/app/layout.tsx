import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getWorkspaces } from "@/app/actions/workspace"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const workspaces = await getWorkspaces()

  if (workspaces.length === 0) {
    redirect("/onboarding")
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar workspaces={workspaces} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

