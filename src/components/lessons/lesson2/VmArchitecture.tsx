"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
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

export default function VmArchitecture() {
  return (
    <SectionWrapper id="sec-vm-arch" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        What Is a Virtual Machine?
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        A <strong className="text-text-primary">Virtual Machine (VM)</strong> is a software emulation of a complete computer system.
        Each VM runs its own <strong className="text-text-primary">guest operating system</strong> on top of virtualized hardware &mdash;
        including virtual CPUs (vCPUs), virtual RAM, virtual disk, and virtual network interfaces (vNICs). To the
        applications inside, a VM looks and feels like a real, dedicated physical machine.
      </p>
      <p className="text-text-secondary leading-relaxed mb-8">
        The <strong className="text-text-primary">hypervisor</strong> (also called Virtual Machine Monitor, or VMM)
        sits between the physical hardware and the VMs. Its job is to multiplex the physical resources &mdash;
        giving each VM a fair share of CPU, memory, and I/O &mdash; while keeping them completely isolated from each other.
      </p>

      <VmStackDiagram />

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {[
          { label: "vCPU", desc: "Virtual CPU cores mapped to physical CPU time slices via the hypervisor scheduler." },
          { label: "vRAM", desc: "Virtual memory backed by physical RAM pages, with address translation managed by the hypervisor." },
          { label: "vDisk", desc: "Virtual hard drives stored as files (VMDK, QCOW2, VHD) on the host filesystem." },
          { label: "vNIC", desc: "Virtual network interfaces connected to virtual switches, with MAC addresses assigned by the hypervisor." },
        ].map((item) => (
          <div key={item.label} className="bg-story-card rounded-xl p-4 border border-story-border card-shadow">
            <code className="text-docker-blue text-sm font-semibold">{item.label}</code>
            <p className="text-text-secondary text-sm leading-relaxed mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      <InfoCard variant="note" title="VM Lifecycle">
        VMs follow a lifecycle: <strong>create</strong> (allocate resources), <strong>start</strong> (boot guest OS),
        <strong> snapshot</strong> (save state), <strong>migrate</strong> (move between hosts live),
        and <strong>destroy</strong> (release all resources). Snapshots enable instant rollback — invaluable for testing.
      </InfoCard>
    </SectionWrapper>
  );
}
