"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";

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

      {/* Address translation diagram */}
      <div className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow mb-8">
        <h4 className="text-text-primary font-semibold text-sm mb-4 text-center">Two-Level Address Translation</h4>
        <div className="flex items-center justify-center gap-3 flex-wrap text-xs">
          <div className="bg-docker-blue/10 border border-docker-blue/30 rounded-lg px-4 py-2 text-center">
            <div className="text-docker-blue font-semibold">Guest Virtual</div>
            <div className="text-text-muted">(GVA)</div>
          </div>
          <span className="text-docker-blue font-mono">→</span>
          <div className="bg-docker-teal/10 border border-docker-teal/30 rounded-lg px-4 py-2 text-center">
            <div className="text-docker-teal font-semibold">Guest Physical</div>
            <div className="text-text-muted">(GPA)</div>
          </div>
          <span className="text-docker-teal font-mono">→</span>
          <div className="bg-docker-violet/10 border border-docker-violet/30 rounded-lg px-4 py-2 text-center">
            <div className="text-docker-violet font-semibold">Host Physical</div>
            <div className="text-text-muted">(HPA)</div>
          </div>
        </div>
        <p className="text-text-muted text-xs text-center mt-3">
          Guest page tables handle GVA→GPA. The hypervisor handles GPA→HPA.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
          <h4 className="text-docker-amber font-semibold text-sm mb-2">Shadow Page Tables</h4>
          <p className="text-text-secondary text-sm leading-relaxed">
            The hypervisor maintains a &ldquo;shadow&rdquo; copy of the guest&apos;s page tables that maps
            directly from GVA → HPA. Every time the guest modifies its page tables, the hypervisor must
            trap and update the shadow copy. High overhead — lots of VM exits.
          </p>
        </div>
        <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
          <h4 className="text-docker-blue font-semibold text-sm mb-2">EPT / NPT (Hardware-Assisted)</h4>
          <p className="text-text-secondary text-sm leading-relaxed">
            Intel EPT (Extended Page Tables) and AMD NPT (Nested Page Tables) add a second page table
            walk in hardware. The CPU handles GVA→GPA→HPA in a single memory access, with no hypervisor
            involvement. Much faster — reduces VM exits by ~90% for memory-intensive workloads.
          </p>
        </div>
      </div>

      <InfoCard variant="info" title="TLB and Performance">
        With EPT/NPT, a TLB miss requires a 2D page walk (up to 24 memory accesses in the worst case).
        Modern CPUs mitigate this with large TLBs and VPID (Virtual Processor ID) tags that avoid
        flushing the TLB on VM switches.
      </InfoCard>
    </SectionWrapper>
  );
}
