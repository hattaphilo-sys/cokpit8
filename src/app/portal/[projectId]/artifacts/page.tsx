"use client";

import { motion } from "framer-motion";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { MOCK_FILES, File } from "@/lib/mock-data";
import { FileText, Download, Calendar, HardDrive } from "lucide-react";

export default function ArtifactsPage() {
  const artifacts = MOCK_FILES.filter(f => f.category === "artifact");

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: File["type"]) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-6 h-6 text-red-400" />;
      case "image":
        return <FileText className="w-6 h-6 text-blue-400" />;
      case "video":
        return <FileText className="w-6 h-6 text-purple-400" />;
      case "document":
        return <FileText className="w-6 h-6 text-cyan-400" />;
      default:
        return <FileText className="w-6 h-6 text-gray-400" />;
    }
  };

  const handleDownload = (file: File) => {
    console.log("Downloading:", file.name);
    // TODO: Implement actual download
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
            Deliverables
          </h1>
          <p className="text-white/40 text-sm">
            Final artifacts and deliverables from the admin
          </p>
        </div>

        {artifacts.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">No deliverables yet</p>
          </div>
        ) : (
          <BentoGrid>
            {artifacts.map((file, index) => (
              <BentoGridItem
                key={file._id}
                title={file.name}
                description={
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2 text-white/50">
                      <HardDrive className="w-3 h-3" />
                      <span>{formatFileSize(file.size)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/50">
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
                }
                header={
                  <div className="flex w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 items-center justify-center">
                    {getFileIcon(file.type)}
                  </div>
                }
                icon={
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(file);
                    }}
                    className="mt-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-sm font-medium transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                }
                className={cn(
                  // Make first item span 2 columns on desktop for visual interest
                  index === 0 ? "md:col-span-2" : "",
                )}
                onClick={() => {
                  console.log("View details:", file.name);
                  // TODO: Open preview modal
                }}
              />
            ))}
          </BentoGrid>
        )}
      </motion.div>
    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
