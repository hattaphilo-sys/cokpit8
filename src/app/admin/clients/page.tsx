"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Users } from "lucide-react";

export default function ClientsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto min-h-[50vh] flex flex-col items-center justify-center text-center">
        <GlassCard className="p-12">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl text-white mb-2">Client Management</h1>
            <p className="text-white/40">This module is currently under development.</p>
        </GlassCard>
    </div>
  );
}
