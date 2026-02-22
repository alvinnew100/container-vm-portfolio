"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";
import InfoCard from "@/components/story/InfoCard";
import KnowledgeCheck from "@/components/story/KnowledgeCheck";

const DEVICES = [
  { label: "Laptop", ip: "192.168.1.10", x: 10, y: 60 },
  { label: "Phone", ip: "192.168.1.11", x: 10, y: 80 },
  { label: "Server", ip: "203.0.113.5", x: 80, y: 70 },
];

function NetworkDiagram() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Network Topology
      </h4>

      <div className="relative bg-story-dark rounded-xl p-6 min-h-[280px] overflow-hidden">
        {/* Local network box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="absolute left-4 top-4 bottom-4 w-[40%] border border-docker-teal/30 rounded-xl bg-docker-teal/5"
        >
          <div className="text-[9px] font-mono text-docker-teal px-2 py-1">
            Local Network (192.168.1.0/24)
          </div>
        </motion.div>

        {/* Router */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="absolute left-[48%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <div className="bg-docker-blue/20 border border-docker-blue/40 rounded-lg px-3 py-2 text-center">
            <div className="text-docker-blue text-xs font-bold">Router</div>
            <div className="text-[8px] text-docker-blue/60 font-mono">NAT</div>
          </div>
        </motion.div>

        {/* Internet cloud */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute right-4 top-4 bottom-4 w-[35%] border border-docker-violet/30 rounded-xl bg-docker-violet/5"
        >
          <div className="text-[9px] font-mono text-docker-violet px-2 py-1">
            Internet
          </div>
        </motion.div>

        {/* Devices */}
        {DEVICES.map((device, i) => (
          <motion.div
            key={device.label}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 + i * 0.15, duration: 0.4 }}
            className="absolute"
            style={{ left: `${device.x}%`, top: `${device.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <div className="bg-story-card/10 border border-white/20 rounded-lg px-2 py-1.5 text-center">
              <div className="text-white/80 text-[10px] font-semibold">{device.label}</div>
              <div className="text-white/40 text-[8px] font-mono">{device.ip}</div>
            </div>
          </motion.div>
        ))}

        {/* Animated packet */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={
            isInView
              ? {
                  opacity: [0, 1, 1, 0],
                  left: ["15%", "45%", "55%", "80%"],
                  top: ["55%", "50%", "50%", "65%"],
                }
              : {}
          }
          transition={{ delay: 1.5, duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
          className="absolute w-2 h-2 bg-docker-blue rounded-full shadow-lg shadow-docker-blue/50"
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="text-text-muted text-xs text-center mt-4"
      >
        Data packets flow from device &rarr; router (NAT) &rarr; internet &rarr; destination server
      </motion.p>
    </div>
  );
}

export default function Networking101() {
  return (
    <SectionWrapper id="sec-networking" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Networking Fundamentals
      </h3>

      <p className="text-text-secondary leading-relaxed mb-6">
        Networking is how computers talk to each other. Every concept here — IP addresses, ports,
        DNS, NAT — will come back when we discuss Docker networking in Lesson 10.
      </p>

      <AnalogyCard
        concept="Addresses and Doors"
        analogy="An IP address is like a street address — it identifies which building (computer) to deliver to. A port is like an apartment number — it tells you which program inside the computer should receive the data. DNS is the phone book — it translates human-readable names like 'google.com' to IP addresses like '142.250.80.46'."
      />

      <div className="mt-8">
        <NetworkDiagram />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {[
          {
            term: "IP Address",
            def: "a unique number assigned to every device on a network (e.g., 192.168.1.10)",
            detail: "Private IPs (192.168.x.x) work inside your network. Public IPs are visible on the internet.",
            color: "docker-blue",
          },
          {
            term: "Port",
            def: "a number (0–65535) that identifies a specific program on a computer",
            detail: "Web servers use port 80 (HTTP) or 443 (HTTPS). SSH uses port 22. Each port is like a separate door.",
            color: "docker-teal",
          },
          {
            term: "DNS",
            def: "Domain Name System — translates names like google.com to IP addresses",
            detail: "Without DNS, you'd need to memorize numbers for every website.",
            color: "docker-violet",
          },
          {
            term: "NAT",
            def: "Network Address Translation — lets multiple devices share one public IP",
            detail: "Your router does NAT: it replaces your private IP with its public IP when sending data out.",
            color: "docker-amber",
          },
        ].map((item) => (
          <div
            key={item.term}
            className={`bg-story-card rounded-xl p-5 border border-story-border card-shadow`}
          >
            <div className={`text-${item.color} font-semibold text-sm mb-1`}>
              {item.term}
            </div>
            <p className="text-text-secondary text-xs leading-relaxed mb-2">{item.def}</p>
            <p className="text-text-muted text-xs leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4 mb-8">
        <p className="text-text-secondary leading-relaxed">
          <TermDefinition term="iptables" definition="a Linux firewall tool that controls which network packets are allowed in, out, or forwarded — Docker uses it heavily behind the scenes" />{" "}
          is the tool that makes Docker networking work. When you run{" "}
          <code>docker run -p 8080:80</code>, Docker creates iptables rules that forward traffic from
          your host&apos;s port 8080 to the container&apos;s port 80.
        </p>
      </div>

      <InfoCard variant="info" title="Coming Up in Lesson 10">
        Docker creates virtual networks, virtual ethernet cables (veth pairs), and uses
        iptables for port mapping. All of these build directly on the concepts introduced here.
      </InfoCard>

      <KnowledgeCheck
        id="lesson0-net-kc1"
        question="When a laptop behind a router sends a packet to a web server, what source IP does the server see?"
        options={["Router's public IP", "Laptop's private IP"]}
        correctIndex={0}
        explanation="NAT (Network Address Translation) replaces the laptop's private IP (e.g., 192.168.1.5) with the router's public IP before sending packets to the internet. The server only sees the router's public address."
        hint="Private IP addresses (192.168.x.x) can't be routed on the public internet."
      />
    </SectionWrapper>
  );
}
