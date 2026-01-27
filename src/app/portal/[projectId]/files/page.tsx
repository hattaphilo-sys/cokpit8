"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { FileUpload } from "@/components/ui/file-upload";
import { MOCK_FILES, MOCK_USER, File as MockFile } from "@/lib/mock-data";
import { FileText, Download, User, Calendar, Upload as UploadIcon } from "lucide-react";

export default function FilesPage() {
  const [uploadedFiles, setUploadedFiles] = useState<MockFile[]>([]);
  const sharedFiles = MOCK_FILES.filter(f => f.category === "shared_file");
  const allFiles = [...sharedFiles, ...uploadedFiles];

  const handleFileUpload = (files: File[]) => {
    console.log("Files uploaded:", files);
    // Mock: Convert to our File type
    const mockFiles: MockFile[] = files.map((file, index) => ({
      _id: `temp_${Date.now()}_${index}`,
      projectId: "proj_1",
      name: file.name,
      category: "shared_file" as const,
      type: file.type.includes("pdf") ? "pdf" : 
            file.type.includes("image") ? "image" :
            file.type.includes("video") ? "video" : "document",
      size: file.size,
      uploadedBy: MOCK_USER._id,
      uploadedAt: Date.now(),
      url: URL.createObjectURL(file),
    }));
    setUploadedFiles(prev => [...prev, ...mockFiles]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: MockFile["type"]) => {
    const iconClass = "w-8 h-8";
    switch (type) {
      case "pdf":
        return <FileText className={`${iconClass} text-red-400`} />;
      case "image":
        return <FileText className={`${iconClass} text-blue-400`} />;
      case "video":
        return <FileText className={`${iconClass} text-purple-400`} />;
      case "document":
        return <FileText className={`${iconClass} text-cyan-400`} />;
      default:
        return <FileText className={`${iconClass} text-gray-400`} />;
    }
  };

  const getUploaderName = (uploadedBy: string) => {
    return uploadedBy === MOCK_USER._id ? "You" : "Admin";
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-light text-white mb-2">
            Shared Files
          </h1>
          <p className="text-white/40 text-sm">
            Files shared between you and the admin
          </p>
        </div>

        {/* File Upload Area */}
        <GlassCard className="p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-light text-white mb-2 flex items-center gap-2">
              <UploadIcon className="w-5 h-5" />
              Upload Files
            </h2>
            <p className="text-white/40 text-sm">
              Share documents, images, and other files with your team
            </p>
          </div>
          <FileUpload onChange={handleFileUpload} />
        </GlassCard>

        {/* Files Grid */}
        {allFiles.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">No files shared yet</p>
            <p className="text-white/30 text-sm mt-2">Upload files to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allFiles.map((file, index) => (
              <motion.div
                key={file._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <GlassCard 
                  className="p-5 h-full hover:shadow-[0_0_30px_rgba(96,165,250,0.3)] cursor-pointer"
                  hover
                  neon
                >
                  {/* File Icon & Name */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm mb-1 truncate">
                        {file.name}
                      </h3>
                      <p className="text-white/40 text-xs">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  {/* File Meta */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-white/50 text-xs">
                      <User className="w-3 h-3" />
                      <span>Uploaded by {getUploaderName(file.uploadedBy)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/50 text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(file.uploadedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => {
                      console.log("Downloading:", file.name);
                      // TODO: Implement actual download
                    }}
                    className="w-full px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg text-sm font-medium transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
