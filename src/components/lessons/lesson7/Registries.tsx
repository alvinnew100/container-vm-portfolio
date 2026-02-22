"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import TerminalBlock from "@/components/story/TerminalBlock";
import ZineCallout from "@/components/story/ZineCallout";

export default function Registries() {
  return (
    <SectionWrapper id="sec-registries" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        OCI Image Spec and Registries
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        The <strong className="text-text-primary">OCI Image Specification</strong> standardizes how container images
        are built, stored, and distributed. An OCI image consists of a <em>manifest</em> (list of layers),
        a <em>config</em> (runtime settings), and <em>layer tarballs</em> (filesystem diffs).
      </p>

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
        <InfoCard variant="info" title="Image Size Optimization">
          Use Alpine-based images (5 MB base vs 77 MB Ubuntu). Use multi-stage builds to leave build tools
          out of the final image. Combine <code>RUN</code> commands to reduce layers. Remove package manager caches
          in the same layer they&apos;re created (<code>rm -rf /var/lib/apt/lists/*</code>).
        </InfoCard>
      </div>

      <div className="mt-4">
        <ZineCallout page="5, 12" topic="images as tarballs, container registries, image safety" />
      </div>
    </SectionWrapper>
  );
}
