"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import TermDefinition from "@/components/story/TermDefinition";
import RevealCard from "@/components/story/RevealCard";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

function ArchFlowDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    { label: "docker CLI", desc: "User interface", color: "docker-blue" },
    { label: "Docker Daemon", desc: "dockerd — API server", color: "docker-teal" },
    { label: "containerd", desc: "Container lifecycle", color: "docker-violet" },
    { label: "runc", desc: "OCI runtime", color: "docker-amber" },
    { label: "Linux Kernel", desc: "namespaces + cgroups", color: "docker-red" },
  ];

  const walkthrough = [
    "CLI sends 'create container' to dockerd via REST API",
    "dockerd checks image locally; pulls from Hub if needed, tells containerd to create container",
    "containerd creates a shim process, calls runc to set up the container",
    "runc configures namespaces, cgroups, rootfs, then exec's the container process and exits",
    "Kernel enforces isolation (namespaces) and resource limits (cgroups)",
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow mb-8">
      <h4 className="text-text-primary font-semibold text-sm mb-2 text-center">
        Docker Architecture — From CLI to Kernel
      </h4>
      <p className="text-text-muted text-xs text-center mb-6">
        Click each component to trace the <code>docker run nginx</code> flow
      </p>
      <div className="flex flex-col items-center gap-2 max-w-sm mx-auto">
        {steps.map((step, i) => (
          <div key={step.label} className="w-full">
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 * i, duration: 0.4 }}
              onClick={() => setActiveStep(activeStep === i ? null : i)}
              className={`w-full bg-${step.color}/10 border border-${step.color}/30 rounded-lg px-4 py-3 text-center transition-all ${
                activeStep === i ? `ring-2 ring-${step.color}/50` : ""
              }`}
            >
              <div className={`text-${step.color} font-semibold text-sm`}>{step.label}</div>
              <div className="text-text-muted text-[10px]">{step.desc}</div>
              {activeStep === i && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-text-secondary text-xs mt-2 leading-relaxed"
                >
                  {walkthrough[i]}
                </motion.p>
              )}
            </motion.button>
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
    <>
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
            desc: "The command-line client that users interact with. Sends requests via a REST API to the Docker daemon.",
            term: "REST API",
            termDef: "a standard way for programs to communicate over HTTP — the CLI sends HTTP requests to dockerd, which responds with JSON data",
            color: "docker-blue",
          },
          {
            title: "Docker Daemon (dockerd)",
            desc: "The main service that manages Docker objects (images, containers, networks, volumes). Exposes the Docker API on a Unix socket or TCP port. Delegates container creation to containerd.",
            term: "Unix socket",
            termDef: "a file-based communication endpoint (/var/run/docker.sock) — programs on the same machine can talk through it like a local phone line",
            color: "docker-teal",
          },
          {
            title: "containerd",
            desc: "An industry-standard container runtime that manages the complete container lifecycle: image pull/push, storage, container execution, and networking. Used by Docker but also by Kubernetes directly.",
            term: "daemon",
            termDef: "a program that runs continuously in the background — both dockerd and containerd are daemons",
            color: "docker-violet",
          },
          {
            title: "runc",
            desc: "The OCI-compliant low-level runtime that actually creates containers. It sets up namespaces, cgroups, seccomp filters, and capabilities, then exec's the container's entrypoint process. After setup, runc exits — the container process is reparented to a containerd-shim.",
            term: "containerd-shim",
            termDef: "a small process that becomes the container's parent after runc exits — it keeps STDIO open and reports the container's exit status",
            color: "docker-amber",
          },
        ].map((component) => (
          <div key={component.title} className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
            <h4 className={`text-${component.color} font-semibold text-sm mb-1`}>{component.title}</h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              {component.desc}
            </p>
            <p className="text-text-muted text-xs mt-2">
              <TermDefinition term={component.term} definition={component.termDef} />
            </p>
          </div>
        ))}
      </div>

      <InfoCard variant="info" title="The Complete docker run nginx Journey">
        1. CLI sends &ldquo;create container&rdquo; to dockerd via REST API. 2. dockerd checks if <code>nginx</code> image
        exists locally; if not, pulls from Docker Hub. 3. dockerd tells containerd to create and start the container.
        4. containerd creates a containerd-shim process and calls runc. 5. runc sets up namespaces, cgroups, and rootfs,
        then exec&apos;s the nginx process. 6. runc exits; shim becomes the container&apos;s parent process.
      </InfoCard>
    </SectionWrapper>

      <RevealCard
        id="lesson8-arch-fill1"
        prompt="Why does Docker need both dockerd and containerd as separate daemons? What would go wrong if Docker was a single monolithic process from CLI to kernel?"
        answer="The separation exists for resilience and modularity. dockerd (the Docker daemon) handles the high-level API — image management, networking, volumes, and user-facing features. containerd handles the low-level container lifecycle — creating, starting, stopping containers via runc and the kernel. If Docker were a single process, restarting it to apply updates would kill every running container. With the split architecture, you can restart dockerd without affecting running containers because containerd (and its shim processes) keep containers alive independently. This separation also enables Kubernetes to use containerd directly, bypassing dockerd entirely — eliminating an unnecessary middle layer. The full stack is: docker CLI sends REST API calls to dockerd, which delegates to containerd, which calls runc to configure namespaces and cgroups via the kernel."
        hint="Think about what happens to running containers when you need to update the Docker daemon."
      />
    </>
  );
}
