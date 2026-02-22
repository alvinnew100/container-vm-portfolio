"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import { useState } from "react";

const NS_TYPES = [
  {
    name: "PID",
    flag: "CLONE_NEWPID",
    isolates: "Process IDs",
    desc: "Each namespace has its own PID numbering starting at 1. The first process (PID 1) acts as the init process for that namespace. Processes in different PID namespaces can have the same PID number without conflict.",
    example: "Container sees its app as PID 1, while the host sees it as PID 4523.",
    color: "docker-blue",
  },
  {
    name: "NET",
    flag: "CLONE_NEWNET",
    isolates: "Network stack",
    desc: "Each namespace gets its own network interfaces, routing tables, iptables rules, and port space. Containers can all bind to port 80 without conflicts because each has its own network namespace.",
    example: "Container has its own eth0 with IP 172.17.0.2, connected to host via veth pair.",
    color: "docker-teal",
  },
  {
    name: "MNT",
    flag: "CLONE_NEWNS",
    isolates: "Filesystem mounts",
    desc: "Each namespace has its own mount table. This is how containers get their own root filesystem (from an image) while sharing the host kernel. Mount events in one namespace don't affect others.",
    example: "Container sees / as its image rootfs; host sees it under /var/lib/docker/overlay2/...",
    color: "docker-violet",
  },
  {
    name: "UTS",
    flag: "CLONE_NEWUTS",
    isolates: "Hostname and domain",
    desc: "Each namespace has its own hostname and NIS domain name. This lets containers have unique hostnames for identification and service discovery purposes.",
    example: 'Container hostname is "web-server-1" while host is "prod-host-42".',
    color: "docker-amber",
  },
  {
    name: "IPC",
    flag: "CLONE_NEWIPC",
    isolates: "Inter-process communication",
    desc: "Each namespace has its own System V IPC objects (shared memory, semaphores, message queues) and POSIX message queues. Prevents containers from interfering with each other's IPC mechanisms.",
    example: "Two containers can both create shared memory segment with the same key without conflict.",
    color: "docker-red",
  },
  {
    name: "USER",
    flag: "CLONE_NEWUSER",
    isolates: "User and group IDs",
    desc: "Maps UIDs/GIDs between namespaces. A process can be root (UID 0) inside the container but map to an unprivileged user (e.g., UID 100000) on the host. This is the foundation of rootless containers.",
    example: "Container root (UID 0) maps to host UID 100000 — no real root privileges on host.",
    color: "docker-blue",
  },
  {
    name: "cgroup",
    flag: "CLONE_NEWCGROUP",
    isolates: "Cgroup root directory",
    desc: "Each namespace has its own view of the cgroup hierarchy. The container sees its cgroup as the root, hiding the host's cgroup structure. This prevents containers from manipulating resource limits.",
    example: "Container sees /sys/fs/cgroup/ as its own root, can't see or modify sibling cgroups.",
    color: "docker-teal",
  },
];

export default function Namespaces() {
  const [selected, setSelected] = useState(0);
  const ns = NS_TYPES[selected];

  return (
    <SectionWrapper id="sec-namespaces" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Linux Namespaces — The Foundation of Container Isolation
      </h3>
      <p className="text-text-secondary leading-relaxed mb-8">
        Namespaces are a Linux kernel feature that partitions system resources so that each group of processes
        sees its own isolated instance. There are <strong className="text-text-primary">7 namespace types</strong>,
        and together they create the illusion that a container is its own machine. Click each type below to explore.
      </p>

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

        {/* Content */}
        <div className="p-6">
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
        </div>
      </div>

      <InfoCard variant="info" title="All 7 Combined = A Container">
        When Docker creates a container, it calls <code>clone()</code> with all seven <code>CLONE_NEW*</code> flags.
        The resulting process has its own PIDs, network stack, filesystem, hostname, IPC, user mappings, and cgroup view.
        From inside, it looks like a complete machine. From outside, it&apos;s just a process with fancy isolation.
      </InfoCard>
    </SectionWrapper>
  );
}
