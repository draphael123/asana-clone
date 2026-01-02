"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { taskSchema } from "@/lib/validations"
import { createTask } from "@/app/actions/task"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface CreateTaskFormProps {
  projectId: string
  sectionId?: string
  onCancel: () => void
  onSuccess: () => void
}

export function CreateTaskForm({
  projectId,
  sectionId,
  onCancel,
  onSuccess,
}: CreateTaskFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      sectionId: sectionId || null,
    },
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)

    try {
      const result = await createTask(projectId, {
        ...data,
        sectionId: sectionId || data.sectionId,
      })

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Task created successfully",
        })
        reset()
        onSuccess()
        router.refresh()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 animate-scale-in">
      <Input
        {...register("title")}
        placeholder="Task title"
        autoFocus
        className={cn(
          "border-2 focus:border-indigo-500 focus:ring-indigo-500 transition-all",
          errors.title && "border-red-500 focus:border-red-500 focus:ring-red-500"
        )}
      />
      {errors.title && (
        <p className="text-xs text-red-500 font-medium">{errors.title.message as string}</p>
      )}

      <Textarea
        {...register("description")}
        placeholder="Description (optional)"
        rows={2}
        className="border-2 focus:border-indigo-500 focus:ring-indigo-500 transition-all resize-none"
      />

      <div className="flex gap-2 pt-2">
        <Button 
          type="submit" 
          size="sm" 
          disabled={isLoading}
          className="gradient-primary text-white shadow-md hover:shadow-lg transition-all flex-1"
        >
          {isLoading ? "Creating..." : "Add Task"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
          className="hover:bg-gray-100"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

