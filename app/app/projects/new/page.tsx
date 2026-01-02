"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { projectSchema } from "@/lib/validations"
import { createProject } from "@/app/actions/project"
import { getWorkspaces } from "@/app/actions/workspace"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function NewProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getWorkspaces().then((workspaces) => {
      if (workspaces.length > 0) {
        setWorkspaceId(workspaces[0].id)
      }
    })
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
  })

  const onSubmit = async (data: any) => {
    if (!workspaceId) {
      toast({
        title: "Error",
        description: "No workspace found",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await createProject(workspaceId, data)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Project created successfully",
        })
        router.push(`/app/projects/${result.project.id}`)
        router.refresh()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="mt-2 text-gray-600">
          Set up a new project to organize your tasks
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div>
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              {...register("name")}
              className="mt-1"
              placeholder="My Project"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              {...register("description")}
              className="mt-1"
              placeholder="What is this project about?"
              rows={4}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

