"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import CodeBlock from "@/components/story/CodeBlock";
import InfoCard from "@/components/story/InfoCard";

export default function ComposeBasics() {
  return (
    <SectionWrapper id="sec-compose-basics" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Docker Compose — Multi-Container Applications
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        Docker Compose lets you define and manage multi-container applications in a single YAML file.
        Instead of running multiple <code>docker run</code> commands with long flag lists, you declare
        all your services, networks, and volumes in <code>docker-compose.yml</code> and manage them
        as a unit.
      </p>

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
  );
}
