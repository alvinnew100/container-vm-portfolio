"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import TermDefinition from "@/components/story/TermDefinition";

function RingDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const rings = [
    { ring: 3, label: "Applications", color: "docker-blue", size: "w-64 h-64 sm:w-72 sm:h-72" },
    { ring: 2, label: "Device Drivers", color: "docker-teal", size: "w-48 h-48 sm:w-52 sm:h-52" },
    { ring: 1, label: "OS Services", color: "docker-violet", size: "w-32 h-32 sm:w-36 sm:h-36" },
    { ring: 0, label: "Kernel", color: "docker-amber", size: "w-16 h-16 sm:w-20 sm:h-20" },
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        CPU Privilege Rings
      </h4>
      <div className="flex justify-center">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72">
          {rings.map((r, i) => (
            <motion.div
              key={r.ring}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.15 * (rings.length - i), duration: 0.5 }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${r.size} rounded-full border-2 border-${r.color}/40 bg-${r.color}/5 flex items-end justify-center pb-1 sm:pb-2`}
            >
              <span className={`text-${r.color} text-[8px] sm:text-[9px] font-mono`}>
                Ring {r.ring}: {r.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="text-text-muted text-xs text-center mt-4"
      >
        Ring 0 = most privileged (kernel). Ring 3 = least privileged (apps). The VM conflict: guest OS expects Ring 0 but runs in Ring 1 or 3.
      </motion.p>
    </div>
  );
}

function VmExitFlowDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const steps = [
    { label: "Guest Running", desc: "App executes normally", color: "docker-blue" },
    { label: "Privileged Instruction", desc: "Guest OS tries Ring 0 op", color: "docker-amber" },
    { label: "VM Exit", desc: "CPU traps to hypervisor", color: "docker-red" },
    { label: "Hypervisor Handles", desc: "Emulates the operation", color: "docker-violet" },
    { label: "VM Entry", desc: "CPU returns to guest", color: "docker-teal" },
    { label: "Guest Resumes", desc: "Continues from where it left off", color: "docker-blue" },
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        VM Exit / VM Entry Flow
      </h4>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 * i, duration: 0.4 }}
              className={`bg-${step.color}/10 border border-${step.color}/30 rounded-lg px-3 py-2 text-center min-w-[90px]`}
            >
              <div className={`text-${step.color} font-bold text-[10px]`}>{step.label}</div>
              <div className="text-text-muted text-[8px] mt-0.5">{step.desc}</div>
            </motion.div>
            {i < steps.length - 1 && (
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

export default function CpuVirt() {
  return (
    <SectionWrapper id="sec-cpu-virt" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        CPU Virtualization
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        The CPU is the heart of virtualization. The hypervisor must let each VM execute its own kernel code
        while preventing any single VM from taking control of the physical hardware. The challenge comes from
        CPU privilege rings, which we introduced in the Primer.
      </p>

      <RingDiagram />

      <p className="text-text-secondary leading-relaxed mb-6">
        The problem: a guest OS <em>expects</em> to run in Ring 0 (as we learned, that&apos;s where kernels run).
        But the hypervisor is already in Ring 0. If we let the guest run there too, it could control the
        entire machine. Over the decades, three techniques have solved this:
      </p>

      <div className="space-y-4 mb-8">
        {[
          {
            title: "Trap-and-Emulate",
            era: "Classic approach",
            desc: "The guest OS runs in a lower privilege ring (Ring 1). When it executes a privileged instruction (as we learned in the Primer, these are CPU operations that only Ring 0 can perform), the CPU traps to the hypervisor, which emulates the instruction safely. Simple but doesn't work on x86 — some sensitive instructions silently fail instead of trapping.",
            color: "docker-amber",
          },
          {
            title: "Binary Translation",
            era: "VMware, ~1999",
            desc: "The hypervisor scans guest code at runtime and rewrites problematic instructions on the fly. Non-privileged code runs at native speed; only ~5% of instructions need translation. This made x86 virtualization practical before hardware support existed.",
            color: "docker-violet",
          },
          {
            title: "Hardware-Assisted (VT-x / AMD-V)",
            era: "Intel 2005, AMD 2006",
            desc: "The CPU adds a new privilege level (VMX root/non-root on Intel). Guest code runs in non-root mode at full speed. Privileged operations trigger a lightweight VM Exit to the hypervisor, which handles them and resumes the guest with VM Entry. This is how all modern hypervisors work.",
            color: "docker-blue",
          },
        ].map((technique) => (
          <div
            key={technique.title}
            className="bg-story-card rounded-xl p-6 border border-story-border card-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <h4 className={`text-${technique.color} font-semibold text-sm`}>{technique.title}</h4>
              <span className="text-text-muted text-[10px] font-mono bg-story-surface px-2 py-0.5 rounded">
                {technique.era}
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">{technique.desc}</p>
          </div>
        ))}
      </div>

      <VmExitFlowDiagram />

      <InfoCard variant="tip" title="VM Entry / VM Exit">
        On Intel{" "}
        <TermDefinition term="VT-x" definition="Intel's hardware virtualization extension — adds CPU instructions specifically for running virtual machines efficiently" />,
        a <code>VMLAUNCH</code> or <code>VMRESUME</code> instruction enters the guest (VM Entry).
        When the guest hits a privileged operation, the CPU automatically transitions back to the hypervisor (VM Exit).
        The{" "}
        <TermDefinition term="VMCS" definition="Virtual Machine Control Structure — a data structure in memory that stores all guest and host CPU state for fast VM switching" />{" "}
        stores all the guest/host state for fast switching. Modern CPUs achieve VM exits in ~1 microsecond.
      </InfoCard>
    </SectionWrapper>
  );
}
