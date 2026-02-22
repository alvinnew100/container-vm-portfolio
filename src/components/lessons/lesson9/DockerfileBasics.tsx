"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import CodeBlock from "@/components/story/CodeBlock";
import InfoCard from "@/components/story/InfoCard";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";
import RevealCard from "@/components/story/RevealCard";

const INSTRUCTIONS = [
  { cmd: "FROM", layer: "Base Image", color: "docker-violet" },
  { cmd: "RUN apt-get install", layer: "Dependencies", color: "docker-teal" },
  { cmd: "COPY package.json", layer: "Package manifest", color: "docker-blue" },
  { cmd: "RUN npm install", layer: "Node modules", color: "docker-blue" },
  { cmd: "COPY src/", layer: "Application code", color: "docker-blue" },
  { cmd: "CMD", layer: "Startup command (metadata)", color: "docker-amber" },
];

function LayerBuilderDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Each Instruction Adds a Layer
      </h4>
      <div className="max-w-sm mx-auto space-y-1">
        {INSTRUCTIONS.map((inst, i) => (
          <motion.div
            key={inst.cmd}
            initial={{ opacity: 0, x: -20, scaleX: 0.8 }}
            animate={isInView ? { opacity: 1, x: 0, scaleX: 1 } : {}}
            transition={{ delay: 0.15 * i, duration: 0.4 }}
            className={`bg-${inst.color}/10 border border-${inst.color}/20 rounded-lg px-4 py-2 flex items-center justify-between`}
          >
            <code className={`text-${inst.color} text-[10px] font-bold`}>{inst.cmd}</code>
            <span className="text-text-muted text-[10px]">{inst.layer}</span>
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="text-text-muted text-xs text-center mt-4"
      >
        Layers are cached. Change a line? Only that layer and layers above it rebuild.
      </motion.p>
    </div>
  );
}

export default function DockerfileBasics() {
  return (
    <>
    <SectionWrapper id="sec-dockerfile-basics" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Dockerfile Instructions
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        A Dockerfile is a text file containing instructions for building an image.
        Each instruction creates a layer in the final image (as we learned in Lesson 7).
      </p>

      <AnalogyCard
        concept="A Dockerfile Is a Recipe"
        analogy="Each instruction is a step in the recipe. FROM is choosing your base ingredients. RUN is cooking/mixing. COPY is adding ingredients from your pantry. CMD is the serving instructions. The result is a frozen meal (image) you can run anywhere."
      />

      <div className="mt-8">
        <LayerBuilderDiagram />
      </div>

      <div className="bg-story-card rounded-2xl border border-story-border card-shadow overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-story-surface">
                <th className="text-left px-4 py-3 text-text-primary font-semibold w-32">Instruction</th>
                <th className="text-left px-4 py-3 text-text-primary font-semibold">Purpose</th>
                <th className="text-left px-4 py-3 text-text-primary font-semibold">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-story-border">
              {[
                { cmd: "FROM", purpose: "Set base image", example: "FROM node:20-alpine" },
                { cmd: "RUN", purpose: "Execute command during build", example: "RUN npm install --production" },
                { cmd: "COPY", purpose: "Copy files from build context", example: "COPY package.json /app/" },
                { cmd: "WORKDIR", purpose: "Set working directory", example: "WORKDIR /app" },
                { cmd: "ENV", purpose: "Set environment variable", example: "ENV NODE_ENV=production" },
                { cmd: "EXPOSE", purpose: "Document container port (metadata)", example: "EXPOSE 3000" },
                { cmd: "CMD", purpose: "Default command (overridable)", example: 'CMD ["node", "server.js"]' },
                { cmd: "ENTRYPOINT", purpose: "Fixed command (args appended)", example: 'ENTRYPOINT ["python"]' },
              ].map((row) => (
                <tr key={row.cmd}>
                  <td className="px-4 py-2"><code className="text-docker-blue font-semibold">{row.cmd}</code></td>
                  <td className="px-4 py-2 text-text-secondary">{row.purpose}</td>
                  <td className="px-4 py-2"><code className="text-text-muted text-xs">{row.example}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h4 className="text-text-primary font-semibold text-sm mb-3">
        Example: Production Node.js Dockerfile
      </h4>
      <CodeBlock
        language="dockerfile"
        title="Dockerfile"
        code={`FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (layer caching!)
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy application source
COPY src/ ./src/

# Set non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose port and set default command
EXPOSE 3000
CMD ["node", "src/server.js"]`}
      />

      <div className="mt-6 space-y-4">
        <InfoCard variant="tip" title="CMD vs ENTRYPOINT">
          <code>CMD</code> provides default arguments that can be overridden at runtime
          (<code>docker run myimage /bin/sh</code> replaces CMD). <code>ENTRYPOINT</code> sets a fixed command —
          runtime arguments are <em>appended</em> to it.
        </InfoCard>

        <InfoCard variant="warning" title="Build Context and .dockerignore">
          When you run <code>docker build .</code>, the entire directory is sent to the daemon as the{" "}
          <TermDefinition term="build context" definition="all the files in the directory you specify — Docker packages them and sends them to the daemon, which is why large directories are slow" />.
          Use a <code>.dockerignore</code> file to exclude <code>node_modules/</code>, <code>.git/</code>,
          and <code>.env</code> to speed up builds and prevent secrets from leaking into images.
        </InfoCard>
      </div>
    </SectionWrapper>

      <RevealCard
        id="lesson9-cache-kc1"
        prompt="Imagine a Dockerfile with 6 layers. You edit the COPY instruction at Layer 4. Why can't Docker reuse the cached versions of Layers 5 and 6, even though you didn't touch them?"
        answer="Docker's layer cache works by hashing each instruction and its inputs. Each layer's hash depends on the previous layer's hash (like a blockchain). When Layer 4 changes, its hash changes, which means the input to Layer 5 is now different — so Layer 5's cache key no longer matches, even if the Layer 5 instruction itself is identical. The same cascading invalidation applies to Layer 6. This is why frequently changing instructions (like COPY src/) should be placed as late as possible in the Dockerfile — they invalidate fewer layers above them."
        hint="Think about how Docker caches work — changes cascade upward."
      />
    </>
  );
}
