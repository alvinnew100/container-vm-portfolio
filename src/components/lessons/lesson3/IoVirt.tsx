"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";

export default function IoVirt() {
  return (
    <SectionWrapper id="sec-io-virt" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        I/O Virtualization
      </h3>
      <p className="text-text-secondary leading-relaxed mb-8">
        I/O virtualization determines how VMs access physical devices like network cards, disks, and GPUs.
        The approach chosen dramatically affects performance, compatibility, and the number of VMs a host can support.
      </p>

      {/* Comparison table */}
      <div className="bg-story-card rounded-2xl border border-story-border card-shadow overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-story-surface">
                <th className="text-left px-4 py-3 text-text-primary font-semibold">Approach</th>
                <th className="text-left px-4 py-3 text-text-primary font-semibold">Performance</th>
                <th className="text-left px-4 py-3 text-text-primary font-semibold">Compatibility</th>
                <th className="text-left px-4 py-3 text-text-primary font-semibold">Sharing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-story-border">
              <tr>
                <td className="px-4 py-3">
                  <span className="text-docker-amber font-semibold">Full Emulation</span>
                  <div className="text-text-muted text-xs">QEMU-style</div>
                </td>
                <td className="px-4 py-3 text-text-secondary">Slowest — every I/O op traps to hypervisor</td>
                <td className="px-4 py-3 text-text-secondary">Any guest OS — no special drivers needed</td>
                <td className="px-4 py-3 text-text-secondary">Unlimited VMs</td>
              </tr>
              <tr>
                <td className="px-4 py-3">
                  <span className="text-docker-teal font-semibold">Paravirtual (virtio)</span>
                  <div className="text-text-muted text-xs">KVM + virtio drivers</div>
                </td>
                <td className="px-4 py-3 text-text-secondary">Good — batched I/O, fewer traps</td>
                <td className="px-4 py-3 text-text-secondary">Guest needs virtio drivers</td>
                <td className="px-4 py-3 text-text-secondary">Unlimited VMs</td>
              </tr>
              <tr>
                <td className="px-4 py-3">
                  <span className="text-docker-blue font-semibold">SR-IOV</span>
                  <div className="text-text-muted text-xs">Hardware passthrough</div>
                </td>
                <td className="px-4 py-3 text-text-secondary">Near-native — bypasses hypervisor</td>
                <td className="px-4 py-3 text-text-secondary">Needs SR-IOV hardware + drivers</td>
                <td className="px-4 py-3 text-text-secondary">Limited VFs (e.g., 64-256)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <InfoCard variant="info" title="SR-IOV: The Gold Standard for Network I/O">
        SR-IOV (Single Root I/O Virtualization) lets a single PCIe device present multiple Virtual Functions (VFs).
        Each VF is assigned directly to a VM via IOMMU (Intel VT-d / AMD-Vi), bypassing the hypervisor entirely
        for data-plane operations. This achieves near-line-rate networking with minimal CPU overhead.
      </InfoCard>

      <div className="mt-6">
        <InfoCard variant="note" title="virtio — The Paravirtual Standard">
          The <code>virtio</code> specification defines a common interface for virtual devices: <code>virtio-net</code> (networking),
          <code> virtio-blk</code> (block storage), <code>virtio-scsi</code> (SCSI), and <code>virtio-gpu</code> (graphics).
          Guest drivers communicate with the hypervisor through shared memory ring buffers, batching multiple I/O operations
          into a single trap. Most Linux distros include virtio drivers by default.
        </InfoCard>
      </div>
    </SectionWrapper>
  );
}
