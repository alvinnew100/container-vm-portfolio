"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function StorageDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const layers = [
    { label: "Container Layer (R/W)", desc: "Ephemeral — lost on docker rm", color: "docker-amber", dashed: false },
    { label: "Image Layer 3 (R/O)", desc: "COPY app.js", color: "docker-blue", dashed: false },
    { label: "Image Layer 2 (R/O)", desc: "RUN npm install", color: "docker-blue", dashed: false },
    { label: "Image Layer 1 (R/O)", desc: "FROM node:20-alpine", color: "docker-teal", dashed: false },
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow mb-8">
      <h4 className="text-text-primary font-semibold text-sm mb-4 text-center">Container Storage Layers</h4>
      <div className="max-w-md mx-auto space-y-1">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.label}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
            className={`bg-${layer.color}/10 border border-${layer.color}/30 rounded-lg px-4 py-2 flex justify-between items-center`}
          >
            <span className={`text-${layer.color} text-xs font-semibold`}>{layer.label}</span>
            <span className="text-text-muted text-[10px]">{layer.desc}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center gap-8 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-docker-amber/20 border border-docker-amber/40" />
          <span className="text-text-muted text-[10px]">Writable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-docker-blue/20 border border-docker-blue/40" />
          <span className="text-text-muted text-[10px]">Read-only</span>
        </div>
      </div>
    </div>
  );
}

export default function StorageTypes() {
  return (
    <SectionWrapper id="sec-storage-types" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Docker Storage
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        By default, all files created inside a container are stored in the container&apos;s <strong className="text-text-primary">writable
        layer</strong>. This data is <em>ephemeral</em> — it&apos;s lost when the container is removed.
        For persistent data, Docker provides three mount types.
      </p>

      <StorageDiagram />

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            title: "Volumes",
            desc: "Managed by Docker in /var/lib/docker/volumes/. Best for persistent data. Survives container removal. Can be shared between containers. Supports volume drivers for remote storage (NFS, cloud).",
            cmd: "-v mydata:/app/data",
            color: "docker-blue",
            best: "Database files, application state",
          },
          {
            title: "Bind Mounts",
            desc: "Maps a host directory into the container. The host path must exist. Changes are bidirectional. Useful for development (live code reload). Performance depends on host filesystem.",
            cmd: "-v /host/src:/app/src",
            color: "docker-teal",
            best: "Development, config files, logs",
          },
          {
            title: "tmpfs Mounts",
            desc: "Stored in host memory only. Never written to disk. Lost when container stops. Fast but size-limited. Good for sensitive data that shouldn't persist.",
            cmd: "--tmpfs /app/tmp",
            color: "docker-violet",
            best: "Secrets, session data, temp files",
          },
        ].map((mount) => (
          <div key={mount.title} className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
            <h4 className={`text-${mount.color} font-semibold text-sm mb-2`}>{mount.title}</h4>
            <p className="text-text-secondary text-sm leading-relaxed mb-3">{mount.desc}</p>
            <code className="text-[10px] text-text-muted bg-story-surface px-2 py-1 rounded block mb-2">
              {mount.cmd}
            </code>
            <div className={`text-${mount.color} text-[10px] font-semibold`}>
              Best for: {mount.best}
            </div>
          </div>
        ))}
      </div>

      <InfoCard variant="info" title="Storage Driver: overlay2">
        Docker uses <code>overlay2</code> as the default storage driver on modern Linux. It implements
        a union filesystem that stacks image layers and the container&apos;s writable layer into a single
        merged view. It&apos;s efficient, widely supported, and the recommended driver for production.
      </InfoCard>
    </SectionWrapper>
  );
}
