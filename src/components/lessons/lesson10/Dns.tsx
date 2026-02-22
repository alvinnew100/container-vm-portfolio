"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import TerminalBlock from "@/components/story/TerminalBlock";
import InfoCard from "@/components/story/InfoCard";
import KnowledgeCheck from "@/components/story/KnowledgeCheck";

function DnsFlowDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const steps = [
    { label: "Container A", desc: '"where is api?"', color: "docker-blue" },
    { label: "Docker DNS", desc: "127.0.0.11", color: "docker-teal" },
    { label: "Resolves name", desc: 'api → 172.18.0.2', color: "docker-violet" },
    { label: "Container B (api)", desc: "172.18.0.2", color: "docker-amber" },
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Docker DNS Resolution
      </h4>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 * i, duration: 0.4 }}
              className={`bg-${step.color}/10 border border-${step.color}/30 rounded-lg px-3 py-2 text-center min-w-[90px]`}
            >
              <div className={`text-${step.color} font-bold text-xs`}>{step.label}</div>
              <div className="text-text-muted text-[9px] mt-0.5">{step.desc}</div>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 * i + 0.1, duration: 0.3 }}
                className="text-text-muted text-xs font-mono"
              >
                &rarr;
              </motion.span>
            )}
          </div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="text-text-muted text-xs text-center mt-4"
      >
        Docker&apos;s embedded DNS (as we learned in the Primer, DNS translates names to IP addresses) runs at 127.0.0.11 inside each container
      </motion.p>
    </div>
  );
}

export default function Dns() {
  return (
    <>
    <SectionWrapper id="sec-dns" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Container DNS Resolution
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        On <strong className="text-text-primary">user-defined bridge networks</strong>, Docker runs an embedded DNS server
        that lets containers find each other by name. This is one of the biggest advantages of custom networks
        over the default bridge, where you&apos;d need to use IP addresses.
      </p>

      <DnsFlowDiagram />

      <TerminalBlock
        title="DNS discovery demo"
        lines={[
          "# Create a custom bridge network",
          "$ docker network create myapp-net",
          "",
          "# Start two containers on the same network",
          "$ docker run -d --name api --network myapp-net nginx",
          "$ docker run -d --name web --network myapp-net alpine sleep 3600",
          "",
          "# From 'web', resolve 'api' by container name",
          "$ docker exec web ping -c 2 api",
          "PING api (172.18.0.2): 56 data bytes",
          "64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.089 ms",
          "64 bytes from 172.18.0.2: seq=1 ttl=64 time=0.107 ms",
          "",
          "# DNS resolution works — no hardcoded IPs needed!",
          "$ docker exec web nslookup api",
          "Name:      api",
          "Address 1: 172.18.0.2 api.myapp-net",
        ]}
      />

      <div className="mt-6 grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
          <h4 className="text-docker-blue font-semibold text-sm mb-2">Default Bridge</h4>
          <ul className="space-y-1 text-text-secondary text-sm">
            <li>&#10008; No automatic DNS</li>
            <li>&#10008; Must use IP addresses</li>
            <li>&#10008; All containers on same default network</li>
          </ul>
        </div>
        <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
          <h4 className="text-docker-teal font-semibold text-sm mb-2">Custom Bridge</h4>
          <ul className="space-y-1 text-text-secondary text-sm">
            <li>&#10004; Automatic DNS by container name</li>
            <li>&#10004; Network aliases supported</li>
            <li>&#10004; Network isolation between apps</li>
          </ul>
        </div>
      </div>

      <InfoCard variant="tip" title="Always Use Custom Networks">
        For any multi-container application, create a custom network with <code>docker network create</code>.
        This gives you DNS-based service discovery, better isolation, and the ability to connect/disconnect
        containers dynamically.
      </InfoCard>
    </SectionWrapper>

      <KnowledgeCheck
        id="lesson10-dns-kc1"
        question="How does Docker resolve service names like 'db' to IP addresses on user-defined networks?"
        options={["Embedded DNS server at 127.0.0.11", "The host's /etc/resolv.conf"]}
        correctIndex={0}
        explanation="Docker runs an embedded DNS server at 127.0.0.11 for user-defined networks. Containers on the same user-defined network can reach each other by service name. This DNS server is NOT available on the default bridge."
        hint="Docker has its own DNS server for custom networks."
      />
    </>
  );
}
