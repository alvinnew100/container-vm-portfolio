"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1729] via-[#162447] to-[#1b3a5c]">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#2496ED]/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#00b8a9]/15 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#6c5ce7]/10 blur-[100px]" />
      </div>
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative text-center px-4 max-w-3xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-block mb-8 px-5 py-2 border border-white/20 rounded-full text-white/60 text-sm tracking-widest uppercase font-mono backdrop-blur-sm"
        >
          From Bare Metal to Docker Compose
        </motion.div>
        <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
          Container &amp; VM{" "}
          <span className="bg-gradient-to-r from-[#2496ED] to-[#00b8a9] bg-clip-text text-transparent">
            Fundamentals
          </span>
        </h1>
        <p className="text-xl sm:text-2xl text-white/70 mb-4 leading-relaxed">
          A complete journey through virtualization and containerization
        </p>
        <p className="text-white/40 mb-16 max-w-xl mx-auto font-mono text-sm">
          12 lessons. Scroll to begin. Everything is on this one page.
        </p>

        {/* Docker whale icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-12 flex justify-center"
        >
          <svg className="w-20 h-20 text-white/20" viewBox="0 0 100 80" fill="currentColor">
            <rect x="12" y="32" width="10" height="10" rx="1" />
            <rect x="24" y="32" width="10" height="10" rx="1" />
            <rect x="36" y="32" width="10" height="10" rx="1" />
            <rect x="48" y="32" width="10" height="10" rx="1" />
            <rect x="24" y="20" width="10" height="10" rx="1" />
            <rect x="36" y="20" width="10" height="10" rx="1" />
            <rect x="48" y="20" width="10" height="10" rx="1" />
            <rect x="36" y="8" width="10" height="10" rx="1" />
            <path d="M2 46c0 0 3-2 8-2s7 2 7 2c0 0 2-5 8-7 3-1 6 0 6 0s1-4 5-6c3-1 5 0 5 0l2-2h22c8 0 16 4 20 10 6 0 10 3 12 6 0 0-4 2-4 7s2 8 2 8-3 8-12 12c-8 4-18 4-26 2H14C7 74 2 68 2 60V46z" />
          </svg>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-white/30"
        >
          <svg
            className="w-6 h-6 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
