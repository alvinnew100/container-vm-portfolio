"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import CodeBlock from "@/components/story/CodeBlock";
import InfoCard from "@/components/story/InfoCard";

export default function MultiStage() {
  return (
    <SectionWrapper id="sec-multistage" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Multi-Stage Builds
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        Multi-stage builds let you use multiple <code>FROM</code> statements in a single Dockerfile.
        You can build your application in one stage (with all build tools) and copy only the compiled output
        to a minimal final stage. This dramatically reduces final image size.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-docker-amber/5 rounded-xl p-4 border border-docker-amber/20">
          <h4 className="text-docker-amber font-semibold text-sm mb-1">Without Multi-Stage</h4>
          <p className="text-text-secondary text-sm">Go app image: ~800 MB</p>
          <p className="text-text-muted text-xs mt-1">Includes Go compiler, build tools, source code</p>
        </div>
        <div className="bg-docker-teal/5 rounded-xl p-4 border border-docker-teal/20">
          <h4 className="text-docker-teal font-semibold text-sm mb-1">With Multi-Stage</h4>
          <p className="text-text-secondary text-sm">Go app image: ~12 MB</p>
          <p className="text-text-muted text-xs mt-1">Only contains the static binary on scratch/alpine</p>
        </div>
      </div>

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
        <h4 className="text-text-primary font-semibold text-sm mb-3">
          Example: React App with Multi-Stage Build
        </h4>
        <CodeBlock
          language="dockerfile"
          title="Dockerfile (React + nginx)"
          code={`# ── Stage 1: Build React app ──
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: Serve with nginx ──
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`}
        />
      </div>

      <div className="mt-6">
        <InfoCard variant="tip" title="Best Practices for Small Images">
          1. Use Alpine or distroless base images. 2. Multi-stage builds to exclude build tools.
          3. Combine <code>RUN</code> commands with <code>&amp;&amp;</code> and clean up in the same layer.
          4. Order instructions from least to most frequently changed for better caching.
          5. Use <code>.dockerignore</code> to exclude unnecessary files from build context.
        </InfoCard>
      </div>
    </SectionWrapper>
  );
}
