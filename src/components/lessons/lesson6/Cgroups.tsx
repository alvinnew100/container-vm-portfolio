"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";
import ZineCallout from "@/components/story/ZineCallout";
import RevealCard from "@/components/story/RevealCard";
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
    <>
    <SectionWrapper id="sec-cgroups" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Cgroups — Resource Control
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        While namespaces provide <em>isolation</em> (what a process can see), <strong className="text-text-primary">cgroups</strong> (control groups)
        provide <em>resource control</em> (what a process can use). Cgroups let you limit, account for, and
        prioritize CPU, memory, I/O bandwidth, and other resources for groups of processes.
      </p>

      <AnalogyCard
        concept="Namespaces = Walls, Cgroups = Meter Boxes"
        analogy="Namespaces are the walls of your apartment — they control what you can see. Cgroups are the utility meters — they control how much electricity (CPU), water (memory), and gas (I/O) you can use. Both are needed for a proper container."
      />

      {/* Resource visualization */}
      <div className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow mb-8 mt-8">
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
            <li><code>cpu.shares</code> — Relative weight (default 1024). Only matters under{" "}
              <TermDefinition term="contention" definition="when multiple processes compete for the same resource — if nobody else wants CPU, limits don't kick in" />.
            </li>
            <li><code>cpu.cfs_quota_us</code> — Hard limit set by the{" "}
              <TermDefinition term="CFS" definition="Completely Fair Scheduler — Linux's default CPU scheduler that distributes time slices proportionally" />.
              E.g., 50000/100000 = 50% of one core.</li>
            <li><code>cpuset.cpus</code> — Pin to specific CPU cores.</li>
          </ul>
        </div>
        <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
          <h4 className="text-docker-teal font-semibold text-sm mb-2">Memory Limits</h4>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li><code>memory.limit_in_bytes</code> — Hard limit.{" "}
              <TermDefinition term="OOM killer" definition="Out of Memory killer — the kernel's last resort that terminates processes when memory is exhausted" />{" "}
              triggers at this threshold.</li>
            <li><code>memory.soft_limit_in_bytes</code> — Soft limit. Only enforced under contention.</li>
            <li><code>memory.swappiness</code> — Controls{" "}
              <TermDefinition term="swap" definition="using disk space as emergency 'extra memory' — much slower than real RAM" />{" "}
              aggressiveness (0-100).</li>
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
            When a container exceeds its memory limit, the kernel&apos;s OOM killer steps in and terminates
            the process. You&apos;ll see &ldquo;Killed&rdquo; in the output. This is a hard stop &mdash;
            no graceful shutdown. That&apos;s why it&apos;s critical to set memory limits appropriately.
          </p>
        </div>
        <div className="bg-docker-amber/5 rounded-xl p-5 border border-docker-amber/20">
          <h4 className="text-docker-amber font-semibold text-sm mb-2">CPU: Throttling</h4>
          <p className="text-text-secondary text-sm leading-relaxed">
            When a container hits its CPU quota for the current period, the kernel <strong>throttles</strong> it &mdash;
            the process is paused until the next period begins. Unlike memory, this doesn&apos;t kill anything;
            the process just has to wait. You&apos;ll see increased latency, not crashes.
          </p>
        </div>
      </div>

      <InfoCard variant="info" title="Docker Uses Cgroups Behind the Scenes">
        When you run <code>docker run --memory=512m --cpus=1.5 myapp</code>, Docker creates a cgroup
        for that container and sets <code>memory.limit_in_bytes=536870912</code> and{" "}
        <code>cpu.cfs_quota_us=150000</code>. The kernel enforces these limits transparently.
      </InfoCard>

      <div className="mt-4">
        <ZineCallout page="13" topic="cgroups, OOM killer, CPU throttling" />
      </div>
    </SectionWrapper>

      <RevealCard
        id="lesson6-cgroup-fill1"
        prompt="How would you derive the correct cpu.cfs_quota_us value from first principles to limit a container to exactly 0.5 CPUs? What does this value actually represent at the kernel scheduler level?"
        answer="The CFS (Completely Fair Scheduler) enforces CPU limits using two values: cpu.cfs_period_us (the scheduling period, default 100,000 microseconds = 100ms) and cpu.cfs_quota_us (how many microseconds of CPU time the process gets per period). The ratio quota/period = CPU fraction. For 0.5 CPUs: 0.5 x 100,000 = 50,000 microseconds. This means the container gets 50ms of CPU time for every 100ms wall-clock period. If it uses its 50ms budget early, the kernel throttles it (pauses it) until the next period starts. For multi-core limits, the quota can exceed the period — e.g., 200,000/100,000 = 2.0 CPUs means 200ms of CPU time per 100ms period, spread across 2 cores."
        hint="Think about the relationship between quota, period, and the fraction of CPU time a process gets."
      />
    </>
  );
}
