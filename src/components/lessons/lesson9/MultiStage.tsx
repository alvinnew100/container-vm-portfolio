"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import CodeBlock from "@/components/story/CodeBlock";
import InfoCard from "@/components/story/InfoCard";
import TermDefinition from "@/components/story/TermDefinition";
import KnowledgeCheck from "@/components/story/KnowledgeCheck";

function SizeComparisonBars() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Image Size: Before vs After Multi-Stage
      </h4>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-docker-amber font-semibold text-xs">Single-stage (Go + tools)</span>
            <span className="text-text-muted text-[10px]">~800 MB</span>
          </div>
          <div className="h-5 bg-story-surface rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "100%" } : {}}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="h-full bg-docker-amber/50 rounded-full"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-docker-teal font-semibold text-xs">Multi-stage (binary only)</span>
            <span className="text-text-muted text-[10px]">~12 MB</span>
          </div>
          <div className="h-5 bg-story-surface rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "1.5%" } : {}}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="h-full bg-docker-teal/70 rounded-full min-w-[12px]"
            />
          </div>
        </div>
      </div>
      <p className="text-text-muted text-xs text-center mt-4">98.5% size reduction — only the compiled binary ships</p>
    </div>
  );
}

function StageFlowDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Multi-Stage Flow
      </h4>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-docker-amber/10 border border-docker-amber/30 rounded-xl p-4 text-center"
        >
          <div className="text-docker-amber font-bold text-xs mb-1">Stage 1: Build</div>
          <div className="text-text-muted text-[9px] space-y-0.5">
            <div>Go compiler</div>
            <div>Source code</div>
            <div>Dependencies</div>
            <div className="text-docker-teal font-bold pt-1">compiled binary</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="text-center"
        >
          <div className="text-docker-teal text-sm font-mono">&rarr;</div>
          <div className="text-[8px] text-text-muted">COPY --from=builder</div>
          <div className="text-[8px] text-text-muted">(only the binary)</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="bg-docker-teal/10 border border-docker-teal/30 rounded-xl p-4 text-center"
        >
          <div className="text-docker-teal font-bold text-xs mb-1">Stage 2: Runtime</div>
          <div className="text-text-muted text-[9px] space-y-0.5">
            <div>Alpine (5 MB)</div>
            <div className="text-docker-teal font-bold">compiled binary</div>
            <div>ca-certificates</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function MultiStage() {
  return (
    <>
    <SectionWrapper id="sec-multistage" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Multi-Stage Builds
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        Multi-stage builds let you use multiple <code>FROM</code> statements in a single Dockerfile.
        You can build your application in one stage (with all build tools) and copy only the compiled output
        to a minimal final stage. This dramatically reduces final image size.
      </p>

      <SizeComparisonBars />
      <StageFlowDiagram />

      <h4 className="text-text-primary font-semibold text-sm mb-3">
        Example: Go Application with Multi-Stage Build
      </h4>
      <CodeBlock
        language="dockerfile"
        title="Dockerfile (multi-stage)"
        code={`# ── Stage 1: Build ──
FROM golang:1.22-alpine AS builder

WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server ./cmd/server

# ── Stage 2: Runtime ──
FROM alpine:3.19

# Add ca-certificates for HTTPS and a non-root user
RUN apk --no-cache add ca-certificates \\
    && adduser -D -g '' appuser

WORKDIR /app
COPY --from=builder /app/server .

USER appuser
EXPOSE 8080
ENTRYPOINT ["./server"]`}
      />

      <div className="mt-6">
        <InfoCard variant="tip" title="Key Terms">
          A{" "}
          <TermDefinition term="static binary" definition="a compiled program that includes all its dependencies — it can run on any Linux system without installing libraries" />{" "}
          is ideal for containers.{" "}
          <TermDefinition term="Distroless" definition="Google's ultra-minimal container images that contain only the app and its runtime — no shell, no package manager, no OS utilities" />{" "}
          images take this even further, reducing the attack surface to the absolute minimum.
        </InfoCard>
      </div>
    </SectionWrapper>

      <KnowledgeCheck
        id="lesson9-optimize-kc1"
        question="Why should you COPY package.json before COPY src/ in a Dockerfile?"
        options={["To cache npm install when only source code changes", "Because package.json is smaller"]}
        correctIndex={0}
        explanation="If you COPY everything at once, changing any source file invalidates the npm install cache. By copying package.json first and running npm install, that layer is cached as long as dependencies don't change — only the source copy layer needs rebuilding."
        hint="Docker rebuilds from the first changed layer upward."
      />
    </>
  );
}
