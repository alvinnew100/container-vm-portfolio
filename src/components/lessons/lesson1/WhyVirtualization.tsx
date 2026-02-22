"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";
import RevealCard from "@/components/story/RevealCard";

function AnimatedTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const events = [
    {
      year: "1960s",
      title: "IBM Mainframe Partitioning",
      desc: "IBM CP-40 and CP-67 introduced time-sharing — multiple users on one mainframe with isolated virtual machines. This was the birth of virtualization.",
    },
    {
      year: "1998",
      title: "VMware Founded",
      desc: "VMware brought virtualization to commodity x86 hardware using binary translation (rewriting problematic CPU instructions on the fly), letting enterprises consolidate servers.",
    },
    {
      year: "2003",
      title: "Xen Hypervisor",
      desc: "The open-source Xen hypervisor introduced paravirtualization (modifying the guest OS to cooperate with the hypervisor for better performance). It powered early Amazon EC2.",
    },
    {
      year: "2007",
      title: "KVM in Linux Kernel",
      desc: "Kernel-based Virtual Machine (KVM) turned Linux itself into a Type 1 hypervisor, leveraging hardware-assisted virtualization (VT-x/AMD-V) — see Lesson 3 for details.",
    },
    {
      year: "2008",
      title: "Linux Containers (LXC)",
      desc: "LXC combined namespaces (what a process can see) and cgroups (how much it can use) to create lightweight containers — process isolation without a guest OS.",
    },
    {
      year: "2013",
      title: "Docker Launches",
      desc: "Docker made containers accessible with a simple CLI, Dockerfiles, and a public image registry. Container adoption exploded.",
    },
    {
      year: "2015",
      title: "OCI & Kubernetes 1.0",
      desc: "The Open Container Initiative (OCI) standardized container formats. Kubernetes 1.0 launched, becoming the standard container orchestrator.",
    },
  ];

  return (
    <div ref={ref} className="relative">
      {/* Timeline line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute left-4 top-0 bottom-0 w-0.5 bg-docker-blue/20 origin-top"
      />

      {events.map((event, i) => (
        <motion.div
          key={event.year}
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.15 * i, duration: 0.5 }}
          className="relative pl-12 pb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.15 * i + 0.1, duration: 0.3 }}
            className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-docker-blue border-2 border-story-bg"
          />
          <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-docker-blue font-mono text-xs font-bold bg-docker-blue/10 px-2 py-0.5 rounded">
                {event.year}
              </span>
              <h4 className="text-text-primary font-semibold text-sm">
                {event.title}
              </h4>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              {event.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function WhyVirtualization() {
  const problemRef = useRef<HTMLDivElement>(null);
  const problemInView = useInView(problemRef, { once: true, margin: "-50px" });

  return (
    <>
      {/* Section: Why Isolation */}
      <SectionWrapper id="sec-why-isolation" className="max-w-4xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-text-primary mb-6">
          The Problem: One Server, Many Apps
        </h3>
        <p className="text-text-secondary leading-relaxed mb-6">
          In the early days of computing, each application ran directly on{" "}
          <TermDefinition term="bare metal" definition="a physical server with no virtualization layer — the OS runs directly on the hardware" /> &mdash;
          a physical{" "}
          <TermDefinition term="server" definition="a computer designed to run 24/7 and serve requests from other computers, usually stored in a data center" />{" "}
          dedicated to a single workload. This meant most servers sat idle at 5&ndash;15% utilization while
          organizations paid for 100% of the hardware. Worse, applications could interfere with each other: a memory leak in
          one app could crash the entire server, and a security vulnerability in one service exposed everything.
        </p>

        <AnalogyCard
          concept="Bare Metal = Owning a Whole Bus"
          analogy="Running one app on a bare-metal server is like owning an entire city bus and riding it alone. You're paying for 50 seats but using 1. Virtualization lets you share the bus — VMs give each passenger their own sealed compartment, containers just give them assigned seats."
        />

        <div ref={problemRef} className="grid sm:grid-cols-3 gap-4 mt-8 mb-8">
          {[
            {
              title: "Resource Waste",
              desc: "Most bare-metal servers use only 5-15% of their capacity. The rest is idle.",
              color: "docker-amber",
            },
            {
              title: "No Isolation",
              desc: "A bug in one application can crash every other app on the same machine.",
              color: "docker-red",
            },
            {
              title: "Slow Provisioning",
              desc: "Deploying a new server means purchasing hardware, racking, cabling, and installing an OS.",
              color: "docker-violet",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={problemInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 * i, duration: 0.4 }}
              className="bg-story-card rounded-xl p-5 border border-story-border card-shadow"
            >
              <div className={`text-${item.color} font-semibold text-sm mb-2`}>
                {item.title}
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <InfoCard variant="info" title="The Three Pillars of Virtualization">
          <strong>Isolation</strong> keeps workloads from interfering with each other. <strong>Security</strong> ensures
          a compromised app cannot access other workloads. <strong>Efficiency</strong> lets you run many workloads on
          fewer physical machines, driving utilization from ~10% to 60-80%.
        </InfoCard>
      </SectionWrapper>

      {/* Section: History */}
      <SectionWrapper id="sec-history" className="max-w-4xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-text-primary mb-6">
          A Brief History: Mainframes to Containers
        </h3>

        <p className="text-text-secondary leading-relaxed mb-6">
          <TermDefinition term="Time-sharing" definition="allowing multiple users or programs to take turns using the CPU so fast that each one feels like it has the machine to itself" />{" "}
          on mainframes in the 1960s was the first form of virtualization. Here&apos;s how the technology evolved:
        </p>

        <AnimatedTimeline />

        <InfoCard variant="tip" title="Key Takeaway">
          Virtualization has evolved from mainframe time-sharing to VMs on commodity hardware to
          lightweight containers. Each step traded some isolation for better efficiency and developer
          experience.
        </InfoCard>

        <RevealCard
          id="lesson1-timeline-drag1"
          prompt="If KVM (2007) had been available in the 1990s, would VMware (founded 1998) have needed to invent binary translation? What problem did each solve, and why did the timeline unfold the way it did?"
          answer="VMware invented binary translation because x86 CPUs in the 1990s lacked hardware virtualization support. Certain sensitive x86 instructions silently failed instead of trapping when executed outside Ring 0, making the classic trap-and-emulate approach impossible. Binary translation rewrote these problematic instructions on the fly. KVM, on the other hand, relies on Intel VT-x (2005) and AMD-V (2006) — hardware extensions that added a new CPU mode specifically for virtualization. If VT-x had existed in the 1990s, there would have been no need for binary translation because the CPU itself could trap all sensitive instructions. The timeline reflects hardware limitations driving software innovation: mainframe partitioning (1960s) worked because mainframes were designed for it, x86 was not, so VMware bridged the gap with software, and then Intel/AMD closed it with hardware, enabling KVM's simpler approach."
          hint="The timeline on this page shows you the exact years for each milestone."
        />
      </SectionWrapper>
    </>
  );
}
