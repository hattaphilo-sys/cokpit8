"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { KanbanBoard } from "@/components/ui/kanban-board";
import { MOCK_TASKS } from "@/lib/mock-data";

export default function TasksPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-light text-white mb-2">
            Task Management
          </h1>
          <p className="text-white/40 text-sm">
            Track and manage your project deliverables
          </p>
        </div>
        
        <KanbanBoard tasks={MOCK_TASKS} />
      </motion.div>
    </div>
  );
}
