"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import CodeBlock from "@/components/story/CodeBlock";
import TerminalBlock from "@/components/story/TerminalBlock";
import InfoCard from "@/components/story/InfoCard";

export default function ComposePatterns() {
  return (
    <SectionWrapper id="sec-compose-patterns" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Common Compose Patterns
      </h3>

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
          orchestration, use <strong>Kubernetes</strong>, <strong>Docker Swarm</strong>, or managed container
          services (ECS, Cloud Run, Azure Container Apps). However, many small-to-medium applications run
          perfectly fine with Compose in production behind a reverse proxy.
        </InfoCard>
      </div>
    </SectionWrapper>
  );
}
