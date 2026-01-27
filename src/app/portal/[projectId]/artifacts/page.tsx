"use client";

import { motion } from "framer-motion";

export default function ArtifactsPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-light text-white mb-2">
            Deliverables
          </h1>
          <p className="text-white/40 text-sm">
            Final artifacts and deliverables from the admin
          </p>
        </div>
        
        {/* Bento Grid will be implemented */}
        <div className="text-white/60 text-center py-20">
          Artifacts page - Implementation in progress
        </div>
      </motion.div>
    </div>
  );
}
