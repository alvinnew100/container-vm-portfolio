"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import TermDefinition from "@/components/story/TermDefinition";
import KnowledgeCheck from "@/components/story/KnowledgeCheck";

function DecisionTreeDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const decisions = [
    { question: "Need strong isolation from untrusted code?", yes: "VM", no: null },
    { question: "Need a different OS than the host?", yes: "VM", no: null },
    { question: "Need fast startup & high density?", yes: "Container", no: null },
    { question: "Need reproducible, immutable deploys?", yes: "Container", no: "Either works" },
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Decision Guide
      </h4>
      <div className="space-y-3">
        {decisions.map((d, i) => (
          <motion.div
            key={d.question}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15 * i, duration: 0.4 }}
            className="flex items-center gap-3 flex-wrap"
          >
            <div className="bg-story-surface rounded-lg px-4 py-2 flex-1 min-w-[200px]">
              <span className="text-text-primary text-sm">{d.question}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-muted text-xs">Yes &rarr;</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                d.yes === "VM"
                  ? "bg-docker-violet/10 text-docker-violet"
                  : "bg-docker-blue/10 text-docker-blue"
              }`}>
                {d.yes}
              </span>
            </div>
            {d.no && (
              <div className="flex items-center gap-2">
                <span className="text-text-muted text-xs">No &rarr;</span>
                <span className="text-xs font-bold px-2 py-1 rounded bg-docker-teal/10 text-docker-teal">
                  {d.no}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ResourceOverheadDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Resource Overhead: 5 VMs vs 50 Containers
      </h4>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-docker-violet font-semibold text-xs">5 VMs (each 1GB RAM + guest OS)</span>
            <span className="text-text-muted text-[10px]">~8 GB total</span>
          </div>
          <div className="h-5 bg-story-surface rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "80%" } : {}}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="h-full bg-docker-violet/50 rounded-full flex items-center justify-end pr-2"
            >
              <span className="text-[9px] text-white font-mono">80% host RAM</span>
            </motion.div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-docker-blue font-semibold text-xs">50 Containers (each ~50MB)</span>
            <span className="text-text-muted text-[10px]">~2.5 GB total</span>
          </div>
          <div className="h-5 bg-story-surface rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "25%" } : {}}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="h-full bg-docker-blue/50 rounded-full flex items-center justify-end pr-2"
            >
              <span className="text-[9px] text-white font-mono">25%</span>
            </motion.div>
          </div>
        </div>
      </div>
      <p className="text-text-muted text-xs text-center mt-4">
        10x more workloads in 3x less memory — that&apos;s the container density advantage
      </p>
    </div>
  );
}

export default function Tradeoffs() {
  return (
    <SectionWrapper id="sec-tradeoffs" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        When to Use Which?
      </h3>
      <p className="text-text-secondary leading-relaxed mb-8">
        VMs and containers are not competitors &mdash; they solve different problems. In many production
        environments, they&apos;re used <em>together</em>: containers run inside VMs for defense in depth.
      </p>

      <DecisionTreeDiagram />
      <ResourceOverheadDiagram />

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow">
          <h4 className="text-docker-violet font-bold text-sm mb-4">Choose VMs when you need...</h4>
          <ul className="space-y-3">
            {[
              "Strong security isolation (multi-tenant, untrusted workloads)",
              "Different operating systems on the same host",
              "Kernel-level customization (custom modules, different kernel versions)",
              "Hardware-level features (GPU passthrough, SR-IOV)",
              "Compliance requirements mandating VM-level separation",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed">
                <span className="text-docker-violet mt-0.5 flex-shrink-0">&#10003;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow">
          <h4 className="text-docker-blue font-bold text-sm mb-4">Choose Containers when you need...</h4>
          <ul className="space-y-3">
            {[
              "Fast startup and scaling (microservices, serverless)",
              "High density — hundreds of instances per host",
              "Reproducible builds and immutable deployments",
              "Developer-friendly workflow (build, ship, run)",
              "CI/CD pipelines with fast, disposable environments",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed">
                <span className="text-docker-blue mt-0.5 flex-shrink-0">&#10003;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <InfoCard variant="tip" title="Best of Both Worlds">
        Most cloud providers run containers inside lightweight VMs.{" "}
        <TermDefinition term="Firecracker" definition="Amazon's lightweight microVM manager — boots a VM in ~125ms, used by AWS Lambda and Fargate" /> microVMs,{" "}
        <TermDefinition term="gVisor" definition="Google's user-space kernel that intercepts container syscalls for extra security without a full VM" />, and{" "}
        <TermDefinition term="Kata Containers" definition="an open-source project that runs each container inside its own lightweight VM for hardware-level isolation" />{" "}
        all combine container speed with VM-level isolation.
      </InfoCard>

      <KnowledgeCheck
        id="lesson4-tradeoff-kc1"
        question="Containers start in under 1 second while VMs take 30-60 seconds. Why?"
        options={["Containers share the host kernel — no OS boot needed", "Containers use faster hardware"]}
        correctIndex={0}
        explanation="Containers don't boot an OS — they just start a process in an isolated namespace on the existing kernel. VMs must boot an entire guest OS (BIOS → bootloader → kernel → init), which takes 30-60 seconds."
        hint="Think about what happens when you start a VM vs when you start a container process."
      />
    </SectionWrapper>
  );
}
