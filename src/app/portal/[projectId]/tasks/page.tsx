"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { KanbanBoard } from "@/components/ui/kanban-board";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id, Doc } from "../../../../../convex/_generated/dataModel";
import { TaskModal } from "@/components/admin/CreateTaskModal";
import { useState } from "react";
import { Plus } from "lucide-react";
import { RedirectToSignIn } from "@clerk/nextjs";
import { TaskStatus } from "@/lib/mock-data";
import Link from "next/link";

export default function TasksPage() {
  const params = useParams();
  const projectId = params.projectId as Id<"projects">;
  
  const { isAuthenticated, isLoading } = useConvexAuth();
  
  const isValidId = (id: string) => /^[a-z0-9]{32}$/i.test(id) || id.length >= 20;
  const isIdValid = projectId && isValidId(projectId);
  
  // Use any or specific Convex generated types for tasks
  const tasks = useQuery(api.tasks.list, isAuthenticated && isIdValid ? { projectId } : "skip") || [];
  const updateTask = useMutation(api.tasks.update);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Doc<"tasks"> | null>(null);

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (!isAuthenticated) return <RedirectToSignIn />;

  if (!isIdValid) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white space-y-4">
      <h2 className="text-2xl font-light">Invalid Project ID</h2>
      <p className="text-white/40">The project ID &quot;{projectId}&quot; is not a valid reference.</p>
      <Link href="/admin/dashboard" className="text-blue-400 hover:underline">Go to Dashboard</Link>
    </div>
  );

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTask({ 
        taskId: taskId as Id<"tasks">, 
        patch: { status: newStatus } 
    });
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-white mb-2">
                Task Management
              </h1>
              <p className="text-white/40 text-sm">
                Track and manage your project deliverables
              </p>
            </div>
            <button 
                onClick={() => {
                  setSelectedTask(null);
                  setIsTaskModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-500/30 transition-all border border-blue-500/30 z-20 relative"
              >
                <Plus className="w-4 h-4" /> Add Task
            </button>
        </div>
        

        <KanbanBoard 
          tasks={tasks as any[]} 
          onStatusChange={handleStatusChange} 
          onTaskClick={(task) => {
             setSelectedTask(task as unknown as Doc<"tasks">);
             setIsTaskModalOpen(true);
          }}
        />
        
        <TaskModal 
            isOpen={isTaskModalOpen}
            onClose={() => setIsTaskModalOpen(false)}
            projectId={projectId}
            task={selectedTask}
        />
      </motion.div>
    </div>
  );
}
