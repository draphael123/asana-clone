"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { formatDate, formatRelativeTime } from "@/lib/utils"
import { getComments, createComment } from "@/app/actions/comment"
import { updateTask } from "@/app/actions/task"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Calendar, User, MessageSquare } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: Date | null
  startDate: Date | null
  assignees: Array<{
    user: {
      id: string
      name: string | null
      email: string
    }
  }>
  createdBy: {
    id: string
    name: string | null
  }
  subtasks: Array<{
    id: string
    title: string
    status: string
  }>
  comments: Array<{
    id: string
    content: string
    createdAt: Date
    user: {
      id: string
      name: string | null
      email: string
    }
  }>
  project: {
    id: string
    name: string
  }
}

interface TaskDetailContentProps {
  task: Task
}

export function TaskDetailContent({ task: initialTask }: TaskDetailContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: comments } = useQuery({
    queryKey: ["comments", initialTask.id],
    queryFn: () => getComments(initialTask.id),
    initialData: initialTask.comments,
  })

  const updateTaskMutation = useMutation({
    mutationFn: (data: any) => updateTask(initialTask.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", initialTask.id] })
      router.refresh()
    },
  })

  const createCommentMutation = useMutation({
    mutationFn: (content: string) => createComment(initialTask.id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", initialTask.id] })
      setComment("")
      router.refresh()
    },
  })

  const handleStatusChange = (status: string) => {
    updateTaskMutation.mutate({ status })
  }

  const handlePriorityChange = (priority: string) => {
    updateTaskMutation.mutate({ priority })
  }

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTaskMutation.mutate({ dueDate: e.target.value || null })
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setIsSubmitting(true)
    try {
      await createCommentMutation.mutateAsync(comment)
      toast({
        title: "Success",
        description: "Comment added",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Task Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">{initialTask.title}</h2>
          {initialTask.description && (
            <p className="mt-2 text-gray-600">{initialTask.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Status</Label>
            <Select
              value={initialTask.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">To Do</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Priority</Label>
            <Select
              value={initialTask.priority}
              onValueChange={handlePriorityChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Due Date</Label>
            <Input
              type="date"
              value={initialTask.dueDate ? new Date(initialTask.dueDate).toISOString().split("T")[0] : ""}
              onChange={handleDueDateChange}
            />
          </div>
        </div>
      </div>

      {/* Assignees */}
      {initialTask.assignees.length > 0 && (
        <div>
          <Label className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Assignees
          </Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {initialTask.assignees.map((assignee) => (
              <div
                key={assignee.user.id}
                className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xs">
                    {assignee.user.name?.charAt(0).toUpperCase() || assignee.user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  {assignee.user.name || assignee.user.email}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <div>
        <Label className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-4 w-4" />
          Comments ({comments?.length || 0})
        </Label>

        <div className="space-y-4">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {comment.user.name?.charAt(0).toUpperCase() || comment.user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {comment.user.name || comment.user.email}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No comments yet</p>
          )}

          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              rows={2}
              className="flex-1"
            />
            <Button type="submit" disabled={isSubmitting || !comment.trim()}>
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

