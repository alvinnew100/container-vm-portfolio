"use client";

import { motion } from "framer-motion";
import { useProgressStore } from "@/store/progressStore";

interface ProgressBarProps {
  lessonPrefix: string;
  total: number;
  label?: string;
}

export default function ProgressBar({
  lessonPrefix,
  total,
  label,
}: ProgressBarProps) {
  const completedCount = useProgressStore((s) =>
    s.getCompletedCount(lessonPrefix)
  );

  const pct = total > 0 ? Math.min((completedCount / total) * 100, 100) : 0;
  const allDone = completedCount >= total;

  return (
    <div className="rounded-xl border border-story-border bg-story-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-primary text-sm font-semibold">
          {label || "Lesson Progress"}
        </span>
        <span className="text-text-muted text-xs font-mono">
          {completedCount}/{total}
        </span>
      </div>

      {/* Bar */}
      <div className="relative h-2.5 rounded-full bg-story-surface overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-docker-teal"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Completed message */}
      {allDone && (
        <div className="flex items-center gap-1.5 mt-2">
          {/* Star icon */}
          <svg
            className="w-4 h-4 text-docker-amber"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-docker-teal text-xs font-semibold">
            All challenges complete!
          </span>
        </div>
      )}
    </div>
  );
}
