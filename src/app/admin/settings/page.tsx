"use client";

// import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[50vh] flex flex-col items-center justify-center text-center">
        <GlassCard className="p-12">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
                <Settings className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-2xl text-white mb-2">System Settings</h1>
            <p className="text-white/40">Global configurations will appear here.</p>
        </GlassCard>
    </div>
  );
}
