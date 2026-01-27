"use client";

import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-light text-white mb-2">
            Settings
          </h1>
          <p className="text-white/40 text-sm">
            Manage your preferences and account
          </p>
        </div>
        
        {/* Dark mode toggle & settings will be implemented */}
        <div className="text-white/60 text-center py-20">
          Settings page - Implementation in progress
        </div>
      </motion.div>
    </div>
  );
}
