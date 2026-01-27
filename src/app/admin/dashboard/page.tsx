"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { MOCK_PROJECTS, MOCK_USERS } from "@/lib/mock-data";
import { 
  FolderKanban, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Calendar,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Statistics
  const totalProjects = MOCK_PROJECTS.length;
  const activeProjects = MOCK_PROJECTS.filter(p => 
    !["delivery"].includes(p.status)
  ).length;
  const completedProjects = MOCK_PROJECTS.filter(p => 
    p.status === "delivery"
  ).length;
  const pendingPayments = MOCK_PROJECTS.filter(p => 
    p.isPaymentPending
  ).length;
  const totalClients = MOCK_USERS.filter(u => u.role === "client").length;

  // Filter projects
  const filteredProjects = selectedStatus === "all" 
    ? MOCK_PROJECTS 
    : MOCK_PROJECTS.filter(p => p.status === selectedStatus);

  const getStatusColor = (status: string) => {
    const colors = {
      hearing: "from-blue-500/20 to-cyan-500/20",
      concept: "from-purple-500/20 to-pink-500/20",
      wireframe: "from-green-500/20 to-emerald-500/20",
      design: "from-yellow-500/20 to-orange-500/20",
      delivery: "from-gray-500/20 to-slate-500/20",
    };
    return colors[status as keyof typeof colors] || "from-gray-500/20 to-gray-500/20";
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      hearing: { text: "Phase 1: Hearing", color: "bg-blue-500/20 text-blue-300" },
      concept: { text: "Phase 2: Concept", color: "bg-purple-500/20 text-purple-300" },
      wireframe: { text: "Phase 3: Wireframe", color: "bg-green-500/20 text-green-300" },
      design: { text: "Phase 4: Design", color: "bg-yellow-500/20 text-yellow-300" },
      delivery: { text: "Phase 5: Delivery", color: "bg-gray-500/20 text-gray-300" },
    };
    return badges[status as keyof typeof badges] || badges.hearing;
  };

  const getClientName = (clientId: string) => {
    const client = MOCK_USERS.find(u => u._id === clientId);
    return client?.name || "Unknown Client";
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-light text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-white/40 text-sm">
            Manage all projects and clients
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <GlassCard className="p-6" hover>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white/60 text-xs">Total Projects</p>
                  <p className="text-white text-2xl font-semibold">{totalProjects}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <GlassCard className="p-6" hover>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white/60 text-xs">Active</p>
                  <p className="text-white text-2xl font-semibold">{activeProjects}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <GlassCard className="p-6" hover>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white/60 text-xs">Completed</p>
                  <p className="text-white text-2xl font-semibold">{completedProjects}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <GlassCard className="p-6" hover>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white/60 text-xs">Pending Payment</p>
                  <p className="text-white text-2xl font-semibold">{pendingPayments}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <GlassCard className="p-6" hover>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white/60 text-xs">Total Clients</p>
                  <p className="text-white text-2xl font-semibold">{totalClients}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard className="p-2">
            <div className="flex gap-2 overflow-x-auto">
              {["all", "hearing", "concept", "wireframe", "design", "delivery"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedStatus === status
                      ? "bg-white/20 text-white"
                      : "text-white/60 hover:bg-white/10"
                  }`}
                >
                  {status === "all" ? "All Projects" : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Projects Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <BentoGrid className="auto-rows-[20rem]">
            {filteredProjects.map((project, index) => {
              const badge = getStatusBadge(project.status);
              return (
                <BentoGridItem
                  key={project._id}
                  title={project.title}
                  description={
                    <div className="space-y-3 mt-3">
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Users className="w-4 h-4" />
                        <span>{getClientName(project.clientId)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(project.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      {project.isPaymentPending && (
                        <div className="flex items-center gap-2 text-yellow-400 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>Payment Pending</span>
                        </div>
                      )}
                    </div>
                  }
                  header={
                    <div className={`flex w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br ${getStatusColor(project.status)} items-center justify-center p-6`}>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${badge.color}`}>
                        {badge.text}
                      </span>
                    </div>
                  }
                  icon={
                    <Link
                      href={`/portal/${project._id}`}
                      className="mt-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm font-medium transition-all hover:scale-105 flex items-center gap-2 w-fit"
                    >
                      View Project <ArrowRight className="w-4 h-4" />
                    </Link>
                  }
                  className={index === 0 ? "md:col-span-2" : ""}
                />
              );
            })}
          </BentoGrid>
        </motion.div>

        {/* Clients Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-light text-white mb-4">Clients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_USERS.filter(u => u.role === "client").map((client, index) => {
              const clientProjects = MOCK_PROJECTS.filter(p => p.clientId === client._id);
              return (
                <motion.div
                  key={client._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                >
                  <GlassCard className="p-6" hover>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                          {client.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{client.name}</p>
                        <p className="text-white/60 text-sm">{client.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Projects</span>
                      <span className="text-white font-semibold">{clientProjects.length}</span>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
