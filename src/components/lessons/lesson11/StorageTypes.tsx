"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";
import KnowledgeCheck from "@/components/story/KnowledgeCheck";
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

function MountTypeDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const mounts = [
    {
      label: "Volume",
      hostLabel: "/var/lib/docker/volumes/",
      containerLabel: "/app/data",
      color: "docker-blue",
      icon: "🗄",
    },
    {
      label: "Bind Mount",
      hostLabel: "/home/user/project/src",
      containerLabel: "/app/src",
      color: "docker-teal",
      icon: "🔗",
    },
    {
      label: "tmpfs",
      hostLabel: "RAM (memory only)",
      containerLabel: "/app/tmp",
      color: "docker-violet",
      icon: "⚡",
    },
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Three Mount Types
      </h4>
      <div className="space-y-3 max-w-lg mx-auto">
        {mounts.map((mount, i) => (
          <motion.div
            key={mount.label}
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 * i, duration: 0.4 }}
            className="flex items-center gap-2"
          >
            <div className={`bg-${mount.color}/10 border border-${mount.color}/30 rounded-lg px-3 py-2 text-center flex-1`}>
              <div className="text-text-muted text-[8px] uppercase tracking-wider">Host</div>
              <div className={`text-${mount.color} text-[10px] font-mono font-bold`}>{mount.hostLabel}</div>
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 * i + 0.1, duration: 0.3 }}
              className="text-text-muted text-xs font-mono"
            >
              &rarr;
            </motion.span>
            <div className={`bg-${mount.color}/10 border border-${mount.color}/30 rounded-lg px-3 py-2 text-center flex-1`}>
              <div className="text-text-muted text-[8px] uppercase tracking-wider">Container</div>
              <div className={`text-${mount.color} text-[10px] font-mono font-bold`}>{mount.containerLabel}</div>
            </div>
            <div className={`text-${mount.color} font-semibold text-[10px] w-20 text-right`}>{mount.label}</div>
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-text-muted text-xs text-center mt-4"
      >
        Volumes and bind mounts persist data on the host. tmpfs lives only in memory.
      </motion.p>
    </div>
  );
}

export default function StorageTypes() {
  return (
    <>
    <SectionWrapper id="sec-storage-types" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Docker Storage
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        By default, all files created inside a container are stored in the container&apos;s <strong className="text-text-primary">writable
        layer</strong>. This data is <em>ephemeral</em> — it&apos;s lost when the container is removed.
        For persistent data, Docker provides three mount types.
      </p>

      <AnalogyCard
        concept="Three Types of Storage"
        analogy="Volumes are like a rented storage unit — Docker manages them, they survive even if you move out (remove the container). Bind mounts are like a shared driveway between your house and the container — both sides see the same files. tmpfs is like a whiteboard — fast to write on, but everything is erased when you stop."
      />

      <div className="mt-8">
        <StorageDiagram />
      </div>

      <MountTypeDiagram />

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
            desc: (
              <>
                Stored in host memory only.{" "}
                <TermDefinition term="tmpfs" definition="a temporary filesystem that lives entirely in RAM — it's extremely fast but all data is lost when the container stops, since nothing is written to disk" />{" "}
                mounts are never written to disk. Lost when container stops. Good for sensitive data that shouldn&apos;t persist.
              </>
            ),
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
        a union filesystem (as we learned in Lesson 7) that stacks image layers and the container&apos;s writable layer into a single
        merged view. It&apos;s efficient, widely supported, and the recommended driver for production.
      </InfoCard>
    </SectionWrapper>

      <KnowledgeCheck
        id="lesson11-vol-kc1"
        question="Which Docker storage option is managed by Docker and persists after container removal?"
        options={["Named volumes", "Container's writable layer"]}
        correctIndex={0}
        explanation="Named volumes (docker volume create) are managed by Docker and persist independently of containers. The container's writable layer is deleted when the container is removed with docker rm."
        hint="One of these survives 'docker rm'."
      />
    </>
  );
}
