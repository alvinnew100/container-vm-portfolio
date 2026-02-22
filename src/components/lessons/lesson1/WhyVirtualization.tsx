"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";

export default function WhyVirtualization() {
  return (
    <>
      {/* Section: Why Isolation */}
      <SectionWrapper id="sec-why-isolation" className="max-w-4xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-text-primary mb-6">
          The Problem: One Server, Many Apps
        </h3>
        <p className="text-text-secondary leading-relaxed mb-6">
          In the early days of computing, each application ran directly on <strong className="text-text-primary">bare metal</strong> &mdash;
          a physical server dedicated to a single workload. This meant most servers sat idle at 5&ndash;15% utilization while
          organizations paid for 100% of the hardware. Worse, applications could interfere with each other: a memory leak in
          one app could crash the entire server, and a security vulnerability in one service exposed everything.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
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
          ].map((item) => (
            <div
              key={item.title}
              className="bg-story-card rounded-xl p-5 border border-story-border card-shadow"
            >
              <div className={`text-${item.color} font-semibold text-sm mb-2`}>
                {item.title}
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
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

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-docker-blue/20" />

          {[
            {
              year: "1960s",
              title: "IBM Mainframe Partitioning",
              desc: "IBM CP-40 and CP-67 introduced time-sharing — multiple users on one mainframe with isolated virtual machines. This was the birth of virtualization.",
            },
            {
              year: "1998",
              title: "VMware Founded",
              desc: "VMware brought virtualization to commodity x86 hardware using binary translation, letting enterprises consolidate servers onto fewer physical machines.",
            },
            {
              year: "2003",
              title: "Xen Hypervisor",
              desc: "The open-source Xen hypervisor introduced paravirtualization, offering near-native performance. It powered early Amazon EC2.",
            },
            {
              year: "2007",
              title: "KVM in Linux Kernel",
              desc: "Kernel-based Virtual Machine (KVM) turned Linux itself into a Type 1 hypervisor, leveraging hardware-assisted virtualization (VT-x/AMD-V).",
            },
            {
              year: "2008",
              title: "Linux Containers (LXC)",
              desc: "LXC combined namespaces and cgroups to create lightweight containers — process isolation without a guest OS.",
            },
            {
              year: "2013",
              title: "Docker Launches",
              desc: "Docker made containers accessible with a simple CLI, Dockerfiles, and a public image registry. Container adoption exploded.",
            },
            {
              year: "2015",
              title: "OCI & Kubernetes 1.0",
              desc: "The Open Container Initiative standardized container formats. Kubernetes 1.0 launched, becoming the de facto container orchestrator.",
            },
          ].map((event, i) => (
            <div key={event.year} className="relative pl-12 pb-8">
              <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-docker-blue border-2 border-story-bg" />
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
            </div>
          ))}
        </div>

        <InfoCard variant="tip" title="Key Takeaway">
          Virtualization has evolved from mainframe time-sharing to VMs on commodity hardware to
          lightweight containers. Each step traded some isolation for better efficiency and developer
          experience.
        </InfoCard>
      </SectionWrapper>
    </>
  );
}
