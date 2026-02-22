"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";
import TerminalBlock from "@/components/story/TerminalBlock";
import ZineCallout from "@/components/story/ZineCallout";

function DockerPullFlowDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const steps = [
    { label: "docker pull", desc: "CLI sends request", color: "docker-blue" },
    { label: "Registry API", desc: "Resolves tag to manifest", color: "docker-teal" },
    { label: "Download Layers", desc: "Each layer in parallel", color: "docker-violet" },
    { label: "Local Storage", desc: "Stored in /var/lib/docker", color: "docker-amber" },
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        docker pull Flow
      </h4>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 * i, duration: 0.4 }}
              className={`bg-${step.color}/10 border border-${step.color}/30 rounded-lg px-3 py-2 text-center min-w-[100px]`}
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

export default function Registries() {
  return (
    <SectionWrapper id="sec-registries" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        OCI Image Spec and Registries
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        The{" "}
        <TermDefinition term="OCI" definition="Open Container Initiative — an industry standard that defines how container images and runtimes should work, so tools from different vendors are compatible" />{" "}
        Image Specification standardizes how container images are built, stored, and distributed. An OCI image
        consists of a <em>manifest</em> (list of layers), a <em>config</em> (runtime settings), and{" "}
        <em>layer tarballs</em> (filesystem diffs).
      </p>

      <AnalogyCard
        concept="A Registry Is Like an App Store for Servers"
        analogy="Just like you download apps from the App Store or Google Play, you download container images from a registry. Docker Hub is the biggest public 'app store.' Companies also run private registries — like an internal company app store that only employees can access."
      />

      <div className="mt-8">
        <DockerPullFlowDiagram />
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            name: "Docker Hub",
            desc: "The default public registry. Hosts millions of images including official images (nginx, postgres, node).",
            color: "docker-blue",
          },
          {
            name: "GitHub Container Registry",
            desc: "ghcr.io — integrated with GitHub Actions. Free for public images.",
            color: "docker-teal",
          },
          {
            name: "Private Registries",
            desc: "AWS ECR, Google Artifact Registry, Azure ACR, or self-hosted Harbor for private images.",
            color: "docker-violet",
          },
        ].map((reg) => (
          <div key={reg.name} className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
            <h4 className={`text-${reg.color} font-semibold text-sm mb-2`}>{reg.name}</h4>
            <p className="text-text-secondary text-sm leading-relaxed">{reg.desc}</p>
          </div>
        ))}
      </div>

      <TerminalBlock
        title="working with images"
        lines={[
          "# Pull an image from Docker Hub",
          "$ docker pull nginx:1.25-alpine",
          "1.25-alpine: Pulling from library/nginx",
          "7264a8db6415: Pull complete",
          "518c62654cf0: Pull complete",
          "d8c801465dfa: Pull complete",
          "Digest: sha256:a59278...",
          "Status: Downloaded newer image for nginx:1.25-alpine",
          "",
          "# Inspect image layers",
          "$ docker image inspect nginx:1.25-alpine --format '{{.RootFS.Layers}}'",
          "[sha256:7264a8... sha256:518c62... sha256:d8c801...]",
          "",
          "# Check image size",
          "$ docker images nginx:1.25-alpine",
          "REPOSITORY   TAG           IMAGE ID       CREATED       SIZE",
          "nginx        1.25-alpine   a8758716bb6a   2 weeks ago   41.1MB",
        ]}
      />

      <div className="mt-6">
        <InfoCard variant="warning" title="Be Careful Where Your Images Come From">
          Registries let anyone publish images. A malicious image could mine cryptocurrency or steal
          data from your server. Always use <strong>official images</strong> or images from trusted publishers.
          Scan images for vulnerabilities with <code>docker scout</code> or Trivy before deploying to production.
        </InfoCard>
      </div>

      <div className="mt-4">
        <ZineCallout page="5, 12" topic="images as tarballs, container registries, image safety" />
      </div>
    </SectionWrapper>
  );
}
