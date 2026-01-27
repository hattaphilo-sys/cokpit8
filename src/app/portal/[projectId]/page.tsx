"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressStepBar } from "@/components/ui/progress-step-bar";
import { PaymentModal } from "@/components/ui/payment-modal";
import { MOCK_PROJECT, MOCK_TASKS, MOCK_INVOICE, MOCK_FILES } from "@/lib/mock-data";
import { AlertCircle, ArrowRight, Download, FileText, Upload } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PortalHomePage() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const params = useParams();
  const projectId = params.projectId as string;

  // Filter data
  const recentTasks = MOCK_TASKS.slice(0, 3);
  const recentArtifacts = MOCK_FILES.filter(f => f.category === "artifact").slice(0, 2);
  const recentSharedFiles = MOCK_FILES.filter(f => f.category === "shared_file").slice(0, 3);

  // Helper function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-8">
      {/* Payment Alert Banner */}
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
                    An invoice of ¥{MOCK_INVOICE.amount.toLocaleString()} is pending.
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

      {/* Hero Section: Progress */}
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

      {/* Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <GlassCard className="p-6" hover>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-light text-white">Recent Tasks</h2>
              <Link
                href={`/portal/${projectId}/tasks`}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === "done" ? "bg-green-400" :
                      task.status === "in_progress" ? "bg-blue-400" :
                      task.status === "review" ? "bg-purple-400" :
                      "bg-gray-400"
                    }`} />
                    <span className="text-white text-sm font-medium">{task.title}</span>
                  </div>
                  <span className="text-xs text-white/50 capitalize">{task.status.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Artifacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard className="p-6" hover>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-light text-white">Latest Deliverables</h2>
              <Link
                href={`/portal/${projectId}/artifacts`}
                className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentArtifacts.map((file) => (
                <div
                  key={file._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{file.name}</p>
                      <p className="text-white/40 text-xs">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Shared Files */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <GlassCard className="p-6" hover>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-light text-white">Shared Files</h2>
              <Link
                href={`/portal/${projectId}/files`}
                className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentSharedFiles.map((file) => (
                <div
                  key={file._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{file.name}</p>
                      <p className="text-white/40 text-xs">
                        Uploaded {new Date(file.uploadedAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-white/40">{formatFileSize(file.size)}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GlassCard className="p-6" hover>
            <h2 className="text-xl font-light text-white mb-4">Quick Info</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Total Tasks</span>
                <span className="text-white font-semibold">{MOCK_TASKS.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Completed</span>
                <span className="text-green-400 font-semibold">
                  {MOCK_TASKS.filter(t => t.status === "done").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Deliverables</span>
                <span className="text-purple-400 font-semibold">
                  {MOCK_FILES.filter(f => f.category === "artifact").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Shared Files</span>
                <span className="text-cyan-400 font-semibold">
                  {MOCK_FILES.filter(f => f.category === "shared_file").length}
                </span>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <Link
                  href={`/portal/${projectId}/settings`}
                  className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors"
                >
                  Settings <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Payment Modal */}
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
