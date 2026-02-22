"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function NetworkDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow mb-8">
      <h4 className="text-text-primary font-semibold text-sm mb-6 text-center">
        Docker Bridge Network Topology
      </h4>
      <div className="max-w-sm mx-auto">
        {/* Host */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="border-2 border-dashed border-story-border rounded-xl p-4"
        >
          <div className="text-text-muted text-[10px] font-mono mb-3 text-center">Host Network Stack</div>

          {/* Containers */}
          <div className="flex gap-3 justify-center mb-3">
            {["web (172.17.0.2)", "api (172.17.0.3)", "db (172.17.0.4)"].map((c, i) => (
              <motion.div
                key={c}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                className="bg-docker-blue/10 border border-docker-blue/30 rounded-lg px-2 py-2 text-center"
              >
                <div className="text-docker-blue text-[10px] font-semibold">{c.split(" ")[0]}</div>
                <div className="text-text-muted text-[8px] font-mono">{c.match(/\(.*\)/)?.[0]}</div>
              </motion.div>
            ))}
          </div>

          {/* veth pairs */}
          <div className="flex justify-center gap-3 mb-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-0.5 h-4 bg-docker-teal/40 mx-auto" style={{ width: "2px" }} />
            ))}
          </div>

          {/* Bridge */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="bg-docker-teal/10 border border-docker-teal/30 rounded-lg px-4 py-2 text-center mb-3"
          >
            <span className="text-docker-teal font-semibold text-xs">docker0 Bridge (172.17.0.1)</span>
          </motion.div>

          {/* eth0 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="bg-story-dark rounded-lg px-4 py-2 text-center"
          >
            <span className="text-white/70 text-xs">eth0 (Host) → Internet</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function NetworkTypes() {
  return (
    <SectionWrapper id="sec-network-types" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Docker Networking
      </h3>
      <p className="text-text-secondary leading-relaxed mb-8">
        Docker creates isolated network environments for containers using Linux network namespaces, virtual
        ethernet pairs (veth), and software bridges. Understanding Docker networking is essential for
        building multi-container applications.
      </p>

      <NetworkDiagram />

      <div className="space-y-4 mb-8">
        {[
          {
            title: "Bridge (default)",
            desc: "Containers connect to a software bridge (docker0). They can communicate with each other via IP and reach the internet through NAT. This is the default network mode.",
            color: "docker-blue",
          },
          {
            title: "Custom Bridge (user-defined)",
            desc: "Like the default bridge but with automatic DNS resolution — containers can reach each other by name. Recommended for multi-container apps. Created with docker network create.",
            color: "docker-teal",
          },
          {
            title: "Host",
            desc: "Container shares the host's network namespace directly. No network isolation, but no NAT overhead either. The container binds to host ports directly. Useful for performance-critical networking.",
            color: "docker-violet",
          },
          {
            title: "None",
            desc: "Container gets no network interface except loopback. Complete network isolation. Useful for batch jobs or security-sensitive workloads that don't need network access.",
            color: "docker-amber",
          },
        ].map((net) => (
          <div key={net.title} className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
            <h4 className={`text-${net.color} font-semibold text-sm mb-1`}>{net.title}</h4>
            <p className="text-text-secondary text-sm leading-relaxed">{net.desc}</p>
          </div>
        ))}
      </div>

      <InfoCard variant="info" title="How Docker Bridge Networking Works">
        For each container on a bridge network, Docker: 1. Creates a veth pair (virtual ethernet cable).
        2. Places one end inside the container&apos;s network namespace as <code>eth0</code>.
        3. Attaches the other end to the bridge (<code>docker0</code>).
        4. Assigns an IP from the bridge&apos;s subnet. 5. Adds iptables NAT rules for outbound traffic.
      </InfoCard>
    </SectionWrapper>
  );
}
