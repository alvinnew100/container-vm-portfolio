"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";
import FillInBlank from "@/components/story/FillInBlank";

function AddressTranslationDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const stages = [
    { label: "Guest Virtual", abbr: "GVA", color: "docker-blue", desc: "Address the app uses" },
    { label: "Guest Physical", abbr: "GPA", color: "docker-teal", desc: "Address the guest OS maps to" },
    { label: "Host Physical", abbr: "HPA", color: "docker-violet", desc: "Actual RAM location" },
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Two-Level Address Translation
      </h4>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {stages.map((stage, i) => (
          <div key={stage.abbr} className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 * i, duration: 0.5 }}
              className={`bg-${stage.color}/10 border border-${stage.color}/30 rounded-lg px-4 py-3 text-center min-w-[100px]`}
            >
              <div className={`text-${stage.color} font-semibold text-sm`}>{stage.label}</div>
              <div className="text-text-muted text-xs">({stage.abbr})</div>
              <div className="text-text-secondary text-[10px] mt-1">{stage.desc}</div>
            </motion.div>
            {i < stages.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ delay: 0.2 * i + 0.15, duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <span className={`text-${stage.color} font-mono text-sm`}>&rarr;</span>
                <span className="text-text-muted text-[8px] font-mono">
                  {i === 0 ? "guest page tables" : "EPT/NPT"}
                </span>
              </motion.div>
            )}
          </div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-text-muted text-xs text-center mt-4"
      >
        Without hardware support, the hypervisor must intercept every page table change. With EPT/NPT, the CPU handles both translations automatically.
      </motion.p>
    </div>
  );
}

function OverheadComparisonBars() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Performance Comparison
      </h4>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-docker-amber font-semibold text-xs">Shadow Page Tables</span>
            <span className="text-text-muted text-[10px]">High overhead — many VM exits</span>
          </div>
          <div className="h-4 bg-story-surface rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "85%" } : {}}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="h-full bg-docker-amber/60 rounded-full"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-docker-blue font-semibold text-xs">EPT / NPT (Hardware)</span>
            <span className="text-text-muted text-[10px]">Low overhead — hardware handles it</span>
          </div>
          <div className="h-4 bg-story-surface rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "15%" } : {}}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="h-full bg-docker-blue/60 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MemVirt() {
  return (
    <SectionWrapper id="sec-mem-virt" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Memory Virtualization
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        Each VM thinks it has its own contiguous physical memory starting at address 0. But the hypervisor
        must map the guest&apos;s &ldquo;physical&rdquo; addresses to <em>actual</em> physical addresses on the host.
        This adds an extra layer of address translation.
      </p>

      <AnalogyCard
        concept="Page Tables Are Like a Mail Forwarding Service"
        analogy="Your app writes to 'apartment 42' (virtual address). The guest OS forwards that to 'building B, unit 42' (guest physical). The hypervisor then forwards it to '123 Main Street, unit 7' (host physical). Two levels of forwarding — that's the overhead we need to minimize."
      />

      <div className="mt-8">
        <AddressTranslationDiagram />
      </div>

      <div className="space-y-4 mb-8">
        <p className="text-text-secondary leading-relaxed">
          <TermDefinition term="Page tables" definition="a data structure the OS uses to translate virtual memory addresses to physical ones — every process has its own page table" />{" "}
          are the key data structure. In a VM, there are <em>two</em> levels of page tables: the guest&apos;s
          (mapping app addresses to guest-physical) and the hypervisor&apos;s (mapping guest-physical to host-physical).
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
          <h4 className="text-docker-amber font-semibold text-sm mb-2">Shadow Page Tables</h4>
          <p className="text-text-secondary text-sm leading-relaxed">
            The hypervisor maintains a &ldquo;shadow&rdquo; copy of the guest&apos;s page tables that maps
            directly from GVA &rarr; HPA. Every time the guest modifies its page tables, the hypervisor must
            trap and update the shadow copy. High overhead — lots of VM exits.
          </p>
        </div>
        <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
          <h4 className="text-docker-blue font-semibold text-sm mb-2">EPT / NPT (Hardware-Assisted)</h4>
          <p className="text-text-secondary text-sm leading-relaxed">
            Intel EPT (Extended Page Tables) and AMD NPT (Nested Page Tables) add a second page table
            walk in hardware. The CPU handles GVA&rarr;GPA&rarr;HPA in a single memory access, with no hypervisor
            involvement. Much faster — reduces VM exits by ~90% for memory-intensive workloads.
          </p>
        </div>
      </div>

      <OverheadComparisonBars />

      <InfoCard variant="info" title="TLB and Performance">
        The{" "}
        <TermDefinition term="TLB" definition="Translation Lookaside Buffer — a small, fast CPU cache that stores recent address translations so the CPU doesn't have to walk page tables for every memory access" />{" "}
        is critical. With EPT/NPT, a TLB miss requires a 2D page walk (up to 24 memory accesses in the worst case).
        Modern CPUs mitigate this with large TLBs and VPID (Virtual Processor ID) tags that avoid
        flushing the TLB on VM switches.
      </InfoCard>

      <FillInBlank
        id="lesson3-mem-fill1"
        prompt="In two-level address translation, guest virtual addresses are translated to {blank}, then to host physical addresses."
        blanks={[{ answer: "guest physical addresses", placeholder: "?" }]}
        explanation="The translation chain is: Guest Virtual Address (GVA) → Guest Physical Address (GPA) via guest page tables → Host Physical Address (HPA) via EPT/NPT. The guest thinks GPAs are real hardware addresses."
        hint="The guest OS manages its own page tables mapping virtual to what IT thinks is physical memory."
      />
    </SectionWrapper>
  );
}
