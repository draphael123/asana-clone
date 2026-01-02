"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FolderKanban,
  Inbox,
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Workspace {
  id: string
  name: string
  slug: string
}

interface AppSidebarProps {
  workspaces: Workspace[]
}

export function AppSidebar({ workspaces }: AppSidebarProps) {
  const pathname = usePathname()
  const [expandedProjects, setExpandedProjects] = useState<string[]>([])

  const currentWorkspace = workspaces[0] // TODO: Add workspace switcher

  const navItems = [
    {
      title: "Projects",
      href: "/app/projects",
      icon: FolderKanban,
    },
    {
      title: "Inbox",
      href: "/app/inbox",
      icon: Inbox,
    },
    {
      title: "Search",
      href: "/app/search",
      icon: Search,
    },
  ]

  return (
    <div className="flex h-full w-64 flex-col border-r glass shadow-xl">
      <div className="flex h-16 items-center border-b border-white/20 px-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start hover:bg-white/20 transition-all">
              <span className="truncate font-semibold text-gray-800">
                {currentWorkspace?.name || "Select workspace"}
              </span>
              <ChevronDown className="ml-auto h-4 w-4 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 glass">
            {workspaces.map((workspace) => (
              <DropdownMenuItem key={workspace.id} asChild>
                <Link href={`/app?workspace=${workspace.id}`} className="hover:bg-indigo-50">
                  {workspace.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 animate-fade-in",
                "hover:scale-105 hover:shadow-lg",
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/50"
                  : "text-gray-700 hover:bg-white/60 hover:shadow-md"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/20 p-4 bg-gradient-to-t from-indigo-50/50 to-transparent">
        <Button className="w-full gradient-primary text-white shadow-lg hover:shadow-xl transition-all hover:scale-105" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
    </div>
  )
}

