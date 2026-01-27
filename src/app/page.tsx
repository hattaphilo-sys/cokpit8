"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Link from "next/link";

export default function Home() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <TextGenerateEffect 
          words="C0KPIT Dashboard" 
          className="text-4xl md:text-7xl font-bold dark:text-white text-center"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="font-extralight text-base md:text-3xl dark:text-neutral-200 py-4 text-center max-w-2xl"
        >
          Futuristic Project Management & Strategic Orchestration. 
          Experience technical elegance.
        </motion.div>
        
        <Link href="/portal/proj_1">
          <ShimmerButton className="mt-8">
            Enter Cockpit
          </ShimmerButton>
        </Link>
      </motion.div>
    </AuroraBackground>
  );
}
