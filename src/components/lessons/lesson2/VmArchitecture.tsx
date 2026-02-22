"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function VmStackDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const layers = [
    { label: "App A", sub: "Guest OS (Linux)", color: "bg-docker-blue", width: "w-36" },
    { label: "App B", sub: "Guest OS (Windows)", color: "bg-docker-teal", width: "w-36" },
    { label: "App C", sub: "Guest OS (Linux)", color: "bg-docker-violet", width: "w-36" },
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-text-primary font-semibold text-sm mb-6 text-center">VM Architecture — Layered View</h4>
      <div className="flex flex-col items-center gap-2">
        {/* VMs row */}
        <div className="flex gap-3 justify-center flex-wrap">
          {layers.map((vm, i) => (
            <motion.div
              key={vm.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className={`${vm.width} rounded-lg border border-white/20 overflow-hidden`}
            >
              <div className={`${vm.color} text-white text-xs font-semibold px-3 py-2 text-center`}>
                {vm.label}
              </div>
              <div className={`${vm.color}/20 text-text-secondary text-[10px] px-3 py-1.5 text-center`}>
                {vm.sub}
              </div>
              <div className="bg-story-surface text-text-muted text-[10px] px-3 py-1 text-center border-t border-story-border">
                vCPU + vRAM + vDisk + vNIC
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hypervisor */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full max-w-md bg-docker-blue/10 border border-docker-blue/30 rounded-lg px-4 py-2 text-center"
        >
          <span className="text-docker-blue font-semibold text-xs">Hypervisor</span>
          <span className="text-text-muted text-[10px] ml-2">(VMM — Virtual Machine Monitor)</span>
        </motion.div>

        {/* Hardware */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full max-w-md bg-story-dark rounded-lg px-4 py-2 text-center"
        >
          <span className="text-white/80 font-semibold text-xs">Physical Hardware</span>
          <span className="text-white/40 text-[10px] ml-2">(CPU, RAM, Disk, NIC)</span>
        </motion.div>
      </div>
    </div>
  );
}

const LIFECYCLE_STAGES = [
  { label: "Create", desc: "Allocate resources", color: "docker-blue" },
  { label: "Start", desc: "Boot guest OS", color: "docker-teal" },
  { label: "Snapshot", desc: "Save state", color: "docker-violet" },
  { label: "Migrate", desc: "Move between hosts", color: "docker-amber" },
  { label: "Destroy", desc: "Release resources", color: "docker-red" },
];

function VmLifecycleDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        VM Lifecycle
      </h4>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {LIFECYCLE_STAGES.map((stage, i) => (
          <div key={stage.label} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.15 * i, duration: 0.4 }}
              className={`bg-${stage.color}/10 border border-${stage.color}/30 rounded-lg px-3 py-2 text-center min-w-[80px]`}
            >
              <div className={`text-${stage.color} font-bold text-xs`}>{stage.label}</div>
              <div className="text-text-muted text-[9px] mt-0.5">{stage.desc}</div>
            </motion.div>
            {i < LIFECYCLE_STAGES.length - 1 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.15 * i + 0.1, duration: 0.3 }}
                className="text-text-muted text-xs font-mono"
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

export default function VmArchitecture() {
  return (
    <SectionWrapper id="sec-vm-arch" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        What Is a Virtual Machine?
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        A <strong className="text-text-primary">Virtual Machine (VM)</strong> is a software emulation of a complete computer system.
        Each VM runs its own <strong className="text-text-primary">guest operating system</strong> (as we learned in the Primer, an OS manages
        hardware for programs) on top of virtualized hardware. To the applications inside, a VM looks
        and feels like a real, dedicated physical machine.
      </p>

      <AnalogyCard
        concept="A VM Is Like a Snow Globe"
        analogy="Each VM is a complete miniature world inside glass — it has its own ground (OS), buildings (apps), and weather (resources). The shelf holding all the snow globes is the hypervisor. You can shake one globe without affecting the others."
      />

      <div className="mt-8">
        <VmStackDiagram />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {[
          {
            label: "vCPU",
            full: "Virtual CPU",
            desc: "A slice of the physical CPU's time, scheduled by the hypervisor. If the host has 16 cores, you might give 4 vCPUs to each of 4 VMs.",
          },
          {
            label: "vRAM",
            full: "Virtual RAM",
            desc: "A portion of the host's physical memory reserved for this VM. The guest OS sees it as 'real' RAM starting at address 0.",
          },
          {
            label: "vDisk",
            full: "Virtual Disk",
            desc: "A file on the host (like a .vmdk or .qcow2 file) that the guest OS sees as a hard drive. Easy to snapshot, copy, or migrate.",
          },
          {
            label: "vNIC",
            full: "Virtual Network Interface Card",
            desc: "A virtual network card connected to a virtual switch inside the hypervisor. Gets its own MAC address, just like a physical NIC.",
          },
        ].map((item) => (
          <div key={item.label} className="bg-story-card rounded-xl p-4 border border-story-border card-shadow">
            <code className="text-docker-blue text-sm font-semibold">{item.label}</code>
            <span className="text-text-muted text-xs ml-2">({item.full})</span>
            <p className="text-text-secondary text-sm leading-relaxed mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      <VmLifecycleDiagram />

      <InfoCard variant="note" title="Snapshots: Time Travel for VMs">
        A{" "}
        <TermDefinition term="snapshot" definition="a saved copy of a VM's entire state — memory, disk, CPU registers — at a specific moment in time" />{" "}
        lets you instantly roll back to a known-good state. Break something during testing? Restore the snapshot
        in seconds. This is one of the biggest advantages of VMs over bare metal.
      </InfoCard>
    </SectionWrapper>
  );
}
