import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Download } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    _id: Id<"files">;
    name: string;
    url: string;
    type: string;
  } | null;
}

export function FilePreviewModal({ isOpen, onClose, file }: FilePreviewModalProps) {
  if (!file) return null;

  const isImage = file.type.startsWith("image/");
  const isPDF = file.type === "application/pdf";

  const handleDownload = async () => {
    if (!file) return;
    try {
      // 1. Fetch via our own API Proxy (Same Origin) to avoid CORS issues
      const proxyUrl = `/api/download/${encodeURIComponent(file.name)}?url=${encodeURIComponent(file.url)}&type=${encodeURIComponent(file.type)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) throw new Error("Download failed");

      // 2. Get the Blob
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // 3. Determine correct filename with extension
      let finalFilename = file.name;
      const mimeMap: Record<string, string> = {
          "image/jpeg": ".jpg",
          "image/png": ".png",
          "image/gif": ".gif",
          "image/webp": ".webp",
          "application/pdf": ".pdf",
          "text/plain": ".txt",
          "application/zip": ".zip",
          "application/json": ".json",
          "image/svg+xml": ".svg"
      };

      // If DB has a type, use it to ensure extension exists
      if (mimeMap[file.type] && !finalFilename.toLowerCase().endsWith(mimeMap[file.type])) {
          finalFilename += mimeMap[file.type];
      }

      // 4. Force Browser Save using Blob URL (Reliable!)
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl h-[80vh] flex flex-col bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5 z-20 relative">
              <h2 className="text-white font-medium truncate pr-4">{file.name}</h2>
              <div className="flex items-center gap-2">
                 {file.type === "link" ? (
                   <a 
                     href={file.url}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
                     title="Open Link"
                   >
                     <Download className="w-5 h-5" />
                   </a>
                 ) : (
                   <button
                     onClick={handleDownload}
                     className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
                     title="Download"
                   >
                     <Download className="w-5 h-5" />
                   </button>
                 )}
                 <a 
                   href={file.url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
                   title="Open in new tab"
                 >
                   <ExternalLink className="w-5 h-5" />
                 </a>
                 <button 
                  onClick={onClose} 
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden bg-black/20 flex items-center justify-center relative">
               {isImage ? (
                 // eslint-disable-next-line @next/next/no-img-element
                 <img 
                   src={file.url} 
                   alt={file.name} 
                   className="max-w-full max-h-full object-contain p-4"
                 />
               ) : isPDF ? (
                 <iframe 
                   src={file.url} 
                   className="w-full h-full border-0" 
                   title={file.name}
                 />
               ) : (
                 <div className="text-center p-8">
                   <p className="text-white/40 mb-4">Preview not available for this file type</p>
                   <a 
                     href={file.url} 
                     target="_blank"
                     rel="noopener noreferrer"
                     className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                   >
                     <ExternalLink className="w-4 h-4" />
                     Open File
                   </a>
                 </div>
               )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
