"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";

export default function Hypervisors() {
  return (
    <SectionWrapper id="sec-hypervisors" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Hypervisors: Type 1 vs Type 2
      </h3>
      <p className="text-text-secondary leading-relaxed mb-8">
        All hypervisors share the same goal &mdash; running multiple VMs on one physical machine &mdash;
        but they differ in <em>where they sit</em> in the software stack.
      </p>

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
        A Type 1 hypervisor <em>replaces</em> the operating system — it runs directly on the hardware.
        A Type 2 hypervisor runs <em>as an application</em> within an existing OS. Type 1 has less overhead
        and better performance; Type 2 is easier to install and use on a desktop.
      </InfoCard>
    </SectionWrapper>
  );
}
