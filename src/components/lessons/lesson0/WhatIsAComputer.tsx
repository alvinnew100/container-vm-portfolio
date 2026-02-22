"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";
import InfoCard from "@/components/story/InfoCard";

const COMPONENTS = [
  {
    label: "CPU",
    full: "Central Processing Unit",
    desc: "Executes instructions — the brain that does math and makes decisions",
    color: "docker-blue",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5M4.5 15.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    label: "RAM",
    full: "Random Access Memory",
    desc: "Fast, temporary workspace — data disappears when power is off",
    color: "docker-teal",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h12M6 12h12M6 18h12" />
      </svg>
    ),
  },
  {
    label: "Disk",
    full: "Storage Drive (HDD/SSD)",
    desc: "Permanent storage — data survives power off, but slower than RAM",
    color: "docker-violet",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
  },
  {
    label: "NIC",
    full: "Network Interface Card",
    desc: "Connects the computer to a network — sends and receives data",
    color: "docker-amber",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
];

function ArchitectureDiagram() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Computer Architecture
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {COMPONENTS.map((comp, i) => (
          <motion.div
            key={comp.label}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 * i, duration: 0.5 }}
            className={`bg-${comp.color}/5 border border-${comp.color}/20 rounded-xl p-4 text-center`}
          >
            <div className={`text-${comp.color} flex justify-center mb-2`}>
              {comp.icon}
            </div>
            <div className={`text-${comp.color} font-bold text-sm`}>{comp.label}</div>
            <div className="text-text-muted text-[10px] mt-0.5">{comp.full}</div>
            <div className="text-text-secondary text-xs mt-2 leading-snug">{comp.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Bus lines connecting components */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
        className="h-3 bg-gradient-to-r from-docker-blue/20 via-docker-teal/20 to-docker-violet/20 rounded-full mx-4 relative"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[9px] font-mono text-text-muted bg-story-card px-2">SYSTEM BUS</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function WhatIsAComputer() {
  return (
    <SectionWrapper id="sec-what-is-computer" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        What Is a Computer, Really?
      </h3>

      <p className="text-text-secondary leading-relaxed mb-6">
        Before we can understand virtual machines or containers, we need to understand what they&apos;re
        virtualizing. At its core, every computer is built from four main components connected by a{" "}
        <TermDefinition term="system bus" definition="the highway that carries data between components" />.
      </p>

      <AnalogyCard
        concept="Think of a Computer as a Kitchen"
        analogy="The CPU is the chef — it does all the actual work. RAM is the counter space — fast to reach but limited and cleared after each shift. The disk is the pantry — huge storage but slower to access. The NIC is the delivery window — how food (data) arrives and leaves."
      />

      <div className="mt-8">
        <ArchitectureDiagram />
      </div>

      <div className="space-y-4 mb-8">
        <p className="text-text-secondary leading-relaxed">
          <TermDefinition term="x86" definition="the instruction set used by Intel and AMD processors in most servers and PCs" />{" "}
          is the architecture that most servers use. When we talk about virtualization later,
          we&apos;re almost always talking about virtualizing x86 hardware. Another common architecture is{" "}
          <TermDefinition term="ARM" definition="a power-efficient instruction set used in phones, tablets, and newer servers like AWS Graviton" />,
          which is becoming more popular in cloud servers.
        </p>
      </div>

      <InfoCard variant="tip" title="Why This Matters">
        Every concept in this course — VMs, containers, namespaces, networking — is about
        controlling how programs access these four components. Understanding the hardware
        makes everything else click.
      </InfoCard>
    </SectionWrapper>
  );
}
