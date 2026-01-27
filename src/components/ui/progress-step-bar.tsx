"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProjectStatus } from "@/lib/mock-data";

interface ProgressStepBarProps {
  currentStatus: ProjectStatus;
}

const STEPS: { key: ProjectStatus; label: string }[] = [
  { key: "hearing", label: "Hearing" },
  { key: "concept", label: "Concept" },
  { key: "wireframe", label: "Wireframe" },
  { key: "design", label: "Design" },
  { key: "delivery", label: "Delivery" },
];

export const ProgressStepBar = ({ currentStatus }: ProgressStepBarProps) => {
  const currentIndex = STEPS.findIndex((step) => step.key === currentStatus);

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-white/20" />
        
        {/* Active Progress Line */}
        <motion.div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Steps */}
        {STEPS.map((step, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.key} className="relative flex flex-col items-center z-10">
              <motion.div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "border-2 transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 border-white shadow-lg shadow-purple-500/50"
                    : "bg-zinc-800 border-white/30"
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-white text-sm font-bold">{index + 1}</span>
              </motion.div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium",
                  isCurrent ? "text-white" : "text-white/60"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
