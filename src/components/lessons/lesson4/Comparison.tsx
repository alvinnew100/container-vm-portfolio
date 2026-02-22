"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";
import ZineCallout from "@/components/story/ZineCallout";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function SideBySideDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="grid sm:grid-cols-2 gap-6 mb-8">
      {/* VM side */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-story-card rounded-2xl border border-story-border card-shadow overflow-hidden"
      >
        <div className="bg-docker-violet/10 px-4 py-3 border-b border-story-border text-center">
          <span className="text-docker-violet font-bold text-sm">Virtual Machines</span>
        </div>
        <div className="p-4 space-y-1.5">
          {["App A", "App B", "App C"].map((app) => (
            <div key={app} className="flex gap-1.5">
              <div className="flex-1 bg-docker-violet/15 rounded px-2 py-1 text-center text-[10px] text-docker-violet font-semibold">
                {app}
              </div>
              <div className="flex-1 bg-docker-violet/10 rounded px-2 py-1 text-center text-[10px] text-text-muted">
                Bins/Libs
              </div>
              <div className="flex-1 bg-docker-violet/5 rounded px-2 py-1 text-center text-[10px] text-text-muted">
                Guest OS
              </div>
            </div>
          ))}
          <div className="bg-docker-violet/20 rounded px-2 py-1.5 text-center text-[10px] text-docker-violet font-semibold">
            Hypervisor
          </div>
          <div className="bg-story-dark rounded px-2 py-1.5 text-center text-[10px] text-white/70">
            Hardware
          </div>
        </div>
      </motion.div>

      {/* Container side */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-story-card rounded-2xl border border-story-border card-shadow overflow-hidden"
      >
        <div className="bg-docker-blue/10 px-4 py-3 border-b border-story-border text-center">
          <span className="text-docker-blue font-bold text-sm">Containers</span>
        </div>
        <div className="p-4 space-y-1.5">
          {["App A", "App B", "App C"].map((app) => (
            <div key={app} className="flex gap-1.5">
              <div className="flex-1 bg-docker-blue/15 rounded px-2 py-1 text-center text-[10px] text-docker-blue font-semibold">
                {app}
              </div>
              <div className="flex-1 bg-docker-blue/10 rounded px-2 py-1 text-center text-[10px] text-text-muted">
                Bins/Libs
              </div>
            </div>
          ))}
          <div className="bg-docker-teal/20 rounded px-2 py-1.5 text-center text-[10px] text-docker-teal font-semibold">
            Container Runtime
          </div>
          <div className="bg-docker-blue/10 rounded px-2 py-1.5 text-center text-[10px] text-docker-blue font-semibold">
            Host OS (shared kernel)
          </div>
          <div className="bg-story-dark rounded px-2 py-1.5 text-center text-[10px] text-white/70">
            Hardware
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const TABLE_ROWS = [
  { metric: "Startup time", vm: "30-60 seconds", ct: "< 1 second" },
  { metric: "Memory overhead", vm: "512 MB - 2 GB per VM", ct: "~10 MB per container" },
  { metric: "Disk footprint", vm: "10-40 GB (full OS)", ct: "10-200 MB (app + libs)" },
  { metric: "Isolation level", vm: "Strong (separate kernel)", ct: "Process-level (shared kernel)" },
  { metric: "Security boundary", vm: "Hardware-enforced", ct: "Kernel-enforced (namespaces)" },
  { metric: "OS support", vm: "Any OS (Linux, Windows, BSD)", ct: "Same OS family as host" },
  { metric: "Density", vm: "10-50 VMs per host", ct: "100-1000+ containers per host" },
  { metric: "Live migration", vm: "Yes (vMotion, etc.)", ct: "Yes (CRIU checkpoint/restore)" },
];

export default function Comparison() {
  const tableRef = useRef<HTMLDivElement>(null);
  const tableInView = useInView(tableRef, { once: true, margin: "-50px" });

  return (
    <SectionWrapper id="sec-comparison" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        The Key Insight: Shared Kernel
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        The fundamental difference between VMs and containers is that containers <strong className="text-text-primary">share the host{" "}
        <TermDefinition term="kernel" definition="the core of the OS that runs in Ring 0 with full hardware access, as we learned in the Primer" /></strong>.
        A VM boots an entire guest OS — its own kernel, init system, and userspace.
        A container is just a set of <strong className="text-text-primary">isolated processes</strong> running
        on the host kernel, separated using namespaces and cgroups (covered in Lessons 5 and 6). No guest kernel, no virtual hardware emulation.
      </p>

      <AnalogyCard
        concept="Houses vs Apartments"
        analogy="VMs are like houses — each has its own foundation, plumbing, electrical, and roof. Completely independent but expensive. Containers are like apartments — they share the building's foundation and plumbing (the kernel) but have separate walls, locks, and interiors. Much cheaper to build and faster to move into."
      />

      <div className="mt-8">
        <SideBySideDiagram />
      </div>

      {/* Animated comparison table */}
      <div ref={tableRef} className="bg-story-card rounded-2xl border border-story-border card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-story-surface">
                <th className="text-left px-4 py-3 text-text-primary font-semibold">Metric</th>
                <th className="text-left px-4 py-3 text-docker-violet font-semibold">Virtual Machine</th>
                <th className="text-left px-4 py-3 text-docker-blue font-semibold">Container</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-story-border">
              {TABLE_ROWS.map((row, i) => (
                <motion.tr
                  key={row.metric}
                  initial={{ opacity: 0, x: -20 }}
                  animate={tableInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.06 * i, duration: 0.35 }}
                >
                  <td className="px-4 py-2 text-text-primary font-medium">{row.metric}</td>
                  <td className="px-4 py-2 text-text-secondary">{row.vm}</td>
                  <td className="px-4 py-2 text-text-secondary">{row.ct}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <InfoCard variant="info" title="Containers = Processes">
          Here&apos;s the simplest way to understand the difference: a VM is a <em>virtual computer</em> with
          its own kernel. A container is a <em>group of regular Linux processes</em> with restrictions (as we
          learned in the Primer, a process is just a running program with a PID).
          You can start <code>top</code> inside a container and on the host simultaneously &mdash; they&apos;re
          literally the same process, just viewed through different namespace lenses. On a Mac, containers
          actually run inside a lightweight Linux VM (since macOS doesn&apos;t have namespaces/cgroups).
        </InfoCard>
      </div>

      <div className="mt-4">
        <ZineCallout page="4, 7" topic="why containers, containers = processes" />
      </div>
    </SectionWrapper>
  );
}
