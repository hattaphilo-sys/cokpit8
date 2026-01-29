import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, UploadCloud, FileType, CheckCircle2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: Id<"projects">;
  category: "general" | "artifact";
}

export function FileUploadModal({ isOpen, onClose, projectId, category }: FileUploadModalProps) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFile = useMutation(api.files.saveFile);
  
  const [mode, setMode] = useState<"file" | "link">("file");
  const [file, setFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setMode("file");
    }
  };

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsUploading(true);
    try {
      if (mode === "file") {
        if (!file) return;

        // 1. Get upload URL
        const postUrl = await generateUploadUrl();

        // 2. Upload file to Storage
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) throw new Error("Upload failed");
        const { storageId } = await result.json();

        // 3. Save metadata to DB
        await saveFile({
          projectId,
          name: file.name,
          storageId,
          type: file.type || "unknown",
          size: file.size,
          category,
        });
      } else {
        // Link Mode
        if (!linkUrl || !linkTitle) return;
        
        await saveFile({
          projectId,
          name: linkTitle,
          url: linkUrl,
          type: "link",
          category,
        });
      }

      setIsSuccess(true);
      
      // Delay closing to show success state
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        // Reset logic after modal is expected to be gone or closing
        setFile(null);
        setLinkUrl("");
        setLinkTitle("");
        setMode("file");
      }, 1500);

    } catch (error) {
      console.error("Operation failed:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div>
                    <h2 className="text-xl font-medium text-white">
                        {category === "artifact" ? "Add Deliverable" : "Add Resource"}
                    </h2>
                    <p className="text-white/40 text-sm mt-1">
                        {category === "artifact" 
                            ? "Upload a key deliverable or add a link."
                            : "Share resources via file or link."}
                    </p>
                </div>
                <button onClick={onClose} className="p-2 -mr-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5">
              <button 
                onClick={() => setMode("file")}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                  mode === "file" ? "text-white" : "text-white/40 hover:text-white/60"
                }`}
              >
                Upload File
                {mode === "file" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
              </button>
              <button 
                onClick={() => setMode("link")}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                  mode === "link" ? "text-white" : "text-white/40 hover:text-white/60"
                }`}
              >
                Add Link
                {mode === "link" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
              </button>
            </div>

            <div className="p-8">
                {mode === "file" ? (
                  /* File Upload UI */
                  file ? (
                      <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center gap-4 relative group">
                           <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                               <FileType className="w-6 h-6" />
                           </div>
                           <div className="flex-1 min-w-0">
                               <h3 className="text-white font-medium truncate">{file.name}</h3>
                               <p className="text-white/40 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                           </div>
                           <button 
                              onClick={() => setFile(null)}
                              className="p-2 text-white/40 hover:text-red-400 transition-colors"
                           >
                               <X className="w-5 h-5" />
                           </button>
                      </div>
                  ) : (
                      <div 
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-white/10 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
                      >
                          <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-blue-500/20 flex items-center justify-center mb-4 transition-colors">
                              <UploadCloud className="w-8 h-8 text-white/40 group-hover:text-blue-400" />
                          </div>
                          <h3 className="text-white font-medium mb-1 group-hover:text-blue-200">Click to upload or drag & drop</h3>
                          <p className="text-white/40 text-sm">
                              Supported: Images, PDF, Zip, Videos (Max 100MB)
                          </p>
                          <input 
                              ref={fileInputRef}
                              type="file" 
                              className="hidden" 
                              onChange={(e) => e.target.files && setFile(e.target.files[0])}
                          />
                      </div>
                  )
                ) : (
                  /* Link Input UI */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Title</label>
                      <input 
                        type="text" 
                        value={linkTitle}
                        onChange={(e) => setLinkTitle(e.target.value)}
                        placeholder="e.g. Figma Design File"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-2">URL</label>
                      <input 
                        type="url" 
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>
                  </div>
                )}
            </div>

            <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-white/60 hover:text-white text-sm transition-colors font-medium"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={(mode === "file" ? !file : (!linkUrl || !linkTitle)) || isUploading || isSuccess}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-lg flex items-center gap-2 ${
                      isSuccess 
                        ? "bg-green-500 text-white shadow-green-500/25" 
                        : "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/25"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    {isUploading ? "Saving..." : isSuccess ? "Saved!" : (mode === "file" ? "Upload File" : "Add Link")}
                </button>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
