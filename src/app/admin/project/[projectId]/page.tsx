"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { MOCK_PROJECTS, MOCK_USERS, MOCK_TASKS } from "@/lib/mock-data";
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  CheckCircle2, 
  FileText, 
  Upload,
  Save,
  Trash2,
  Plus,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

type Tab = "overview" | "tasks" | "files" | "settings";
type ProjectStatus = "hearing" | "concept" | "wireframe" | "design" | "delivery";

export default function AdminProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const project = MOCK_PROJECTS.find(p => p._id === projectId);
  
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [status, setStatus] = useState<ProjectStatus>((project?.status as ProjectStatus) || "hearing");

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
        <h1 className="text-2xl text-white mb-4">Project Not Found</h1>
        <Link 
          href="/admin/dashboard"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const client = MOCK_USERS.find(u => u._id === project.clientId);

  // Mock Tasks for this project
  const projectTasks = MOCK_TASKS.filter(t => t.projectId === projectId);

  return (
    <div className="p-8 pb-32 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4 mb-8"
      >
        <Link 
          href="/admin/dashboard"
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-light text-white mb-1">
            {project.title}
          </h1>
          <div className="flex items-center gap-4 text-white/40 text-sm">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {client?.name || "Unknown Client"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs">
              {status.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="ml-auto flex gap-3">
           <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-all">
             <Save className="w-4 h-4" />
             Save Changes
           </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-1">
        {[
          { id: "overview", label: "Overview", icon: FileText },
          { id: "tasks", label: "Tasks", icon: CheckCircle2 },
          { id: "files", label: "Files & Artifacts", icon: Upload },
          { id: "settings", label: "Settings", icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`px-6 py-3 rounded-t-lg flex items-center gap-2 transition-all relative ${
                activeTab === tab.id
                  ? "text-white bg-white/10"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Status Card */}
            <GlassCard className="p-6 col-span-2">
              <h2 className="text-xl font-light text-white mb-6">Project Status</h2>
              <div className="grid grid-cols-5 gap-4">
                {["hearing", "concept", "wireframe", "design", "delivery"].map((s, i) => {
                  const isCurrent = status === s;
                  const isPast = ["hearing", "concept", "wireframe", "design", "delivery"].indexOf(status) > i;
                  
                  return (
                    <button
                      key={s}
                      onClick={() => setStatus(s as ProjectStatus)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all ${
                        isCurrent 
                          ? "bg-blue-500/20 border border-blue-500/50" 
                          : isPast 
                            ? "bg-blue-500/10 border border-blue-500/10 opacity-60" 
                            : "bg-white/5 border border-white/5 opacity-40 hover:opacity-80"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCurrent || isPast ? "bg-blue-500 text-white" : "bg-white/10 text-white"
                      }`}>
                        {i + 1}
                      </div>
                      <span className="text-xs uppercase font-medium text-white">
                        {s}
                      </span>
                    </button>
                  );
                })}
              </div>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-light text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-between group transition-all">
                  <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add Task</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-between group transition-all">
                  <span className="flex items-center gap-2"><Upload className="w-4 h-4" /> Upload File</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button className="w-full p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 flex items-center justify-between group transition-all">
                  <span className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Archive Project</span>
                </button>
              </div>
            </GlassCard>
            
            {/* Recent Activity (Placeholder) */}
            <GlassCard className="p-6 col-span-3">
               <h2 className="text-xl font-light text-white mb-4">Recent Activity</h2>
               <div className="text-white/40 text-sm text-center py-8">
                 No recent activity to show
               </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === "tasks" && (
           <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light text-white">Project Tasks</h2>
              <button className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-500/30 transition-all">
                <Plus className="w-4 h-4" /> Add Task
              </button>
             </div>
             
             <div className="space-y-3">
               {projectTasks.map((task) => (
                 <GlassCard key={task._id} className="p-4 flex items-center justify-between group" hover>
                   <div className="flex items-center gap-4">
                     <button className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                       task.status === "done" ? "border-green-500 bg-green-500/20" : "border-white/20 hover:border-white/40"
                     }`}>
                       {task.status === "done" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                     </button>
                     <span className={`text-white decoration-white/30 ${task.status === "done" ? "line-through opacity-50" : ""}`}>
                       {task.title}
                     </span>
                     {task.tags?.map(tag => (
                       <span key={tag} className="px-2 py-0.5 rounded text-xs bg-white/10 text-white/60">
                         {tag}
                       </span>
                     ))}
                   </div>
                   <div className="text-white/40 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                     {task.status}
                   </div>
                 </GlassCard>
               ))}
               {projectTasks.length === 0 && (
                 <div className="text-center py-12 text-white/40">
                   No tasks found for this project
                 </div>
               )}
             </div>
          </motion.div>
        )}

        {activeTab === "files" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
             className="text-center py-20 text-white/40"
          >
             Files & Artifacts management coming soon...
          </motion.div>
        )}

        {activeTab === "settings" && (
           <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
           <div className="max-w-2xl">
             <GlassCard className="p-8 space-y-6">
               <h2 className="text-xl text-white mb-6">Project Settings</h2>
               
               <div>
                 <label className="block text-white/60 text-sm mb-2">Project Title</label>
                 <input 
                   type="text" 
                   defaultValue={project.title}
                   className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                 />
               </div>
               
                <div>
                 <label className="block text-white/60 text-sm mb-2">Client</label>
                 <select 
                   defaultValue={project.clientId}
                   className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                 >
                   {MOCK_USERS.filter(u => u.role === "client").map(u => (
                     <option key={u._id} value={u._id} className="bg-zinc-900">{u.name}</option>
                   ))}
                 </select>
               </div>

                <div className="pt-6 border-t border-white/10">
                   <h3 className="text-red-400 mb-2">Danger Zone</h3>
                   <p className="text-white/40 text-sm mb-4">Once you delete a project, there is no going back. Please be certain.</p>
                   <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all">
                     Delete Project
                   </button>
                </div>
             </GlassCard>
           </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
