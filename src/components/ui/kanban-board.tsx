"use client";

import { motion } from "framer-motion";
import { GlassCard } from "./glass-card";
import { Task, TaskStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick?: (task: Task) => void;
}

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: "from-gray-500/20 to-gray-600/20" },
  { id: "in_progress", label: "In Progress", color: "from-blue-500/20 to-cyan-500/20" },
  { id: "review", label: "Review", color: "from-purple-500/20 to-pink-500/20" },
  { id: "done", label: "Done", color: "from-green-500/20 to-emerald-500/20" },
];

export const KanbanBoard = ({ tasks, onStatusChange, onTaskClick }: KanbanBoardProps) => {
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId && onStatusChange) {
      onStatusChange(taskId, status);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {COLUMNS.map((column, colIndex) => {
        const columnTasks = tasks.filter((task) => task.status === column.id);
        
        return (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: colIndex * 0.1 }}
            className="flex flex-col gap-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                {column.label}
              </h3>
              <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-full">
                {columnTasks.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="space-y-3 min-h-[200px] h-full rounded-xl transition-colors hover:bg-white/5 p-2 -m-2">
              {columnTasks.map((task, taskIndex) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: taskIndex * 0.05 }}
                >
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, task._id)}
                    onClick={() => onTaskClick?.(task)}
                    className="cursor-move cursor-pointer"
                  >
                  <GlassCard 
                    className={cn(
                      "p-4 group",
                      "hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]",
                      "transition-all duration-300"
                    )}
                    neon
                  >
                    {/* Task Title */}
                    <h4 className="text-white font-medium text-sm mb-2 group-hover:text-purple-300 transition-colors">
                      {task.title}
                    </h4>

                    {/* Task Meta */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {task.tags && task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full bg-white/10 text-white/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {task.dueDate && (
                        <span className="text-white/40">
                          {new Date(task.dueDate).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>

                    {/* Status Indicator Bar */}
                    <div className={cn(
                      "mt-3 h-1 rounded-full bg-gradient-to-r",
                      column.color
                    )} />
                  </GlassCard>
                 </div>
                </motion.div>
              ))}
              
              {/* Empty State */}
              {columnTasks.length === 0 && (
                <div className="flex items-center justify-center h-32 border-2 border-dashed border-white/10 rounded-xl pointer-events-none">
                  <p className="text-white/30 text-xs">No tasks</p>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
