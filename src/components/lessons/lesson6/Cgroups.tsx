"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import ZineCallout from "@/components/story/ZineCallout";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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

      {/* What happens when limits are hit */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-docker-red/5 rounded-xl p-5 border border-docker-red/20">
          <h4 className="text-docker-red font-semibold text-sm mb-2">Memory: OOM Killer</h4>
          <p className="text-text-secondary text-sm leading-relaxed">
            When a container exceeds its memory limit, the kernel&apos;s <strong>OOM (Out of Memory) killer</strong> steps
            in and terminates the process. You&apos;ll see &ldquo;Killed&rdquo; in the output. This is a hard stop &mdash;
            no graceful shutdown. That&apos;s why it&apos;s critical to set memory limits appropriately
            and monitor usage.
          </p>
        </div>
        <div className="bg-docker-amber/5 rounded-xl p-5 border border-docker-amber/20">
          <h4 className="text-docker-amber font-semibold text-sm mb-2">CPU: Throttling</h4>
          <p className="text-text-secondary text-sm leading-relaxed">
            When a container hits its CPU quota for the current period, the kernel <strong>throttles</strong> it &mdash;
            the process is paused until the next period begins. Unlike memory, this doesn&apos;t kill anything;
            the process just has to wait. You&apos;ll see increased latency, not crashes. The quota resets
            every <code>cpu.cfs_period_us</code> (default 100ms).
          </p>
        </div>
      </div>

      <InfoCard variant="info" title="Docker Uses Cgroups Behind the Scenes">
        When you run <code>docker run --memory=512m --cpus=1.5 myapp</code>, Docker creates a cgroup
        for that container and sets <code>memory.limit_in_bytes=536870912</code> and{" "}
        <code>cpu.cfs_quota_us=150000</code>. The kernel enforces these limits transparently.
        Cgroups also track usage — you can see a container&apos;s real-time memory and CPU at{" "}
        <code>/sys/fs/cgroup/</code>.
      </InfoCard>

      <div className="mt-4">
        <ZineCallout page="13" topic="cgroups, OOM killer, CPU throttling" />
      </div>
    </SectionWrapper>
  );
}
