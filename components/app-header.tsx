"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { Search } from "lucide-react"
import Link from "next/link"

export function AppHeader() {
  const { data: session } = useSession()

  return (
    <header className="flex h-16 items-center justify-between border-b glass shadow-sm px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Asana Clone
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/app/search">
          <Button variant="ghost" size="icon" className="hover:bg-indigo-50 hover:text-indigo-600 transition-colors rounded-full">
            <Search className="h-5 w-5" />
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-indigo-200 transition-all">
              <Avatar className="h-10 w-10 ring-2 ring-indigo-100">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white font-semibold">
                  {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 glass" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {session?.user?.name && (
                  <p className="font-medium text-gray-800">{session.user.name}</p>
                )}
                {session?.user?.email && (
                  <p className="w-[200px] truncate text-sm text-gray-500">
                    {session.user.email}
                  </p>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="hover:bg-indigo-50">
              <Link href="/app/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer hover:bg-red-50 hover:text-red-600"
              onSelect={(event) => {
                event.preventDefault()
                signOut({ callbackUrl: "/login" })
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

