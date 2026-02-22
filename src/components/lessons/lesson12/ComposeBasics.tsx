"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import CodeBlock from "@/components/story/CodeBlock";
import InfoCard from "@/components/story/InfoCard";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";
import RevealCard from "@/components/story/RevealCard";

function ComposeArchDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const services = [
    { name: "web", port: ":3000", color: "docker-blue", x: 0 },
    { name: "api", port: ":8080", color: "docker-teal", x: 1 },
    { name: "db", port: ":5432", color: "docker-violet", x: 2 },
  ];

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Compose Multi-Service Architecture
      </h4>
      <div className="max-w-md mx-auto">
        {/* Services row */}
        <div className="flex items-start justify-center gap-4 mb-4">
          {services.map((svc, i) => (
            <motion.div
              key={svc.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 * i, duration: 0.5 }}
              className={`bg-${svc.color}/10 border border-${svc.color}/30 rounded-xl px-4 py-3 text-center flex-1`}
            >
              <div className={`text-${svc.color} font-bold text-xs`}>{svc.name}</div>
              <div className="text-text-muted text-[9px] font-mono">{svc.port}</div>
            </motion.div>
          ))}
        </div>

        {/* Connection lines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex justify-center gap-2 mb-1"
        >
          <div className="flex items-center gap-1 text-text-muted text-[9px] font-mono">
            <span className="text-docker-blue">web</span>
            <span>&harr;</span>
            <span className="text-docker-teal">api</span>
            <span>&harr;</span>
            <span className="text-docker-violet">db</span>
          </div>
        </motion.div>

        {/* Network bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.5 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="bg-docker-teal/10 border border-docker-teal/30 rounded-lg px-4 py-2 text-center mb-3"
        >
          <span className="text-docker-teal text-[10px] font-mono">compose_default network (automatic DNS)</span>
        </motion.div>

        {/* Volume */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="flex justify-end"
        >
          <div className="bg-docker-violet/10 border border-docker-violet/30 rounded-lg px-3 py-1.5 text-center">
            <div className="text-docker-violet text-[9px] font-mono">pgdata volume</div>
            <div className="text-text-muted text-[8px]">persistent storage</div>
          </div>
        </motion.div>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="text-text-muted text-xs text-center mt-4"
      >
        Compose creates networks, volumes, and all services from a single YAML file
      </motion.p>
    </div>
  );
}

export default function ComposeBasics() {
  return (
    <>
    <SectionWrapper id="sec-compose-basics" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Docker Compose — Multi-Container Applications
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        Docker Compose lets you define and manage multi-container applications in a single{" "}
        <TermDefinition term="YAML" definition="YAML Ain't Markup Language — a human-readable data format that uses indentation (spaces, not tabs) to represent structure, commonly used for configuration files" />{" "}
        file. Instead of running multiple <code>docker run</code> commands with long flag lists, you declare
        all your services, networks, and volumes in <code>docker-compose.yml</code> and manage them
        as a unit.
      </p>

      <AnalogyCard
        concept="Compose Is a Conductor"
        analogy="If each container is a musician, Docker Compose is the conductor — one YAML file brings all the services in together, ensures they start in the right order, connects them to the same network, and shuts them all down with a single gesture."
      />

      <div className="mt-8">
        <ComposeArchDiagram />
      </div>

      <h4 className="text-text-primary font-semibold text-sm mb-3">
        Compose File Structure
      </h4>
      <CodeBlock
        language="yaml"
        title="docker-compose.yml"
        code={`# docker-compose.yml
services:
  web:                        # Service name (also the DNS hostname)
    build: ./frontend         # Build from Dockerfile in ./frontend
    ports:
      - "3000:3000"          # Map host:container ports
    environment:
      - API_URL=http://api:8080
    depends_on:
      - api                   # Start api before web
    networks:
      - frontend

  api:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/myapp
    depends_on:
      - db
    networks:
      - frontend
      - backend

  db:
    image: postgres:16-alpine  # Use pre-built image
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=myapp
    networks:
      - backend

volumes:
  pgdata:                     # Named volume for persistent DB storage

networks:
  frontend:                   # Isolated network for web ↔ api
  backend:                    # Isolated network for api ↔ db`}
      />

      <div className="mt-6 grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
          <h4 className="text-docker-blue font-semibold text-sm mb-2">Key Compose Commands</h4>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li><code>docker compose up -d</code> — Build and start all services (detached)</li>
            <li><code>docker compose down</code> — Stop and remove containers, networks</li>
            <li><code>docker compose build</code> — Rebuild images</li>
            <li><code>docker compose logs -f</code> — Follow logs from all services</li>
            <li><code>docker compose ps</code> — List running services</li>
            <li><code>docker compose exec api bash</code> — Shell into a running service</li>
          </ul>
        </div>
        <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
          <h4 className="text-docker-teal font-semibold text-sm mb-2">Top-Level Keys</h4>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li><code>services:</code> — Define containers (image, build, ports, env, volumes)</li>
            <li><code>networks:</code> — Create isolated networks for service groups</li>
            <li><code>volumes:</code> — Declare named volumes for persistent storage</li>
            <li><code>secrets:</code> — Manage sensitive data (Docker Swarm)</li>
            <li><code>configs:</code> — External configuration files</li>
          </ul>
        </div>
      </div>

      <InfoCard variant="info" title="DNS and Service Discovery">
        Compose creates a default network for your project. Each service is reachable by its name —
        <code> web</code> can connect to <code>http://api:8080</code> and <code>api</code> can connect to{" "}
        <code>postgres://db:5432</code>. No IP addresses needed. This is the same user-defined bridge
        networking from Lesson 10, configured automatically.
      </InfoCard>
    </SectionWrapper>

      <RevealCard
        id="lesson12-compose-kc1"
        prompt="In a Compose file with frontend, api, and db on separate networks, why is it a security problem if the frontend service can directly reach the database? How does placing the API on both networks enforce segmentation?"
        answer="If the frontend can reach the database directly, a vulnerability in the frontend (e.g., XSS, SSRF, or a compromised dependency) could be exploited to send raw SQL queries or attack the database without going through the API's validation, authentication, and authorization layers. By placing the frontend and db on separate Docker networks and connecting only the API service to both, you enforce network segmentation at the infrastructure level. The frontend can only talk to the API (on the 'frontend' network), and only the API can talk to the database (on the 'backend' network). Docker's iptables rules physically prevent packets from the frontend container from reaching the db container. The API acts as a controlled gateway — all database access must pass through its business logic, rate limiting, and input sanitization."
        hint="Think about which service needs to talk to both the frontend AND the database."
      />
    </>
  );
}
