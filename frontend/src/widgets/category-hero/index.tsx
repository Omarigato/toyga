"use client";

import * as React from "react";
import { SealSvg } from "@/shared/ui/seal-svg";
import { motion } from "framer-motion";

interface CategoryHeroProps {
  title: string;
  subtitle: string;
  gradientFrom: string;
  gradientTo: string;
  children?: React.ReactNode;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

export function CategoryHero({
  title,
  subtitle,
  gradientFrom,
  gradientTo,
  children,
}: CategoryHeroProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <SealSvg size={500} className="absolute -right-32 -top-32 text-white" />
        <SealSvg size={300} className="absolute -bottom-16 -left-16 text-white" />
        <SealSvg size={200} className="absolute right-1/4 bottom-8 text-white" />
      </div>

      {children}

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center"
        >
          <motion.div variants={fadeUp} className="mb-6 flex justify-center">
            <SealSvg size={56} className="text-white" />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl"
          >
            {subtitle}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
