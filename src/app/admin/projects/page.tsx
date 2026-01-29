"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { RedirectToSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Calendar, FolderKanban } from "lucide-react";

export default function AllProjectsPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const projects = useQuery(api.projects.list, isAuthenticated ? {} : "skip") || [];

  if (isLoading) return <div className="text-white text-center py-20">Loading...</div>;
  if (!isAuthenticated) return <RedirectToSignIn />;

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

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-light text-white mb-2">All Projects</h1>
        <p className="text-white/40 text-sm mb-8">Overview of all ongoing and completed projects</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-6 h-full flex flex-col" hover>
                <div className={`h-32 rounded-lg bg-gradient-to-br ${getStatusColor(project.status)} mb-4 flex items-center justify-center`}>
                    <FolderKanban className="w-8 h-8 text-white/20" />
                </div>
                
                <h3 className="text-xl text-white font-light mb-2">{project.title}</h3>
                
                <div className="space-y-2 mb-6 flex-1">
                   <div className="flex items-center gap-2 text-white/50 text-xs">
                     <Calendar className="w-3 h-3" />
                     {new Date(project.createdAt).toLocaleDateString()}
                   </div>
                   <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider">
                     <div className={`w-2 h-2 rounded-full bg-white/50`} />
                     {project.status}
                   </div>
                </div>

                <Link 
                   href={`/admin/project/${project._id}`}
                   className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  Manage Project <ArrowRight className="w-3 h-3" />
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
            <div className="text-center py-20 text-white/30">
                No projects found. Create one from the sidebar.
            </div>
        )}
      </motion.div>
    </div>
  );
}
