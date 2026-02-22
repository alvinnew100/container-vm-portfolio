"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import AnalogyCard from "@/components/story/AnalogyCard";
import KnowledgeCheck from "@/components/story/KnowledgeCheck";

function HypervisorStackDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const type1Layers = [
    { label: "VM 1", sublabel: "Guest OS + Apps", color: "docker-blue" },
    { label: "VM 2", sublabel: "Guest OS + Apps", color: "docker-teal" },
  ];

  const type2Layers = [
    { label: "VM 1", sublabel: "Guest OS + Apps", color: "docker-violet" },
    { label: "VM 2", sublabel: "Guest OS + Apps", color: "docker-amber" },
  ];

  return (
    <div ref={ref} className="grid sm:grid-cols-2 gap-6 mb-8">
      {/* Type 1 */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="bg-story-card rounded-2xl border border-story-border card-shadow overflow-hidden"
      >
        <div className="bg-docker-blue/10 px-4 py-3 border-b border-story-border text-center">
          <span className="text-docker-blue font-bold text-sm">Type 1 — Bare-Metal</span>
        </div>
        <div className="p-4 space-y-1.5">
          <div className="flex gap-2">
            {type1Layers.map((vm, i) => (
              <motion.div
                key={vm.label}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + 0.1 * i, duration: 0.4 }}
                className={`flex-1 bg-${vm.color}/10 border border-${vm.color}/20 rounded-lg p-2 text-center`}
              >
                <div className={`text-${vm.color} font-semibold text-[10px]`}>{vm.label}</div>
                <div className="text-text-muted text-[9px]">{vm.sublabel}</div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="bg-docker-blue/15 rounded-lg px-2 py-2 text-center"
          >
            <div className="text-docker-blue font-bold text-[10px]">Hypervisor</div>
            <div className="text-text-muted text-[9px]">Runs directly on hardware</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="bg-story-dark rounded-lg px-2 py-1.5 text-center"
          >
            <span className="text-white/70 text-[10px]">Hardware</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Type 2 */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="bg-story-card rounded-2xl border border-story-border card-shadow overflow-hidden"
      >
        <div className="bg-docker-violet/10 px-4 py-3 border-b border-story-border text-center">
          <span className="text-docker-violet font-bold text-sm">Type 2 — Hosted</span>
        </div>
        <div className="p-4 space-y-1.5">
          <div className="flex gap-2">
            {type2Layers.map((vm, i) => (
              <motion.div
                key={vm.label}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + 0.1 * i, duration: 0.4 }}
                className={`flex-1 bg-${vm.color}/10 border border-${vm.color}/20 rounded-lg p-2 text-center`}
              >
                <div className={`text-${vm.color} font-semibold text-[10px]`}>{vm.label}</div>
                <div className="text-text-muted text-[9px]">{vm.sublabel}</div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="bg-docker-violet/15 rounded-lg px-2 py-2 text-center"
          >
            <div className="text-docker-violet font-bold text-[10px]">Hypervisor</div>
            <div className="text-text-muted text-[9px]">Runs as an app</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="bg-docker-teal/10 rounded-lg px-2 py-1.5 text-center"
          >
            <span className="text-docker-teal text-[10px] font-semibold">Host OS</span>
            <span className="text-text-muted text-[9px] ml-1">(Windows, macOS, Linux)</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="bg-story-dark rounded-lg px-2 py-1.5 text-center"
          >
            <span className="text-white/70 text-[10px]">Hardware</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Hypervisors() {
  return (
    <SectionWrapper id="sec-hypervisors" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Hypervisors: Type 1 vs Type 2
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        All hypervisors share the same goal &mdash; running multiple VMs on one physical machine &mdash;
        but they differ in <em>where they sit</em> in the software stack.
      </p>

      <AnalogyCard
        concept="Landlord vs Subletter"
        analogy="A Type 1 hypervisor is like a professional landlord who owns the building directly — maximum control and efficiency. A Type 2 hypervisor is like a subletter: they rent from the building owner (host OS), then rent out rooms (VMs). More convenient to set up, but one extra layer of middleman."
      />

      <div className="mt-8">
        <HypervisorStackDiagram />
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {/* Type 1 */}
        <div className="bg-story-card rounded-2xl border border-story-border card-shadow overflow-hidden">
          <div className="bg-docker-blue/10 px-6 py-4 border-b border-story-border">
            <h4 className="text-docker-blue font-bold text-sm">Type 1 — Bare-Metal</h4>
            <p className="text-text-muted text-xs mt-1">Runs directly on hardware</p>
          </div>
          <div className="p-6">
            <div className="space-y-3 mb-4">
              {[
                { name: "VMware ESXi", desc: "Enterprise standard. vSphere ecosystem." },
                { name: "KVM", desc: "Linux kernel module. Powers AWS, GCP." },
                { name: "Microsoft Hyper-V", desc: "Built into Windows Server." },
                { name: "Xen", desc: "Open-source. Powered early AWS EC2." },
              ].map((h) => (
                <div key={h.name} className="flex items-start gap-2">
                  <span className="text-docker-blue mt-1 flex-shrink-0 text-xs">&#9654;</span>
                  <div>
                    <span className="text-text-primary text-sm font-semibold">{h.name}</span>
                    <span className="text-text-secondary text-sm ml-1">— {h.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-docker-teal/5 rounded-lg p-3 border border-docker-teal/20">
              <p className="text-text-secondary text-xs leading-relaxed">
                <strong className="text-docker-teal">Best for:</strong> Data centers, cloud providers,
                production workloads. Near-native performance, strong isolation.
              </p>
            </div>
          </div>
        </div>

        {/* Type 2 */}
        <div className="bg-story-card rounded-2xl border border-story-border card-shadow overflow-hidden">
          <div className="bg-docker-violet/10 px-6 py-4 border-b border-story-border">
            <h4 className="text-docker-violet font-bold text-sm">Type 2 — Hosted</h4>
            <p className="text-text-muted text-xs mt-1">Runs on top of a host OS</p>
          </div>
          <div className="p-6">
            <div className="space-y-3 mb-4">
              {[
                { name: "VirtualBox", desc: "Free, cross-platform. Great for learning." },
                { name: "VMware Workstation", desc: "Feature-rich desktop hypervisor." },
                { name: "VMware Fusion", desc: "macOS desktop hypervisor." },
                { name: "Parallels", desc: "macOS VM host, Apple Silicon support." },
              ].map((h) => (
                <div key={h.name} className="flex items-start gap-2">
                  <span className="text-docker-violet mt-1 flex-shrink-0 text-xs">&#9654;</span>
                  <div>
                    <span className="text-text-primary text-sm font-semibold">{h.name}</span>
                    <span className="text-text-secondary text-sm ml-1">— {h.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-docker-violet/5 rounded-lg p-3 border border-docker-violet/20">
              <p className="text-text-secondary text-xs leading-relaxed">
                <strong className="text-docker-violet">Best for:</strong> Development, testing,
                running a different OS on your desktop. Easier setup, more overhead.
              </p>
            </div>
          </div>
        </div>
      </div>

      <InfoCard variant="info" title="Type 1 vs Type 2 — The Key Difference">
        A Type 1 hypervisor <em>replaces</em> the operating system — it runs directly on the hardware (in Ring 0, as we learned in the Primer).
        A Type 2 hypervisor runs <em>as an application</em> within an existing OS. Type 1 has less overhead
        and better performance; Type 2 is easier to install and use on a desktop.
      </InfoCard>

      <KnowledgeCheck
        id="lesson2-hyp-kc1"
        question="A Type 1 hypervisor runs directly on hardware. A Type 2 runs on top of a host OS. Which is ESXi?"
        options={["Type 1 (bare-metal)", "Type 2 (hosted)"]}
        correctIndex={0}
        explanation="ESXi is a Type 1 (bare-metal) hypervisor — it installs directly on the server hardware with no host OS underneath. VirtualBox and VMware Workstation are Type 2 hypervisors that run on top of Windows/Linux/macOS."
        hint="ESXi replaces the host OS entirely — it IS the operating system."
      />
    </SectionWrapper>
  );
}
