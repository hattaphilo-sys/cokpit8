import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Plus, Trash2, Save } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id, Doc } from "../../../convex/_generated/dataModel";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: Id<"projects">;
  task?: Doc<"tasks"> | null;
}

export function TaskModal({ isOpen, onClose, projectId, task }: TaskModalProps) {
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const deleteTask = useMutation(api.tasks.deleteTask);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"todo" | "in_progress" | "review" | "done">("todo");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const isEditMode = !!task;

  useEffect(() => {
    setIsConfirmingDelete(false); // Reset delete confirmation state
    if (task) {
      setTitle(task.title);
      setStatus(task.status as "todo" | "in_progress" | "review" | "done");
    } else {
      setTitle("");
      setStatus("todo");
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    try {
      if (task) {
        await updateTask({
          taskId: task._id,
          patch: {
            title,
            status,
          },
        });
      } else {
        await createTask({
          projectId,
          title,
          status,
        });
      }
      onClose();
      if (!task) {
        setTitle("");
        setStatus("todo");
      }
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    
    setIsDeleting(true);
    try {
      await deleteTask({ taskId: task._id });
      onClose();
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsDeleting(false);
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
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div>
                <h2 className="text-xl font-medium text-white">
                  {isEditMode ? "Update Task" : "Create New Task"}
                </h2>
                <p className="text-white/40 text-sm mt-1">
                  {isEditMode 
                    ? "Modify task details or change status" 
                    : "Add a new actionable item to this project"}
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 -mr-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {isConfirmingDelete ? (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                >
                  <h3 className="text-red-400 font-medium mb-2">Delete Task?</h3>
                  <p className="text-white/60 text-sm mb-4">
                    This action cannot be undone. This task will be permanently removed from the project.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsConfirmingDelete(false)}
                      className="px-4 py-2 bg-transparent hover:bg-white/5 text-white/60 hover:text-white rounded-lg text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      Confirm Delete
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form id="task-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Task Title</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Design Homepage Hero Section"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/5 transition-all text-sm"
                      autoFocus
                    />
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-white/60">Status</label>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                       {(["todo", "in_progress", "review", "done"] as const).map((s) => (
                         <button
                           key={s}
                           type="button"
                           onClick={() => setStatus(s)}
                           className={`p-3 rounded-xl text-xs font-medium border transition-all flex items-center justify-center capitalize ${
                             status === s 
                               ? "bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                               : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
                           }`}
                         >
                           {s.replace("_", " ")}
                         </button>
                       ))}
                     </div>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            {!isConfirmingDelete && (
              <div className="p-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-between gap-3">
                 {isEditMode ? (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="px-4 py-2 bg-transparent hover:bg-red-500/10 text-white/40 hover:text-red-400 rounded-lg text-sm transition-colors flex items-center gap-2 group"
                  >
                    <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                ) : <div />}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-white/60 hover:text-white text-sm transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="task-form"
                    disabled={!title.trim() || isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      isEditMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />
                    )}
                    {isEditMode ? "Save Changes" : "Create Task"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
