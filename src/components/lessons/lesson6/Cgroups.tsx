"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

function ResourceMeter({ label, value, max, unit, color }: { label: string; value: number; max: number; unit: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const pct = (value / max) * 100;

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-text-primary font-semibold">{label}</span>
        <span className="text-text-muted">{value}{unit} / {max}{unit}</span>
      </div>
      <div className="h-3 bg-story-surface rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full bg-${color}`}
        />
      </div>
    </div>
  );
}

export default function Cgroups() {
  return (
    <SectionWrapper id="sec-cgroups" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Cgroups — Resource Control
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        While namespaces provide <em>isolation</em> (what a process can see), <strong className="text-text-primary">cgroups</strong> (control groups)
        provide <em>resource control</em> (what a process can use). Cgroups let you limit, account for, and
        prioritize CPU, memory, I/O bandwidth, and other resources for groups of processes.
      </p>

      {/* Resource visualization */}
      <div className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow mb-8">
        <h4 className="text-text-primary font-semibold text-sm mb-4">Container Resource Usage</h4>
        <ResourceMeter label="CPU" value={250} max={1000} unit="m" color="docker-blue" />
        <ResourceMeter label="Memory" value={128} max={512} unit="MB" color="docker-teal" />
        <ResourceMeter label="Block I/O" value={50} max={200} unit="MB/s" color="docker-violet" />
        <ResourceMeter label="Network" value={30} max={100} unit="Mbps" color="docker-amber" />
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
          <h4 className="text-docker-blue font-semibold text-sm mb-2">CPU Limits</h4>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li><code>cpu.shares</code> — Relative weight (default 1024). Only matters under contention.</li>
            <li><code>cpu.cfs_quota_us</code> — Hard limit. E.g., 50000/100000 = 50% of one core.</li>
            <li><code>cpuset.cpus</code> — Pin to specific CPU cores.</li>
          </ul>
        </div>
        <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
          <h4 className="text-docker-teal font-semibold text-sm mb-2">Memory Limits</h4>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li><code>memory.limit_in_bytes</code> — Hard limit. OOM killer triggers at this threshold.</li>
            <li><code>memory.soft_limit_in_bytes</code> — Soft limit. Only enforced under contention.</li>
            <li><code>memory.swappiness</code> — Controls swap aggressiveness (0-100).</li>
          </ul>
        </div>
        <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
          <h4 className="text-docker-violet font-semibold text-sm mb-2">I/O Limits</h4>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li><code>blkio.throttle.read_bps_device</code> — Max read bytes/sec per device.</li>
            <li><code>blkio.throttle.write_bps_device</code> — Max write bytes/sec per device.</li>
            <li><code>blkio.weight</code> — Relative I/O priority (100-1000).</li>
          </ul>
        </div>
      </div>

      <InfoCard variant="info" title="Docker Uses Cgroups Behind the Scenes">
        When you run <code>docker run --memory=512m --cpus=1.5 myapp</code>, Docker creates a cgroup
        for that container and sets <code>memory.limit_in_bytes=536870912</code> and{" "}
        <code>cpu.cfs_quota_us=150000</code>. The kernel enforces these limits transparently.
      </InfoCard>
    </SectionWrapper>
  );
}
