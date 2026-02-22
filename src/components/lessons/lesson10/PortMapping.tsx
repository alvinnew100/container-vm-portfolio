"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import TerminalBlock from "@/components/story/TerminalBlock";
import InfoCard from "@/components/story/InfoCard";
import TermDefinition from "@/components/story/TermDefinition";
import FillInBlank from "@/components/story/FillInBlank";

function PortMappingDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const steps = [
    { label: "Host:8080", desc: "Incoming request", color: "docker-blue" },
    { label: "iptables DNAT", desc: "Rewrites destination", color: "docker-violet" },
    { label: "docker0 bridge", desc: "Forwards packet", color: "docker-teal" },
    { label: "Container:80", desc: "nginx receives", color: "docker-amber" },
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Port Mapping: Host:8080 &rarr; Container:80
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
    </div>
  );
}

export default function PortMapping() {
  return (
    <>
    <SectionWrapper id="sec-port-mapping" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Port Mapping
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        By default, container ports are not accessible from outside the Docker network. The <code>-p</code> flag
        creates{" "}
        <TermDefinition term="DNAT" definition="Destination NAT — an iptables rule that rewrites the destination address of incoming packets, forwarding traffic from one port to another" />{" "}
        rules that forward traffic from a host port to a container port.
      </p>

      <PortMappingDiagram />

      <p className="text-text-secondary text-sm leading-relaxed mb-6">
        <TermDefinition term="0.0.0.0" definition="a special IP that means 'all network interfaces' — binding to 0.0.0.0 makes a port accessible from any network, not just localhost" />{" "}
        is the default bind address. Use <code>127.0.0.1</code> to restrict access to the local machine only.
      </p>

      <div className="bg-story-card rounded-2xl border border-story-border card-shadow overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-story-surface">
                <th className="text-left px-4 py-3 text-text-primary font-semibold">Flag</th>
                <th className="text-left px-4 py-3 text-text-primary font-semibold">Meaning</th>
                <th className="text-left px-4 py-3 text-text-primary font-semibold">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-story-border">
              {[
                { flag: "-p 8080:80", meaning: "Map host 8080 → container 80", example: "Access nginx at localhost:8080" },
                { flag: "-p 80", meaning: "Map random host port → container 80", example: "Docker assigns a free host port" },
                { flag: "-p 127.0.0.1:8080:80", meaning: "Bind to localhost only", example: "Not accessible from other machines" },
                { flag: "-p 8080:80/udp", meaning: "Map UDP port", example: "For DNS or game servers" },
                { flag: "-P", meaning: "Map all EXPOSE'd ports randomly", example: "All ports in Dockerfile get mapped" },
              ].map((row) => (
                <tr key={row.flag}>
                  <td className="px-4 py-2"><code className="text-docker-blue text-xs">{row.flag}</code></td>
                  <td className="px-4 py-2 text-text-secondary">{row.meaning}</td>
                  <td className="px-4 py-2 text-text-muted text-xs">{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TerminalBlock
        title="port mapping examples"
        lines={[
          "# Run nginx with port mapping",
          "$ docker run -d -p 8080:80 --name web nginx",
          "",
          "# Check the mapping",
          "$ docker port web",
          "80/tcp -> 0.0.0.0:8080",
          "",
          "# Access from the host",
          "$ curl localhost:8080",
          '<!DOCTYPE html>...<h1>Welcome to nginx!</h1>...',
          "",
          "# See the iptables rules Docker created",
          "$ sudo iptables -t nat -L DOCKER -n",
          "DNAT  tcp  --  0.0.0.0/0  0.0.0.0/0  tcp dpt:8080 to:172.17.0.2:80",
        ]}
      />

      <div className="mt-6">
        <InfoCard variant="warning" title="Port Conflicts">
          Two containers can&apos;t map to the same host port. If port 8080 is already in use, you&apos;ll get
          &ldquo;bind: address already in use.&rdquo; Use <code>docker ps</code> to check existing mappings,
          or let Docker auto-assign with <code>-p 80</code> (no host port specified).
        </InfoCard>
      </div>
    </SectionWrapper>

      <FillInBlank
        id="lesson10-port-fill1"
        prompt="The docker flag -p 8080:3000 maps host port {blank} to container port {blank}."
        blanks={[
          { answer: "8080", placeholder: "host port" },
          { answer: "3000", placeholder: "container port" },
        ]}
        explanation="The -p flag format is HOST:CONTAINER. So -p 8080:3000 means traffic hitting localhost:8080 is forwarded to port 3000 inside the container."
        hint="The format is -p HOST_PORT:CONTAINER_PORT."
      />
    </>
  );
}
