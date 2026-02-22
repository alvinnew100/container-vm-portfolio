"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";
import InfoCard from "@/components/story/InfoCard";
import RevealCard from "@/components/story/RevealCard";

const LAYERS = [
  {
    label: "Applications",
    sublabel: "Your programs: browsers, databases, web servers",
    color: "docker-blue",
    ring: "Ring 3 — Userspace",
  },
  {
    label: "System Calls",
    sublabel: "The API between apps and the kernel (open, read, write, fork...)",
    color: "docker-teal",
    ring: "",
  },
  {
    label: "Kernel",
    sublabel: "Manages CPU, memory, devices, filesystems, networking",
    color: "docker-violet",
    ring: "Ring 0 — Full hardware access",
  },
  {
    label: "Hardware",
    sublabel: "CPU, RAM, disk, NIC — the physical components",
    color: "docker-amber",
    ring: "",
  },
];

function OsStackDiagram() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Operating System Stack
      </h4>

      <div className="space-y-0">
        {LAYERS.map((layer, i) => (
          <motion.div
            key={layer.label}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 * i, duration: 0.5 }}
            className="relative"
          >
            <div className={`bg-${layer.color}/5 border border-${layer.color}/20 p-4 ${
              i === 0 ? "rounded-t-xl" : i === LAYERS.length - 1 ? "rounded-b-xl" : ""
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-${layer.color} font-bold text-sm`}>{layer.label}</span>
                  <p className="text-text-secondary text-xs mt-0.5">{layer.sublabel}</p>
                </div>
                {layer.ring && (
                  <span className={`text-${layer.color} text-[10px] font-mono bg-${layer.color}/10 px-2 py-0.5 rounded hidden sm:inline`}>
                    {layer.ring}
                  </span>
                )}
              </div>
            </div>

            {/* Arrow between layers */}
            {i === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col items-center z-10"
              >
                <div className="text-[8px] font-mono text-docker-teal bg-story-card px-1 border border-docker-teal/20 rounded">
                  syscall
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="text-text-muted text-xs text-center mt-4"
      >
        Apps request resources via system calls &darr; &mdash; Kernel controls hardware and returns results &uarr;
      </motion.p>
    </div>
  );
}

export default function WhatIsAnOS() {
  return (
    <SectionWrapper id="sec-what-is-os" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        What Does an Operating System Do?
      </h3>

      <p className="text-text-secondary leading-relaxed mb-6">
        An{" "}
        <TermDefinition term="operating system (OS)" definition="software that manages hardware and provides services to programs — like Windows, macOS, or Linux" />{" "}
        sits between your applications and the hardware. Its job is to share the hardware fairly
        among all running programs and prevent them from interfering with each other.
      </p>

      <AnalogyCard
        concept="The OS Is a Restaurant Manager"
        analogy="The manager (OS) decides which chef (CPU) works on which order, prevents waiters from going into the kitchen unsupervised, and makes sure no single table hogs all the food. Without a manager, chaos."
      />

      <div className="mt-8">
        <OsStackDiagram />
      </div>

      <div className="space-y-4 mb-8">
        <p className="text-text-secondary leading-relaxed">
          The{" "}
          <TermDefinition term="kernel" definition="the core of the OS that runs with full hardware access — it's the most trusted code on the machine" />{" "}
          runs in{" "}
          <TermDefinition term="Ring 0" definition="the CPU's most privileged mode, where code can access any hardware resource directly" />.
          Your applications run in{" "}
          <TermDefinition term="Ring 3" definition="the CPU's least privileged mode — programs here cannot directly touch hardware" /> (also called{" "}
          <TermDefinition term="userspace" definition="the unprivileged area where normal programs run" />).
        </p>

        <p className="text-text-secondary leading-relaxed">
          When a program needs something from the hardware — reading a file, sending network data,
          allocating memory — it makes a{" "}
          <TermDefinition term="system call (syscall)" definition="a request from a program to the kernel, asking it to perform a privileged operation" />.
          The CPU switches from Ring 3 to Ring 0, the kernel performs the operation, and control
          returns to the program. This boundary is critical to security: it prevents programs from
          bypassing the OS.
        </p>

        <p className="text-text-secondary leading-relaxed">
          <TermDefinition term="Privileged instructions" definition="CPU operations that can only run in Ring 0, like modifying page tables or accessing I/O ports" />{" "}
          are why virtualization is tricky. When a VM&apos;s guest OS tries to execute a privileged
          instruction, the CPU must intercept it — we&apos;ll see exactly how in Lesson 3.
        </p>
      </div>

      <InfoCard variant="info" title="Key Concept for Later">
        Containers and VMs both manipulate the boundary between userspace and kernel.
        VMs create a <em>fake kernel</em> for each guest. Containers share the <em>real kernel</em>{" "}
        but use special features to isolate processes. Understanding Ring 0 vs Ring 3 is
        the foundation for understanding both.
      </InfoCard>

      <RevealCard
        id="lesson0-os-kc1"
        prompt="If the kernel ran in Ring 3 alongside user applications, what specific things would break? Why is Ring 0 necessary for the kernel's job?"
        answer="If the kernel ran in Ring 3, it could not access hardware directly — it could not manage page tables, handle interrupts, or configure I/O ports. These operations require privileged instructions that only Ring 0 can execute. Without Ring 0 access, the kernel could not enforce memory protection between processes, could not context-switch between programs, and could not prevent a rogue application from taking over the entire machine. The ring separation is the hardware foundation that makes multitasking and security possible."
        hint="The kernel needs unrestricted access to hardware — which ring provides that?"
      />
    </SectionWrapper>
  );
}
