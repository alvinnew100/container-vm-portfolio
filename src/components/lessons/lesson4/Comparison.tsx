"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
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
          {["App A", "App B", "App C"].map((app, i) => (
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

export default function Comparison() {
  return (
    <SectionWrapper id="sec-comparison" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        The Key Insight: Shared Kernel
      </h3>
      <p className="text-text-secondary leading-relaxed mb-8">
        The fundamental difference between VMs and containers is that containers <strong className="text-text-primary">share the host
        kernel</strong>. A VM boots an entire guest OS — its own kernel, init system, and userspace.
        A container is just a set of <strong className="text-text-primary">isolated processes</strong> running
        on the host kernel, separated using namespaces and cgroups. No guest kernel, no virtual hardware emulation.
      </p>

      <SideBySideDiagram />

      {/* Comparison table */}
      <div className="bg-story-card rounded-2xl border border-story-border card-shadow overflow-hidden">
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
              {[
                { metric: "Startup time", vm: "30-60 seconds", ct: "< 1 second" },
                { metric: "Memory overhead", vm: "512 MB - 2 GB per VM", ct: "~10 MB per container" },
                { metric: "Disk footprint", vm: "10-40 GB (full OS)", ct: "10-200 MB (app + libs)" },
                { metric: "Isolation level", vm: "Strong (separate kernel)", ct: "Process-level (shared kernel)" },
                { metric: "Security boundary", vm: "Hardware-enforced", ct: "Kernel-enforced (namespaces)" },
                { metric: "OS support", vm: "Any OS (Linux, Windows, BSD)", ct: "Same OS family as host" },
                { metric: "Density", vm: "10-50 VMs per host", ct: "100-1000+ containers per host" },
                { metric: "Live migration", vm: "Yes (vMotion, etc.)", ct: "Yes (CRIU checkpoint/restore)" },
              ].map((row) => (
                <tr key={row.metric}>
                  <td className="px-4 py-2 text-text-primary font-medium">{row.metric}</td>
                  <td className="px-4 py-2 text-text-secondary">{row.vm}</td>
                  <td className="px-4 py-2 text-text-secondary">{row.ct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionWrapper>
  );
}
