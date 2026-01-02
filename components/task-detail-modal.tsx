"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getTask } from "@/app/actions/task"
import { TaskDetailContent } from "@/components/task-detail-content"
import { Loader2 } from "lucide-react"

interface TaskDetailModalProps {
  taskId: string
  open: boolean
  onClose: () => void
}

export function TaskDetailModal({
  taskId,
  open,
  onClose,
}: TaskDetailModalProps) {
  const { data: task, isLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTask(taskId),
    enabled: open && !!taskId,
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : task ? (
          <TaskDetailContent task={task} />
        ) : (
          <div className="py-8 text-center text-gray-500">
            Task not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

