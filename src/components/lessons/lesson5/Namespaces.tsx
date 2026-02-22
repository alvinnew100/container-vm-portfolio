"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";
import ZineCallout from "@/components/story/ZineCallout";
import RevealCard from "@/components/story/RevealCard";

const NS_TYPES = [
  {
    name: "PID",
    flag: "CLONE_NEWPID",
    isolates: "Process IDs",
    desc: "PID namespaces form a tree — the host is the root. Each namespace has its own PID numbering starting at 1. PID 1 is special: if it exits, every process in the namespace is killed. The host can see all container processes, but containers can only see their own.",
    example: "Container sees its app as PID 1, while the host sees it as PID 4523. Run 'lsns -t pid' to see all PID namespaces.",
    color: "docker-blue",
  },
  {
    name: "NET",
    flag: "CLONE_NEWNET",
    isolates: "Network stack",
    desc: "Each namespace gets its own network interfaces, routing tables, iptables rules (as we covered in the Primer), and port space. Namespaces usually have 2 interfaces: loopback (127.0.0.1) and one for external connections. Other namespaces connect to the host via a bridge.",
    example: "Container has its own eth0 with IP 172.17.0.2 (private range), connected to host via veth pair and docker0 bridge.",
    color: "docker-teal",
  },
  {
    name: "MNT",
    flag: "CLONE_NEWNS",
    isolates: "Filesystem mounts",
    desc: "Each namespace has its own mount table. This is how containers get their own root filesystem (from an image) while sharing the host kernel. As we learned in the Primer, mounting attaches a filesystem to a path — this namespace controls which mounts each process sees.",
    example: "Container sees / as its image rootfs; host sees it under /var/lib/docker/overlay2/...",
    color: "docker-violet",
  },
  {
    name: "UTS",
    flag: "CLONE_NEWUTS",
    isolates: "Hostname and domain",
    desc: "Each namespace has its own hostname and NIS domain name. NIS (Network Information Service) is a legacy system for sharing configuration across networks — you rarely use it today, but the namespace still isolates it.",
    example: 'Container hostname is "web-server-1" while host is "prod-host-42".',
    color: "docker-amber",
  },
  {
    name: "IPC",
    flag: "CLONE_NEWIPC",
    isolates: "Inter-process communication",
    desc: "Each namespace has its own System V IPC objects. IPC lets processes communicate: shared memory (a block of RAM two processes can both access), semaphores (counters for coordinating access to resources), and message queues (ordered message passing). Prevents containers from interfering with each other's IPC.",
    example: "Two containers can both create shared memory segment with the same key without conflict.",
    color: "docker-red",
  },
  {
    name: "USER",
    flag: "CLONE_NEWUSER",
    isolates: "User and group IDs",
    desc: "Maps UIDs/GIDs (user/group IDs — every Linux user has a numeric UID, and root is always UID 0) between namespaces. A process can be root (UID 0) inside the container but map to an unprivileged user (e.g., UID 100000) on the host. 'Root' in a user namespace has limited capabilities.",
    example: "Container root (UID 0) maps to host UID 100000 — no real root privileges on host.",
    color: "docker-blue",
  },
  {
    name: "cgroup",
    flag: "CLONE_NEWCGROUP",
    isolates: "Cgroup root directory",
    desc: "Each namespace has its own view of the cgroup hierarchy. The container sees its cgroup as the root, hiding the host's cgroup structure. This prevents containers from seeing or manipulating other containers' resource limits.",
    example: "Container sees /sys/fs/cgroup/ as its own root, can't see or modify sibling cgroups.",
    color: "docker-teal",
  },
];

function NamespaceWallDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const walls = ["PID", "NET", "MNT", "UTS", "IPC", "USER", "cgroup"];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        7 Namespace Walls Around a Container Process
      </h4>
      <div className="flex justify-center">
        <div className="relative w-72 h-72">
          {/* Central process */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-docker-blue/20 border-2 border-docker-blue/40 flex items-center justify-center z-10"
          >
            <span className="text-docker-blue text-[10px] font-bold text-center leading-tight">Container<br/>Process</span>
          </motion.div>

          {/* Walls around the process */}
          {walls.map((wall, i) => {
            const angle = (i * 360) / walls.length - 90;
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * 110;
            const y = Math.sin(rad) * 110;

            return (
              <motion.div
                key={wall}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.1 * i, duration: 0.3 }}
                className="absolute bg-docker-teal/10 border border-docker-teal/30 rounded-lg px-2 py-1"
                style={{
                  left: `calc(50% + ${x}px - 24px)`,
                  top: `calc(50% + ${y}px - 12px)`,
                }}
              >
                <span className="text-docker-teal text-[9px] font-mono font-bold">{wall}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="text-text-muted text-xs text-center mt-6"
      >
        Each wall is a namespace. The host can see through all walls; the process inside cannot see out.
      </motion.p>
    </div>
  );
}

export default function Namespaces() {
  const [selected, setSelected] = useState(0);
  const ns = NS_TYPES[selected];

  return (
    <>
    <SectionWrapper id="sec-namespaces" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Linux Namespaces — The Foundation of Container Isolation
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        Namespaces are a Linux kernel feature that partitions system resources so that each group of processes
        sees its own isolated instance. There are <strong className="text-text-primary">7 namespace types</strong>,
        and together they create the illusion that a container is its own machine. Click each type below to explore.
      </p>

      <AnalogyCard
        concept="Namespaces Are Like One-Way Mirrors"
        analogy="Each container is in a room surrounded by one-way mirrors. It can only see its own room — its own processes, its own network, its own files. But the host (building security) can see into every room. The 7 mirrors correspond to the 7 things containers can't see: PIDs, network, mounts, hostname, IPC, users, and cgroups."
      />

      <div className="mt-8">
        <NamespaceWallDiagram />
      </div>

      {/* Interactive namespace explorer */}
      <div className="bg-story-card rounded-2xl border border-story-border card-shadow overflow-hidden mb-8">
        {/* Tabs */}
        <div className="flex flex-wrap border-b border-story-border">
          {NS_TYPES.map((n, i) => (
            <button
              key={n.name}
              onClick={() => setSelected(i)}
              className={`px-4 py-3 text-xs font-mono font-semibold transition-colors ${
                i === selected
                  ? `text-${n.color} border-b-2 border-${n.color} bg-${n.color}/5`
                  : "text-text-muted hover:text-text-secondary hover:bg-story-surface"
              }`}
            >
              {n.name}
            </button>
          ))}
        </div>

        {/* Animated Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <h4 className={`text-${ns.color} font-bold`}>{ns.name} Namespace</h4>
              <code className="text-[10px] font-mono text-text-muted bg-story-surface px-2 py-0.5 rounded">
                {ns.flag}
              </code>
            </div>
            <p className="text-text-primary font-semibold text-sm mb-2">
              Isolates: {ns.isolates}
            </p>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              {ns.desc}
            </p>
            <div className="bg-story-surface rounded-lg p-3">
              <span className="text-text-muted text-xs font-semibold uppercase tracking-wider">Example</span>
              <p className="text-text-secondary text-sm mt-1">{ns.example}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <InfoCard variant="info" title="All 7 Combined = A Container">
        When Docker creates a container, it calls <code>clone()</code> with all seven <code>CLONE_NEW*</code> flags.
        The resulting process has its own PIDs, network stack, filesystem, hostname, IPC, user mappings, and cgroup view.
        From inside, it looks like a complete machine. From outside, it&apos;s just a process (as we learned in the Primer) with fancy isolation.
      </InfoCard>

      <div className="mt-4">
        <ZineCallout page="14-18" topic="namespaces, PID trees, user namespaces, network namespaces" />
      </div>
    </SectionWrapper>

      <RevealCard
        id="lesson5-ns-kc1"
        prompt="Why does the Linux kernel need 7 separate namespace types instead of a single 'isolate everything' flag? What would break if PID and NET namespaces were merged into one?"
        answer="Each namespace type isolates a fundamentally different kernel resource — process IDs, network stack, filesystem mounts, hostname, IPC, user/group IDs, and cgroup views. They're separate because you sometimes need fine-grained control: for example, you might want two containers to share the same network namespace (like a Kubernetes pod) while keeping their PID namespaces separate. If PID and NET were merged, you couldn't share a network stack without also sharing process visibility, breaking sidecar patterns and debugging workflows. The 7-namespace design gives composable isolation — each wall can be raised or lowered independently."
        hint="Think about cases where you'd want to share one resource but isolate another."
      />
    </>
  );
}
