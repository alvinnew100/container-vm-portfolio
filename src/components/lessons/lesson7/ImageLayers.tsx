"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";
import TerminalBlock from "@/components/story/TerminalBlock";
import ZineCallout from "@/components/story/ZineCallout";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function LayerStackDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const layers = [
    { label: "Container Writable Layer", size: "~0 MB", color: "bg-docker-amber", note: "ephemeral — lost on removal" },
    { label: "COPY app.js /app/", size: "2 KB", color: "bg-docker-blue" },
    { label: "RUN npm install", size: "45 MB", color: "bg-docker-blue" },
    { label: "COPY package.json /app/", size: "1 KB", color: "bg-docker-blue" },
    { label: "RUN apt-get install -y nodejs", size: "60 MB", color: "bg-docker-teal" },
    { label: "FROM ubuntu:22.04", size: "77 MB", color: "bg-docker-violet", note: "base image" },
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow mb-8">
      <h4 className="text-text-primary font-semibold text-sm mb-4 text-center">Image Layer Stack</h4>
      <div className="max-w-md mx-auto space-y-1">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.label}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
            className={`${layer.color}/15 border border-${layer.color.replace("bg-", "")}/30 rounded-lg px-4 py-2 flex items-center justify-between`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className={`text-[10px] font-mono ${layer.color.replace("bg-", "text-")}`}>
                {i === 0 ? "R/W" : `L${layers.length - i}`}
              </span>
              <span className="text-text-secondary text-xs truncate">{layer.label}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {layer.note && (
                <span className="text-text-muted text-[10px] italic hidden sm:inline">{layer.note}</span>
              )}
              <span className="text-text-muted text-[10px] font-mono">{layer.size}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center gap-6 mt-4 text-[10px] text-text-muted">
        <span>&#9650; Top: Writable (container)</span>
        <span>&#9660; Bottom: Read-only (image)</span>
      </div>
    </div>
  );
}

export default function ImageLayers() {
  return (
    <SectionWrapper id="sec-layers" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Container Images — Layers and Union Filesystems
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        A container image is not a single monolithic file — it&apos;s a <strong className="text-text-primary">stack of
        read-only layers</strong>. Each instruction in a Dockerfile (<code>FROM</code>, <code>RUN</code>,
        <code> COPY</code>) creates a new layer. A{" "}
        <TermDefinition term="union filesystem" definition="a filesystem that merges multiple directories into a single view — files in upper layers override files in lower layers with the same name" />{" "}
        (like OverlayFS) merges all layers into a single coherent view.
      </p>

      <AnalogyCard
        concept="Layers Are Like Transparent Sheets"
        analogy="Imagine stacking transparent overhead projector sheets. The bottom sheet has the base OS. Each sheet above adds more — libraries, dependencies, your app code. When you look down through the stack, you see everything combined. If two sheets have the same file, the top one wins."
      />

      <div className="mt-8">
        <LayerStackDiagram />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
          <h4 className="text-docker-blue font-semibold text-sm mb-2">Layer Sharing</h4>
          <p className="text-text-secondary text-sm leading-relaxed">
            If 10 containers use the same <code>ubuntu:22.04</code> base image, the base layer is stored only
            once on disk and shared by all 10. Only the unique upper layers are duplicated. Each layer is
            identified by a{" "}
            <TermDefinition term="sha256 hash" definition="a cryptographic fingerprint — a unique string computed from the layer's contents, used to verify integrity" />.
          </p>
        </div>
        <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
          <h4 className="text-docker-teal font-semibold text-sm mb-2">Copy-on-Write</h4>
          <p className="text-text-secondary text-sm leading-relaxed">
            When a container modifies a file from a lower layer, OverlayFS copies that file to the container&apos;s
            writable layer first (copy-up), then applies the change. The original layer is never modified.
            Layers are stored as{" "}
            <TermDefinition term="tarballs" definition="compressed archive files (.tar.gz) — each layer is packed as a tarball for efficient storage and transfer" />.
          </p>
        </div>
      </div>

      <h4 className="text-text-primary font-semibold text-sm mb-3 mt-8">
        How OverlayFS Works Under the Hood
      </h4>
      <p className="text-text-secondary text-sm leading-relaxed mb-4">
        A layer is literally a <strong className="text-text-primary">directory</strong> on disk. The{" "}
        <code>mount -t overlay</code> command combines multiple directories into a single merged view
        using 4 parameters:
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-story-card rounded-xl p-4 border border-story-border card-shadow">
          <code className="text-docker-blue text-xs font-bold">lowerdir</code>
          <p className="text-text-secondary text-xs mt-1">The image layers (read-only). Multiple directories separated by colons.</p>
        </div>
        <div className="bg-story-card rounded-xl p-4 border border-story-border card-shadow">
          <code className="text-docker-amber text-xs font-bold">upperdir</code>
          <p className="text-text-secondary text-xs mt-1">Where all writes go. When you create, change, or delete a file, it&apos;s recorded here.</p>
        </div>
        <div className="bg-story-card rounded-xl p-4 border border-story-border card-shadow">
          <code className="text-docker-violet text-xs font-bold">workdir</code>
          <p className="text-text-secondary text-xs mt-1">Empty directory for OverlayFS internal use (atomic operations).</p>
        </div>
        <div className="bg-story-card rounded-xl p-4 border border-story-border card-shadow">
          <code className="text-docker-teal text-xs font-bold">merged</code>
          <p className="text-text-secondary text-xs mt-1">The final merged result — this is what the container sees as its filesystem.</p>
        </div>
      </div>

      <TerminalBlock
        title="overlay filesystem example"
        lines={[
          "# Create an overlay filesystem — just like Docker does",
          "$ mount -t overlay overlay -o \\",
          "    lowerdir=/lower,upperdir=/upper,workdir=/work \\",
          "    /merged",
          "",
          "# The lower layer has: dog.txt, bird.txt",
          "$ ls /lower",
          "dog.txt  bird.txt",
          "",
          "# The upper layer has: cat.txt, dog.txt (modified)",
          "$ ls /upper",
          "cat.txt  dog.txt",
          "",
          "# The merged view combines both — upper wins for conflicts",
          "$ ls /merged",
          "cat.txt  dog.txt  bird.txt",
          "# dog.txt here is the version from /upper, not /lower!",
        ]}
      />

      <div className="mt-6">
        <InfoCard variant="tip" title="Layer Caching Optimization">
          Docker caches layers. If you change <code>app.js</code>, only layers after <code>COPY app.js</code> are
          rebuilt. That&apos;s why you should <code>COPY package.json</code> and <code>RUN npm install</code> before
          copying your source code — the dependency layer gets cached and doesn&apos;t rebuild on every code change.
        </InfoCard>
      </div>

      <div className="mt-4">
        <ZineCallout page="10-11" topic="layers as directories, overlay filesystems, mount -t overlay" />
      </div>
    </SectionWrapper>
  );
}
