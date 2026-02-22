"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import TerminalBlock from "@/components/story/TerminalBlock";
import InfoCard from "@/components/story/InfoCard";
import KnowledgeCheck from "@/components/story/KnowledgeCheck";

function VolumeLifecycleDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const steps = [
    { label: "Container writes", desc: "data → /app/data", color: "docker-blue", icon: "✏️" },
    { label: "Container removed", desc: "docker rm postgres", color: "docker-amber", icon: "🗑" },
    { label: "Volume persists", desc: "pgdata still on host", color: "docker-teal", icon: "💾" },
    { label: "New container mounts", desc: "-v pgdata:/data", color: "docker-blue", icon: "📦" },
    { label: "Data available!", desc: "All tables intact", color: "docker-teal", icon: "✅" },
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Volume Lifecycle: Data Survives Containers
      </h4>
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-1.5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 * i, duration: 0.4 }}
              className={`bg-${step.color}/10 border border-${step.color}/30 rounded-lg px-2.5 py-2 text-center min-w-[80px]`}
            >
              <div className="text-sm mb-0.5">{step.icon}</div>
              <div className={`text-${step.color} font-bold text-[10px]`}>{step.label}</div>
              <div className="text-text-muted text-[8px] mt-0.5">{step.desc}</div>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 * i + 0.1, duration: 0.3 }}
                className="text-text-muted text-xs font-mono"
              >
                &rarr;
              </motion.span>
            )}
          </div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="text-text-muted text-xs text-center mt-4"
      >
        Volumes decouple data from containers — destroy and recreate containers without losing data
      </motion.p>
    </div>
  );
}

function HostContainerView() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Host ↔ Container Filesystem View
      </h4>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
        {/* Host side */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-docker-teal/5 border border-docker-teal/20 rounded-xl p-4 w-full sm:w-56"
        >
          <div className="text-docker-teal font-bold text-xs mb-3 text-center">Host Filesystem</div>
          <div className="space-y-1 font-mono text-[10px]">
            <div className="text-text-muted">/var/lib/docker/volumes/</div>
            <div className="text-text-muted pl-3">└─ pgdata/</div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="text-docker-blue pl-6"
            >
              └─ _data/
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="text-docker-blue pl-9"
            >
              ├─ base/
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9, duration: 0.3 }}
              className="text-docker-blue pl-9"
            >
              ├─ global/
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.0, duration: 0.3 }}
              className="text-docker-blue pl-9"
            >
              └─ pg_wal/
            </motion.div>
          </div>
        </motion.div>

        {/* Connection arrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-center"
        >
          <div className="text-docker-violet font-mono text-sm">&harr;</div>
          <div className="text-text-muted text-[8px]">-v pgdata:</div>
          <div className="text-text-muted text-[8px]">/var/lib/postgresql/data</div>
        </motion.div>

        {/* Container side */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-docker-blue/5 border border-docker-blue/20 rounded-xl p-4 w-full sm:w-56"
        >
          <div className="text-docker-blue font-bold text-xs mb-3 text-center">Container Filesystem</div>
          <div className="space-y-1 font-mono text-[10px]">
            <div className="text-text-muted">/var/lib/postgresql/</div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="text-docker-blue pl-3"
            >
              └─ data/
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="text-docker-blue pl-6"
            >
              ├─ base/
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9, duration: 0.3 }}
              className="text-docker-blue pl-6"
            >
              ├─ global/
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.0, duration: 0.3 }}
              className="text-docker-blue pl-6"
            >
              └─ pg_wal/
            </motion.div>
          </div>
        </motion.div>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="text-text-muted text-xs text-center mt-4"
      >
        Both sides see the same files — writing in the container updates the host volume, and vice versa
      </motion.p>
    </div>
  );
}

export default function Volumes() {
  return (
    <>
    <SectionWrapper id="sec-volumes" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Working with Volumes
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        Volumes are the preferred mechanism for persisting data in Docker. They&apos;re managed by the Docker
        daemon, work on both Linux and Windows, and can be safely shared among multiple containers.
      </p>

      <VolumeLifecycleDiagram />
      <HostContainerView />

      <div className="space-y-6 mb-8">
        <TerminalBlock
          title="volume operations"
          lines={[
            "# Create a named volume",
            "$ docker volume create pgdata",
            "",
            "# Run PostgreSQL with persistent storage",
            "$ docker run -d --name postgres \\",
            "    -v pgdata:/var/lib/postgresql/data \\",
            "    -e POSTGRES_PASSWORD=secret \\",
            "    postgres:16",
            "",
            "# The data persists even if we remove the container",
            "$ docker rm -f postgres",
            "$ docker run -d --name postgres-new \\",
            "    -v pgdata:/var/lib/postgresql/data \\",
            "    -e POSTGRES_PASSWORD=secret \\",
            "    postgres:16",
            "# All databases and tables are still there!",
          ]}
        />

        <TerminalBlock
          title="volume management"
          lines={[
            "# List all volumes",
            "$ docker volume ls",
            "DRIVER    VOLUME NAME",
            "local     pgdata",
            "local     redis-data",
            "",
            "# Inspect a volume",
            "$ docker volume inspect pgdata",
            '[{"Name":"pgdata","Mountpoint":"/var/lib/docker/volumes/pgdata/_data",...}]',
            "",
            "# Remove unused volumes (dangling)",
            "$ docker volume prune",
            "WARNING! This will remove all local volumes not used by at least one container.",
            "",
            "# Backup a volume",
            "$ docker run --rm -v pgdata:/data -v $(pwd):/backup alpine \\",
            "    tar czf /backup/pgdata-backup.tar.gz -C /data .",
          ]}
        />
      </div>

      <InfoCard variant="warning" title="Volumes Survive Container Removal">
        When you <code>docker rm</code> a container, its volumes are NOT removed by default.
        Use <code>docker rm -v</code> to remove a container AND its anonymous volumes.
        Named volumes are never auto-removed — you must explicitly use <code>docker volume rm</code>.
        Run <code>docker volume prune</code> periodically to clean up unused volumes.
      </InfoCard>
    </SectionWrapper>

      <KnowledgeCheck
        id="lesson11-persist-kc1"
        question="What happens to an anonymous volume when you run 'docker rm' on its container?"
        options={["It's removed with the container", "It persists until manual cleanup"]}
        correctIndex={0}
        explanation="Anonymous volumes (created without a name via -v /data) are removed when the container is removed with docker rm. Named volumes persist. Use 'docker rm -v' explicitly or 'docker volume prune' to clean up orphaned volumes."
        hint="Anonymous vs named volumes have different lifecycle behaviors."
      />
    </>
  );
}
