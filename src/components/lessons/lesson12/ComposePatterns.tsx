"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import CodeBlock from "@/components/story/CodeBlock";
import TerminalBlock from "@/components/story/TerminalBlock";
import InfoCard from "@/components/story/InfoCard";
import TermDefinition from "@/components/story/TermDefinition";

function ReverseProxyDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const steps = [
    { label: "Browser", desc: "example.com", color: "docker-amber" },
    { label: "nginx", desc: "reverse proxy :80", color: "docker-blue" },
    { label: "/api/* → api:8080", desc: "route by path", color: "docker-teal" },
    { label: "/* → web:3000", desc: "default route", color: "docker-violet" },
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Reverse Proxy Pattern
      </h4>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 * i, duration: 0.4 }}
              className={`bg-${step.color}/10 border border-${step.color}/30 rounded-lg px-3 py-2 text-center min-w-[90px]`}
            >
              <div className={`text-${step.color} font-bold text-xs`}>{step.label}</div>
              <div className="text-text-muted text-[9px] mt-0.5">{step.desc}</div>
            </motion.div>
            {i < steps.length - 1 && i !== 1 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 * i + 0.1, duration: 0.3 }}
                className="text-text-muted text-xs font-mono"
              >
                &rarr;
              </motion.span>
            )}
            {i === 1 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="text-text-muted text-[9px] font-mono"
              >
                routes&rarr;
              </motion.span>
            )}
          </div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="text-text-muted text-xs text-center mt-4"
      >
        One public port (80) serves all services — nginx routes requests to the right container by URL path
      </motion.p>
    </div>
  );
}

function StartupSequenceDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const stages = [
    { services: ["redis", "postgres"], label: "No dependencies", color: "docker-violet" },
    { services: ["api"], label: "Waits for db + redis", color: "docker-teal" },
    { services: ["nginx"], label: "Waits for api", color: "docker-blue" },
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Startup Sequence (depends_on)
      </h4>
      <div className="max-w-sm mx-auto space-y-3">
        {stages.map((stage, i) => (
          <motion.div
            key={stage.label}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 * i, duration: 0.5 }}
            className={`bg-${stage.color}/10 border border-${stage.color}/30 rounded-lg px-4 py-3`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-${stage.color} font-mono text-[10px] font-bold`}>
                  Step {i + 1}:
                </span>
                <span className={`text-${stage.color} text-xs font-semibold`}>
                  {stage.services.join(" + ")}
                </span>
              </div>
              <span className="text-text-muted text-[9px]">{stage.label}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="text-text-muted text-xs text-center mt-4"
      >
        Compose starts services in dependency order — databases first, then the app, then the proxy
      </motion.p>
    </div>
  );
}

export default function ComposePatterns() {
  return (
    <SectionWrapper id="sec-compose-patterns" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Common Compose Patterns
      </h3>

      <p className="text-text-secondary leading-relaxed mb-6">
        A common production pattern uses a{" "}
        <TermDefinition term="reverse proxy" definition="a server that sits in front of other servers, receiving all incoming requests and forwarding them to the correct backend service — it lets multiple services share a single public port" />{" "}
        like nginx to route traffic, combined with a{" "}
        <TermDefinition term="Redis" definition="an in-memory data store often used as a cache or message broker — it keeps frequently accessed data in RAM for extremely fast reads" />{" "}
        cache for performance.
      </p>

      <ReverseProxyDiagram />
      <StartupSequenceDiagram />

      <div className="space-y-8 mb-8">
        {/* Pattern 1: Web + API + DB + Cache */}
        <div>
          <h4 className="text-text-primary font-semibold text-sm mb-3">
            Pattern: Web + API + Database + Cache
          </h4>
          <CodeBlock
            language="yaml"
            title="docker-compose.yml — Full stack"
            code={`services:
  nginx:
    image: nginx:1.25-alpine
    ports: ["80:80"]
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on: [api]

  api:
    build: .
    environment:
      DATABASE_URL: postgres://app:secret@postgres:5432/myapp
      REDIS_URL: redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started

  postgres:
    image: postgres:16-alpine
    volumes: [pgdata:/var/lib/postgresql/data]
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes: [redisdata:/data]

volumes:
  pgdata:
  redisdata:`}
          />
        </div>

        {/* Pattern 2: Development overrides */}
        <div>
          <h4 className="text-text-primary font-semibold text-sm mb-3">
            Pattern: Development Overrides
          </h4>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            Use <code>docker-compose.override.yml</code> to add dev-specific settings
            (bind mounts for live reload, debug ports, verbose logging) that are automatically
            merged with the base file.
          </p>
          <CodeBlock
            language="yaml"
            title="docker-compose.override.yml — Development"
            code={`# Automatically merged with docker-compose.yml
services:
  api:
    build:
      context: .
      target: development      # Use dev stage of multi-stage Dockerfile
    volumes:
      - ./src:/app/src         # Live code reload
    environment:
      NODE_ENV: development
      DEBUG: "app:*"
    ports:
      - "9229:9229"           # Node.js debugger`}
          />
        </div>
      </div>

      <TerminalBlock
        title="compose lifecycle"
        lines={[
          "# Start the entire stack",
          "$ docker compose up -d",
          "[+] Running 4/4",
          " ✔ Container myapp-redis-1     Started",
          " ✔ Container myapp-postgres-1  Started",
          " ✔ Container myapp-api-1       Started",
          " ✔ Container myapp-nginx-1     Started",
          "",
          "# Check status",
          "$ docker compose ps",
          "NAME                 STATUS          PORTS",
          "myapp-nginx-1        Up 2 minutes    0.0.0.0:80->80/tcp",
          "myapp-api-1          Up 2 minutes",
          "myapp-postgres-1     Up 2 minutes    5432/tcp",
          "myapp-redis-1        Up 2 minutes    6379/tcp",
          "",
          "# View logs",
          "$ docker compose logs -f api",
          "api-1  | Server listening on port 8080",
          "",
          "# Tear down (preserves volumes)",
          "$ docker compose down",
          "",
          "# Tear down AND delete volumes",
          "$ docker compose down -v",
        ]}
      />

      <div className="mt-6">
        <InfoCard variant="tip" title="Production Considerations">
          Docker Compose is ideal for development and single-host deployments. For production multi-host
          orchestration, use <strong>Kubernetes</strong>,{" "}
          <TermDefinition term="Docker Swarm" definition="Docker's built-in orchestration tool that turns multiple Docker hosts into a single cluster, distributing containers across machines for high availability" />,{" "}
          or managed container services (ECS, Cloud Run, Azure Container Apps). However, many small-to-medium
          applications run perfectly fine with Compose in production behind a reverse proxy.
        </InfoCard>
      </div>
    </SectionWrapper>
  );
}
