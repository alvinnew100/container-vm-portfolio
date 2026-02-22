"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function ArchFlowDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const steps = [
    { label: "docker CLI", desc: "User interface", color: "docker-blue" },
    { label: "Docker Daemon", desc: "dockerd — API server", color: "docker-teal" },
    { label: "containerd", desc: "Container lifecycle", color: "docker-violet" },
    { label: "runc", desc: "OCI runtime", color: "docker-amber" },
    { label: "Linux Kernel", desc: "namespaces + cgroups", color: "docker-red" },
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow mb-8">
      <h4 className="text-text-primary font-semibold text-sm mb-6 text-center">
        Docker Architecture — From CLI to Kernel
      </h4>
      <div className="flex flex-col items-center gap-2 max-w-sm mx-auto">
        {steps.map((step, i) => (
          <div key={step.label} className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 * i, duration: 0.4 }}
              className={`bg-${step.color}/10 border border-${step.color}/30 rounded-lg px-4 py-3 text-center`}
            >
              <div className={`text-${step.color} font-semibold text-sm`}>{step.label}</div>
              <div className="text-text-muted text-[10px]">{step.desc}</div>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.15 * i + 0.1, duration: 0.3 }}
                className="flex justify-center py-1"
              >
                <svg className="w-4 h-4 text-story-border" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 14l-5-5h10l-5 5z" />
                </svg>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DockerArch() {
  return (
    <SectionWrapper id="sec-docker-arch" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Docker Architecture
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        When you type <code>docker run nginx</code>, a chain of components works together to create and
        run the container. Understanding this chain helps you debug issues and choose the right tools.
      </p>

      <ArchFlowDiagram />

      <div className="space-y-4 mb-8">
        {[
          {
            title: "Docker CLI",
            desc: "The command-line client that users interact with. Sends REST API calls to the Docker daemon. Can also talk to remote daemons via DOCKER_HOST.",
            color: "docker-blue",
          },
          {
            title: "Docker Daemon (dockerd)",
            desc: "The main service that manages Docker objects (images, containers, networks, volumes). Exposes the Docker API on a Unix socket (/var/run/docker.sock) or TCP port. Delegates container creation to containerd.",
            color: "docker-teal",
          },
          {
            title: "containerd",
            desc: "An industry-standard container runtime that manages the complete container lifecycle: image pull/push, storage, container execution, and networking. Used by Docker but also by Kubernetes directly.",
            color: "docker-violet",
          },
          {
            title: "runc",
            desc: "The OCI-compliant low-level runtime that actually creates containers. It sets up namespaces, cgroups, seccomp filters, and capabilities, then exec's the container's entrypoint process. After setup, runc exits — the container process is reparented to containerd-shim.",
            color: "docker-amber",
          },
        ].map((component) => (
          <div key={component.title} className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
            <h4 className={`text-${component.color} font-semibold text-sm mb-1`}>{component.title}</h4>
            <p className="text-text-secondary text-sm leading-relaxed">{component.desc}</p>
          </div>
        ))}
      </div>

      <InfoCard variant="info" title="What happens during docker run nginx?">
        1. CLI sends &ldquo;create container&rdquo; to dockerd via REST API. 2. dockerd checks if <code>nginx</code> image
        exists locally; if not, pulls from Docker Hub. 3. dockerd tells containerd to create and start the container.
        4. containerd creates a containerd-shim process and calls runc. 5. runc sets up namespaces, cgroups, and rootfs,
        then exec&apos;s the nginx process. 6. runc exits; shim becomes the container&apos;s parent process.
      </InfoCard>
    </SectionWrapper>
  );
}
