"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressStepBar } from "@/components/ui/progress-step-bar";
import { KanbanBoard } from "@/components/ui/kanban-board";
import { PaymentModal } from "@/components/ui/payment-modal";
import { MOCK_PROJECT, MOCK_TASKS, MOCK_INVOICE } from "@/lib/mock-data";
import { AlertCircle } from "lucide-react";

export default function PortalPage() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  return (
    <div className="space-y-12">
      {/* Payment Alert Banner - Conditional (rule L55-57) */}
      {MOCK_PROJECT.isPaymentPending && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="p-4 border-yellow-500/30 bg-yellow-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-white font-medium text-sm">
                    Payment Required
                  </p>
                  <p className="text-white/60 text-xs">
                    An invoice of ¥{MOCK_INVOICE.amount.toLocaleString()} is pending. Please complete payment to proceed.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg text-sm font-medium transition-all hover:scale-105"
              >
                View Invoice
              </button>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Hero Section: Progress Step Bar (rule L48-49) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="p-8 md:p-12" neon>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-light text-white mb-3 tracking-wide">
              {MOCK_PROJECT.title}
            </h1>
            <p className="text-white/50 text-sm uppercase tracking-[0.2em] font-mono">
              Your Journey — Phase {["hearing", "concept", "wireframe", "design", "delivery"].indexOf(MOCK_PROJECT.status) + 1} of 5
            </p>
          </div>
          
          <ProgressStepBar currentStatus={MOCK_PROJECT.status} />
        </GlassCard>
      </motion.div>

      {/* Main Content: Kanban Board (rule L50-52) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-light text-white mb-2">
            Task Board
          </h2>
          <p className="text-white/40 text-sm">
            Track your deliverables and milestones
          </p>
        </div>
        
        <KanbanBoard tasks={MOCK_TASKS} />
      </motion.div>

      {/* Payment Modal (rule L55-57) */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={MOCK_INVOICE.amount}
        currency={MOCK_INVOICE.currency}
        projectTitle={MOCK_PROJECT.title}
      />
    </div>
  );
}
