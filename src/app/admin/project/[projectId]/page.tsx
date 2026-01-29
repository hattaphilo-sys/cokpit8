"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id, Doc } from "../../../../../convex/_generated/dataModel";
import { MOCK_USERS } from "@/lib/mock-data";
import { RedirectToSignIn } from "@clerk/nextjs";
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
  ArrowRight,
  Download,
  Link2,
  Eye,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { TaskModal } from "@/components/admin/CreateTaskModal";
import { FileUploadModal } from "@/components/admin/FileUploadModal";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { FilePreviewModal } from "@/components/admin/FilePreviewModal";

type Tab = "overview" | "tasks" | "files" | "settings";
type ProjectStatus = "hearing" | "concept" | "wireframe" | "design" | "delivery";

export default function AdminProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as Id<"projects">;
  
  const { isAuthenticated, isLoading } = useConvexAuth();

  const project = useQuery(api.projects.get, isAuthenticated ? { projectId } : "skip");
  const client = useQuery(api.users.get, isAuthenticated && project ? { id: project.clientId } : "skip");
  const projectTasks = useQuery(api.tasks.list, isAuthenticated ? { projectId } : "skip") || [];
  
  // Files queries
  const artifacts = useQuery(api.files.list, isAuthenticated ? { projectId, category: "artifact" } : "skip");
  const generalFiles = useQuery(api.files.list, isAuthenticated ? { projectId, category: "general" } : "skip");
  
  const updateProjectStatus = useMutation(api.projects.updateStatus);
  const deleteFile = useMutation(api.files.deleteFile);
  
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Doc<"tasks"> | null>(null);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<"general" | "artifact">("general");

  const [downloadingId, setDownloadingId] = useState<Id<"files"> | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<any>(null);

  const handleCopyLink = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleDeleteFile = async (fileId: Id<"files">) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      await deleteFile({ fileId });
    } catch (error) {
      console.error("Failed to delete file:", error);
      alert("Failed to delete file");
    }
  };

  const handleDownload = async (file: any) => {
    if (file.type === "link") {
      window.open(file.url, "_blank");
      return;
    }

    setDownloadingId(file._id);
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(file.url, "_blank");
    } finally {
      setDownloadingId(null);
    }
  };



  if (isLoading) {
      return <div className="text-white text-center py-20">Loading...</div>;
  }
  
  if (!isAuthenticated) {
      return <RedirectToSignIn />;
  }

  
  const handleStatusChange = (newStatus: ProjectStatus) => {
      updateProjectStatus({ projectId, status: newStatus });
  };

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

  return (
    <div className="p-8 pb-32 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4 mb-8 relative z-10"
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
              {(project.status as string).toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="ml-auto flex gap-3">
           <Link 
             href={`/portal/${projectId}`}
             target="_blank"
             className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center gap-2 transition-all border border-white/10 relative z-10"
           >
             <Users className="w-4 h-4" />
             View Client Portal
           </Link>
           <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-all relative z-10">
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
              className={`px-6 py-3 rounded-t-lg flex items-center gap-2 transition-all relative z-20 ${
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
                  const isCurrent = project.status === s;
                  const isPast = ["hearing", "concept", "wireframe", "design", "delivery"].indexOf(project.status) > i;
                  
                  return (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s as ProjectStatus)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all relative z-10 ${
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
            <GlassCard className="p-6 relative z-10" hover={false}>
              <h2 className="text-xl font-light text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setSelectedTask(null);
                    setIsTaskModalOpen(true);
                  }}
                  className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-between group transition-all relative z-20"
                >
                  <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add Task</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-between group transition-all relative z-20"
                >
                  <span className="flex items-center gap-2"><Upload className="w-4 h-4" /> Upload File</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button className="w-full p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 flex items-center justify-between group transition-all relative z-20">
                  <span className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Archive Project</span>
                </button>
              </div>
            </GlassCard>
            
            {/* Recent Activity */}
            <div className="col-span-3">
              <ActivityFeed projectId={projectId} />
            </div>
          </motion.div>
        )}

        {activeTab === "tasks" && (
           <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light text-white">Project Tasks</h2>
              <button 
                onClick={() => {
                  setSelectedTask(null);
                  setIsTaskModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-500/30 transition-all relative z-30"
              >
                <Plus className="w-4 h-4" /> Add Task
              </button>
             </div>
             
             <div className="space-y-3">
               {projectTasks.map((task: Doc<"tasks">) => (
                 <GlassCard 
                    key={task._id} 
                    className="p-4 flex items-center justify-between group cursor-pointer hover:bg-white/5" 
                    hover
                    onClick={() => {
                      setSelectedTask(task);
                      setIsTaskModalOpen(true);
                    }}
                  >
                   <div className="flex items-center gap-4">
                     <button 
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all relative z-10 ${
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
             className="space-y-8"
          >
             {/* Deliverables Section */}
             <div>
               <div className="flex items-center justify-between mb-4">
                 <div>
                   <h2 className="text-xl font-light text-white">Deliverables</h2>
                    <p className="text-white/40 text-sm">Key artifacts for client review and approval</p>
                 </div>
                 <button 
                   onClick={() => {
                     setUploadCategory("artifact");
                     setIsUploadModalOpen(true);
                   }}
                   className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm flex items-center gap-2 hover:bg-purple-500/30 transition-all border border-purple-500/30 relative z-10"
                 >
                   <Plus className="w-4 h-4" /> Add Artifact
                 </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {artifacts?.map((file: any) => (
                   <GlassCard 
                        key={file._id} 
                        className="p-4 group relative cursor-pointer" 
                        hover
                        onClick={() => setPreviewFile(file)}
                    >
                       <div className="aspect-video bg-white/5 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-white/5 relative">
                         {file.type.startsWith("image") ? (
                           <img src={file.url} alt={file.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                         ) : file.type === "link" ? (
                           <Link2 className="w-12 h-12 text-white/20 group-hover:text-white/40 transition-colors" />
                         ) : (
                           <FileText className="w-12 h-12 text-white/20 group-hover:text-white/40 transition-colors" />
                         )}
                         {/* Overlay Icon */}
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                            <Eye className="w-8 h-8 text-white/80 drop-shadow-lg" />
                         </div>
                       </div>
                       
                       <div className="flex items-start justify-between">
                         <div className="min-w-0">
                           <h3 className="text-white font-medium truncate pr-2" title={file.name}>{file.name}</h3>
                           <div className="flex items-center gap-2 mt-1">
                             <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                               file.status === "approved" ? "bg-green-500/20 text-green-300" :
                               file.status === "rejected" ? "bg-red-500/20 text-red-300" :
                               "bg-yellow-500/20 text-yellow-300"
                             }`}>
                               {file.status || "PENDING"}
                             </span>
                             <span className="text-white/20 text-xs">{file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "External Link"}</span>
                           </div>
                         </div>
                         
                         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 bg-black/50 backdrop-blur rounded-lg p-1 z-20">
                            <button 
                                onClick={(e) => {
                                   e.stopPropagation();
                                   handleCopyLink(file._id, file.url);
                                }}
                                className="p-2 hover:text-white text-white/60 transition-colors relative z-20"
                                title="Copy Link"
                            >
                                <Link2 className="w-4 h-4" />
                            </button>
                            {file.type !== "link" && (
                              <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(file);
                                  }}
                                  className="p-2 hover:text-white text-white/60 transition-colors relative z-20"
                                  title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFile(file._id);
                              }}
                              className="p-2 hover:text-red-400 text-white/60 transition-colors relative z-20"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                       </div>
                    </GlassCard>
                 ))}
                 {(!artifacts || artifacts.length === 0) && (
                   <div className="col-span-full py-12 text-center border-2 border-dashed border-white/10 rounded-xl">
                     <p className="text-white/30 text-sm">No deliverables uploaded yet</p>
                   </div>
                 )}
               </div>
             </div>

             {/* Shared Files Section */}
             <div>
                <div className="flex items-center justify-between mb-4">
                 <div>
                   <h2 className="text-xl font-light text-white">Shared Files</h2>
                    <p className="text-white/40 text-sm">General resources and documents</p>
                 </div>
                 <button 
                   onClick={() => {
                     setUploadCategory("general");
                     setIsUploadModalOpen(true);
                   }}
                   className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm flex items-center gap-2 transition-all border border-white/10 relative z-10"
                 >
                   <Plus className="w-4 h-4" /> Upload File
                 </button>
               </div>

               <div className="space-y-2">
                 {generalFiles?.map((file: any) => (
                   <div 
                        key={file._id} 
                        onClick={() => setPreviewFile(file)}
                        className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer"
                    >
                       <div className="flex items-center gap-4 min-w-0">
                         <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                            {file.type.startsWith("image") ? <Eye className="w-5 h-5" /> : file.type === "link" ? <Link2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                         </div>
                         <div className="min-w-0">
                           <h4 className="text-white font-medium truncate text-sm" title={file.name}>{file.name}</h4>
                           <p className="text-white/40 text-xs">
                             Uploaded {new Date(file.uploadedAt).toLocaleDateString()} • {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "External Link"}
                           </p>
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity relative z-20">
                          <button 
                                onClick={(e) => {
                                   e.stopPropagation();
                                   handleCopyLink(file._id, file.url);
                                }}
                                className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors relative z-20"
                                title="Copy Link"
                            >
                                {copiedId === file._id ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Link2 className="w-4 h-4" />
                                )}
                                {copiedId === file._id && (
                                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-green-500 text-white text-[10px] rounded shadow-lg whitespace-nowrap">
                                    Copied!
                                  </span>
                                )}
                            </button>
                          {file.type !== "link" && (
                            <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(file);
                                  }}
                                  disabled={downloadingId === file._id}
                                  className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors relative z-20"
                                  title="Download"
                              >
                                {downloadingId === file._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                              </button>
                          )}
                          <button 
                             onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFile(file._id);
                             }}
                             className="p-2 hover:bg-red-500/10 rounded-lg text-white/60 hover:text-red-400 transition-colors relative z-20"
                             title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 ))}
                 {(!generalFiles || generalFiles.length === 0) && (
                   <div className="text-center py-8 text-white/30 text-sm">
                     No shared files yet
                   </div>
                 )}
               </div>
             </div>
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
                   <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all relative z-10">
                     Delete Project
                   </button>
                </div>
             </GlassCard>
           </div>
          </motion.div>
        )}
      </div>
      
      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={projectId}
        task={selectedTask}
      />
      
      <FileUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        projectId={projectId}
        category={uploadCategory}
      />

      <FilePreviewModal 
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />
    </div>
  );
}
