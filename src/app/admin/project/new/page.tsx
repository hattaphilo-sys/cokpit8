"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useMutation(api.projects.create);
  
  const [title, setTitle] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const projectId = await createProject({
        title,
        clientEmail,
      });
      router.push(`/admin/project/${projectId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto min-h-screen flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link 
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <GlassCard className="p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-light text-white mb-2">New Project</h1>
            <p className="text-white/40 text-sm">Initialize a new project and invite a client</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/60 text-sm mb-2">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Website Redesign"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-white/20"
              />
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-2">Client Email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@example.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-white/20"
              />
              <p className="text-white/30 text-xs mt-2">
                An invitation will be sent to this email address if they don't have an account.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Project
                </>
              )}
            </button>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
