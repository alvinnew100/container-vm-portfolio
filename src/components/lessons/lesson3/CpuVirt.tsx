"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";

export default function CpuVirt() {
  return (
    <SectionWrapper id="sec-cpu-virt" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        CPU Virtualization
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        The CPU is the heart of virtualization. The hypervisor must let each VM execute its own kernel code
        while preventing any single VM from taking control of the physical hardware. Over the decades,
        three major techniques have evolved:
      </p>

      <div className="space-y-4 mb-8">
        {[
          {
            title: "Trap-and-Emulate",
            era: "Classic approach",
            desc: "The guest OS runs in a lower privilege ring (Ring 1). When it executes a privileged instruction (e.g., modifying page tables), the CPU traps to the hypervisor in Ring 0, which emulates the instruction safely. Simple but doesn't work on x86 — some sensitive instructions don't trap.",
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

      <InfoCard variant="tip" title="VM Entry / VM Exit">
        On Intel VT-x, a <code>VMLAUNCH</code> or <code>VMRESUME</code> instruction enters the guest (VM Entry).
        When the guest hits a privileged operation, the CPU automatically transitions back to the hypervisor (VM Exit).
        The VMCS (Virtual Machine Control Structure) stores all the guest/host state for fast switching.
        Modern CPUs achieve VM exits in ~1 microsecond.
      </InfoCard>
    </SectionWrapper>
  );
}
