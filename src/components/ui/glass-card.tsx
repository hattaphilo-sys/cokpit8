"use client";
import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  neon?: boolean;
}

export const GlassCard = ({ 
  className, 
  children, 
  hover = false,
  neon = false,
  ...props 
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10", // 極細のホワイトボーダー (rule L50)
        "bg-white/[0.03] backdrop-blur-[20px]", // 強いぼかし (rule L49)
        "shadow-xl shadow-black/40",
        "transition-all duration-500 ease-out overflow-hidden",
        "group",
        hover && "hover:bg-white/[0.08] hover:border-white/20 hover:scale-[1.01]",
        neon && "hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:border-purple-500/30",
        className
      )}
      {...props}
    >
      {/* Noise Texture (rule L50) */}
      <div className="absolute inset-0 glass-noise pointer-events-none" />
      
      {/* Inner Glow for materials effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
