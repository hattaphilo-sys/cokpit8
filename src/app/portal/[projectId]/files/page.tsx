"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { FileUploadModal } from "@/components/admin/FileUploadModal"; 
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { FileText, Download, CheckCircle2, XCircle, Clock, Plus, UploadCloud, Link2, Eye, Trash2, Loader2 } from "lucide-react";
import { RedirectToSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { FilePreviewModal } from "@/components/admin/FilePreviewModal";

export default function ClientFilesPage() {
  const params = useParams();
  const projectId = params.projectId as Id<"projects">;
  
  const { isAuthenticated, isLoading } = useConvexAuth();
  
  const isValidId = (id: string) => /^[a-z0-9]{32}$/i.test(id) || id.length >= 20;
  const isIdValid = projectId && isValidId(projectId);

  // Fetch Data
  const artifacts = useQuery(api.files.list, isAuthenticated && isIdValid ? { projectId, category: "artifact" } : "skip");
  const generalFiles = useQuery(api.files.list, isAuthenticated && isIdValid ? { projectId, category: "general" } : "skip");
  
  const updateStatus = useMutation(api.files.updateArtifactStatus);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [approvingId, setApprovingId] = useState<Id<"files"> | null>(null);
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
  
  const deleteFile = useMutation(api.files.deleteFile);

  const handleDeleteFile = async (fileId: Id<"files">) => {
      if (!confirm("Are you sure you want to delete this file?")) return;
      try {
        await deleteFile({ fileId });
      } catch (error) {
        console.error("Failed to delete file:", error);
        alert("Failed to delete file (You can only delete files you uploaded)");
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
      // Fallback: open in new tab
      window.open(file.url, "_blank");
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (!isAuthenticated) return <RedirectToSignIn />;

  if (!isIdValid) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white space-y-4">
      <h2 className="text-2xl font-light">Invalid Project ID</h2>
      <p className="text-white/40">The project ID &quot;{projectId}&quot; is not a valid reference.</p>
      <Link href="/admin/dashboard" className="text-blue-400 hover:underline">Go to Dashboard</Link>
    </div>
  );

  const handleApproval = async (fileId: Id<"files">, status: "approved" | "rejected") => {
    if (!confirm(`Are you sure you want to ${status} this deliverable?`)) return;
    
    setApprovingId(fileId);
    try {
      await updateStatus({ fileId, status });
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* 1. Deliverables (Artifacts) Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-light text-white flex items-center gap-3">
             <div className="w-2 h-8 bg-purple-500 rounded-full" />
             Deliverables & Artifacts
          </h2>
          <p className="text-white/40 text-sm mt-2 ml-5">
            Key project deliverables requiring your review and approval.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {artifacts?.map((file: any) => (
            <GlassCard 
                key={file._id} 
                className="p-0 overflow-hidden group cursor-pointer" 
                hover neon={file.status === "pending"}
                onClick={() => setPreviewFile(file)}
            >
               {/* Thumbnail / Preview Area */}
               <div className="aspect-video bg-black/40 relative flex items-center justify-center border-b border-white/5">
                 {file.type.startsWith("image") ? (
                   <img src={file.url} alt={file.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                 ) : (
                   <FileText className="w-16 h-16 text-white/10" />
                 )}
                 
                 {/* Overlay Icon */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 z-10">
                    <Eye className="w-10 h-10 text-white/80 drop-shadow-lg" />
                 </div>

                 {/* Status Badge Overlay */}
                 <div className="absolute top-3 right-3 z-20">
                    {file.status === "approved" && (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-medium shadow-lg backdrop-blur-md">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                      </span>
                    )}
                    {file.status === "rejected" && (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-medium shadow-lg backdrop-blur-md">
                        <XCircle className="w-3 h-3" /> Changes Requested
                      </span>
                    )}
                    {(!file.status || file.status === "pending") && (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-medium shadow-lg backdrop-blur-md animate-pulse">
                        <Clock className="w-3 h-3" /> Review Needed
                      </span>
                    )}
                 </div>
               </div>

               {/* Content Area */}
               <div className="p-5">
                 <div className="flex justify-between items-start mb-4">
                   <div className="min-w-0">
                     <h3 className="text-white font-medium truncate text-lg" title={file.name}>{file.name}</h3>
                     <p className="text-white/40 text-xs mt-1">
                       Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                     </p>
                   </div>
                   <div className="flex gap-2">
                     <button
                        onClick={(e) => {
                           e.stopPropagation();
                           handleCopyLink(file._id, file.url);
                        }}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors relative"
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
                     <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(file);
                        }}
                        disabled={downloadingId === file._id}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                        title="Download"
                      >
                        {downloadingId === file._id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                   </div>
                 </div>

                 {/* Approval Actions (Only for pending) */}
                 {(!file.status || file.status === "pending") ? (
                   <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5">
                     <button
                       onClick={() => handleApproval(file._id, "rejected")}
                       disabled={!!approvingId}
                       className="py-2 px-3 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 text-sm transition-all"
                     >
                       Request Changes
                     </button>
                     <button
                        onClick={() => handleApproval(file._id, "approved")}
                        disabled={!!approvingId}
                        className="py-2 px-3 rounded-lg bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 text-sm font-medium transition-all"
                     >
                       Approve
                     </button>
                   </div>
                 ) : (
                   <div className="mt-4 pt-4 border-t border-white/5 text-center">
                      <p className="text-sm text-white/40">
                        {file.status === "approved" ? "You approved this deliverable" : "You requested changes"}
                      </p>
                   </div>
                 )}
               </div>
            </GlassCard>
          ))}
          
          {(!artifacts || artifacts.length === 0) && (
             <div className="col-span-full py-16 text-center border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                <UploadCloud className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/40">No deliverables have been uploaded for review yet.</p>
             </div>
          )}
        </div>
      </motion.section>

      {/* 2. Shared Files Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-light text-white flex items-center gap-3">
              <div className="w-2 h-6 bg-blue-500 rounded-full" />
              Shared Files
            </h2>
            <p className="text-white/40 text-sm mt-1 ml-5">
              General project resources and documents.
            </p>
          </div>
          <button 
             onClick={() => setIsUploadModalOpen(true)}
             className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm flex items-center gap-2 transition-all border border-white/10"
           >
             <Plus className="w-4 h-4" /> Upload File
           </button>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          {generalFiles?.map((file: any, index: number) => (
             <div 
               key={file._id} 
               onClick={() => setPreviewFile(file)}
               className={`p-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer ${
                 index !== generalFiles.length - 1 ? "border-b border-white/5" : ""
               }`}
             >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                    {file.type.startsWith("image") ? <Eye className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white font-medium truncate text-sm" title={file.name}>{file.name}</h4>
                    <p className="text-white/40 text-xs">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                         onClick={(e) => {
                            e.stopPropagation();
                            handleCopyLink(file._id, file.url);
                         }}
                         className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all relative"
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
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file);
                      }}
                      disabled={downloadingId === file._id}
                      className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                      {downloadingId === file._id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                    <button 
                         onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(file._id);
                         }}
                         className="p-2 text-white/40 hover:text-red-400 hover:bg-white/10 rounded-lg transition-all"
                         title="Delete (Only if you uploaded)"
                      >
                          <Trash2 className="w-4 h-4" />
                      </button>
                </div>
             </div>
          ))}
          {(!generalFiles || generalFiles.length === 0) && (
             <div className="py-12 text-center text-white/30 text-sm">
                No shared files yet.
             </div>
          )}
        </div>
      </motion.section>

      <FileUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        projectId={projectId}
        category="general"
      />
      <FilePreviewModal 
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />
    </div>
  );
}
