"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";

function IoPathDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const paths = [
    {
      label: "Full Emulation",
      color: "docker-amber",
      hops: ["VM App", "Guest Driver", "Hypervisor", "Host Driver", "Hardware"],
      speed: "Slowest",
    },
    {
      label: "Paravirtual (virtio)",
      color: "docker-teal",
      hops: ["VM App", "virtio Driver", "Hypervisor", "Hardware"],
      speed: "Good",
    },
    {
      label: "SR-IOV Passthrough",
      color: "docker-blue",
      hops: ["VM App", "VF Driver", "Hardware"],
      speed: "Near-native",
    },
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        I/O Virtualization Paths
      </h4>
      <div className="space-y-5">
        {paths.map((path, pi) => (
          <motion.div
            key={path.label}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 * pi, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-${path.color} font-semibold text-xs`}>{path.label}</span>
              <span className="text-text-muted text-[10px] font-mono">{path.speed}</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {path.hops.map((hop, i) => (
                <div key={hop} className="flex items-center gap-1">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.2 * pi + 0.08 * i, duration: 0.3 }}
                    className={`bg-${path.color}/10 border border-${path.color}/20 rounded px-2 py-1 text-[9px] font-mono text-${path.color}`}
                  >
                    {hop}
                  </motion.div>
                  {i < path.hops.length - 1 && (
                    <span className="text-text-muted text-[10px]">&rarr;</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="text-text-muted text-xs text-center mt-4"
      >
        Fewer hops = less CPU overhead and higher throughput. SR-IOV bypasses the hypervisor entirely.
      </motion.p>
    </div>
  );
}

export default function IoVirt() {
  return (
    <SectionWrapper id="sec-io-virt" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        I/O Virtualization
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        I/O virtualization determines how VMs access physical devices like network cards, disks, and GPUs.
        The approach chosen dramatically affects performance, compatibility, and the number of VMs a host can support.
      </p>

      <AnalogyCard
        concept="SR-IOV = Dedicated Highway Lanes"
        analogy="Full emulation is like all cars going through one toll booth — slow. Paravirtual (virtio) is like an express lane with fewer stops. SR-IOV gives each VM its own dedicated lane with no toll booth at all — near-native speed."
      />

      <div className="mt-8">
        <IoPathDiagram />
      </div>

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

      <InfoCard variant="info" title="Key Terms">
        <TermDefinition term="PCIe" definition="Peripheral Component Interconnect Express — the high-speed bus that connects devices (GPUs, NICs, SSDs) to the CPU" />.{" "}
        <TermDefinition term="IOMMU" definition="I/O Memory Management Unit — hardware that translates device memory addresses, enabling safe direct hardware access from VMs (Intel VT-d / AMD-Vi)" />.{" "}
        <TermDefinition term="SR-IOV" definition="Single Root I/O Virtualization — a PCIe spec that lets one physical device present multiple Virtual Functions (VFs), each assignable to a different VM" />.
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
