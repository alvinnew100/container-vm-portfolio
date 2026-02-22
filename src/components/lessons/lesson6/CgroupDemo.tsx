"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import TerminalBlock from "@/components/story/TerminalBlock";
import InfoCard from "@/components/story/InfoCard";
import RevealCard from "@/components/story/RevealCard";

function CgroupHierarchyDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="grid sm:grid-cols-2 gap-6 mb-8">
      {/* v1 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="bg-story-card rounded-2xl p-5 border border-story-border card-shadow"
      >
        <h4 className="text-docker-amber font-semibold text-sm mb-4 text-center">Cgroup v1: Multiple Trees</h4>
        <div className="space-y-3">
          {["cpu", "memory", "blkio"].map((ctrl, i) => (
            <motion.div
              key={ctrl}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + 0.1 * i, duration: 0.3 }}
            >
              <div className="bg-docker-amber/10 border border-docker-amber/20 rounded-lg px-3 py-1.5 text-center mb-1">
                <span className="text-docker-amber text-xs font-mono font-bold">{ctrl}/</span>
              </div>
              <div className="flex gap-1 ml-4">
                <div className="bg-story-surface rounded px-2 py-0.5 text-[9px] text-text-muted font-mono">container-a</div>
                <div className="bg-story-surface rounded px-2 py-0.5 text-[9px] text-text-muted font-mono">container-b</div>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-text-muted text-[10px] text-center mt-3">
          Each controller has its own tree. A process can be in different groups per controller.
        </p>
      </motion.div>

      {/* v2 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="bg-story-card rounded-2xl p-5 border border-story-border card-shadow"
      >
        <h4 className="text-docker-teal font-semibold text-sm mb-4 text-center">Cgroup v2: Single Tree</h4>
        <div className="space-y-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="bg-docker-teal/10 border border-docker-teal/20 rounded-lg px-3 py-1.5 text-center"
          >
            <span className="text-docker-teal text-xs font-mono font-bold">/sys/fs/cgroup/ (unified)</span>
          </motion.div>
          {["container-a", "container-b"].map((c, i) => (
            <motion.div
              key={c}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + 0.1 * i, duration: 0.3 }}
              className="ml-6 bg-docker-teal/5 border border-docker-teal/10 rounded-lg px-3 py-2"
            >
              <div className="text-docker-teal text-[10px] font-mono font-bold">{c}/</div>
              <div className="flex gap-1 mt-1 flex-wrap">
                {["cpu.max", "memory.max", "io.max"].map((f) => (
                  <span key={f} className="text-[8px] text-text-muted font-mono bg-story-surface px-1 rounded">{f}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-text-muted text-[10px] text-center mt-3">
          One tree. All controllers apply to the same group. Simpler and more consistent.
        </p>
      </motion.div>
    </div>
  );
}

function DockerToCgroupFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const steps = [
    { label: "docker run --memory=256m", color: "docker-blue" },
    { label: "Docker creates cgroup", color: "docker-teal" },
    { label: "memory.max = 268435456", color: "docker-violet" },
    { label: "Kernel enforces limit", color: "docker-amber" },
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Docker Flag &rarr; Cgroup Setting
      </h4>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 * i, duration: 0.3 }}
              className={`bg-${step.color}/10 border border-${step.color}/20 rounded-lg px-3 py-2`}
            >
              <span className={`text-${step.color} text-[10px] font-mono font-bold`}>{step.label}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 * i + 0.1, duration: 0.2 }}
                className="text-text-muted text-xs"
              >
                &rarr;
              </motion.span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CgroupDemo() {
  return (
    <>
    <SectionWrapper id="sec-cgroup-demo" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Cgroup v1 vs v2
      </h3>
      <p className="text-text-secondary leading-relaxed mb-8">
        Linux supports two versions of cgroups. <strong className="text-text-primary">v1</strong> uses
        separate hierarchies per resource controller (cpu, memory, blkio are independent trees).
        <strong className="text-text-primary"> v2</strong> uses a single unified hierarchy where all
        controllers are managed in one tree. Most modern distros (Ubuntu 22.04+, Fedora 31+) default to v2.
      </p>

      <CgroupHierarchyDiagram />
      <DockerToCgroupFlow />

      <div className="space-y-6 mb-8">
        <div>
          <h4 className="text-text-primary font-semibold text-sm mb-3">
            Cgroup v2: Create a resource-limited group manually
          </h4>
          <TerminalBlock
            title="cgroups v2 demo"
            lines={[
              "# Check if cgroup v2 is active",
              "$ mount | grep cgroup2",
              "cgroup2 on /sys/fs/cgroup type cgroup2 (rw,nosuid,nodev,noexec,relatime)",
              "",
              "# Create a cgroup",
              "$ sudo mkdir /sys/fs/cgroup/my-container",
              "",
              "# Limit to 256MB memory and 50% of one CPU",
              "$ echo 268435456 | sudo tee /sys/fs/cgroup/my-container/memory.max",
              "$ echo '50000 100000' | sudo tee /sys/fs/cgroup/my-container/cpu.max",
              "",
              "# Add current shell to the cgroup",
              "$ echo $$ | sudo tee /sys/fs/cgroup/my-container/cgroup.procs",
              "",
              "# Verify limits",
              "$ cat /sys/fs/cgroup/my-container/memory.max",
              "268435456",
              "$ cat /sys/fs/cgroup/my-container/cpu.max",
              "50000 100000",
            ]}
          />
        </div>

        <div>
          <h4 className="text-text-primary font-semibold text-sm mb-3">
            Docker resource limits &rarr; cgroup settings
          </h4>
          <TerminalBlock
            title="docker cgroups"
            lines={[
              "# Run a container with resource limits",
              "$ docker run -d --name limited --memory=256m --cpus=0.5 nginx",
              "",
              "# Find the container's cgroup on the host",
              "$ CONTAINER_ID=$(docker inspect --format '{{.Id}}' limited)",
              "$ cat /sys/fs/cgroup/system.slice/docker-${CONTAINER_ID}.scope/memory.max",
              "268435456",
              "$ cat /sys/fs/cgroup/system.slice/docker-${CONTAINER_ID}.scope/cpu.max",
              "50000 100000",
            ]}
          />
        </div>
      </div>

      <InfoCard variant="tip" title="Namespaces + Cgroups = Containers">
        This is the key insight: a container is just a regular Linux process with <strong>namespaces</strong> for
        isolation (what it can see) and <strong>cgroups</strong> for resource control (what it can use).
        Docker, containerd, and other runtimes are just convenient tools for setting these up correctly.
      </InfoCard>
    </SectionWrapper>

      <RevealCard
        id="lesson6-limits-kc1"
        prompt="A colleague says 'cgroup limits kill processes that use too many resources.' When is this true and when does it fail? Why does the kernel treat memory and CPU violations so differently?"
        answer="This is only true for memory limits. When a container exceeds its memory.limit_in_bytes, the kernel's OOM killer terminates the process immediately — memory is a finite, non-shareable resource, and the kernel can't 'pause' a process that has already allocated too much. But CPU limits work entirely differently: the CFS scheduler simply throttles the process, pausing it until the next scheduling period begins. The process survives but runs slower. The fundamental reason is that CPU time is a renewable resource — every 100ms a new budget arrives — while memory is a stockpile that can't be reclaimed without killing the consumer. This distinction matters in production: CPU throttling causes latency spikes, while memory limits cause crashes."
        hint="Think about the fundamental nature of CPU time vs memory — one is renewable, the other is consumed."
      />
    </>
  );
}
