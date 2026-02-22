"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import CodeBlock from "@/components/story/CodeBlock";
import InfoCard from "@/components/story/InfoCard";

export default function DockerfileBasics() {
  return (
    <SectionWrapper id="sec-dockerfile-basics" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Dockerfile Instructions
      </h3>
      <p className="text-text-secondary leading-relaxed mb-8">
        A Dockerfile is a text file containing instructions for building an image.
        Each instruction creates a layer in the final image. Here are the most important ones:
      </p>

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
                { cmd: "ADD", purpose: "Like COPY + URL fetch + tar extract", example: "ADD config.tar.gz /etc/" },
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
          runtime arguments are <em>appended</em> to it. Use ENTRYPOINT for commands that should always run,
          CMD for defaults the user might want to change.
        </InfoCard>

        <InfoCard variant="warning" title="Build Context and .dockerignore">
          When you run <code>docker build .</code>, the entire directory is sent to the daemon as the &ldquo;build context.&rdquo;
          Use a <code>.dockerignore</code> file to exclude <code>node_modules/</code>, <code>.git/</code>,
          <code> .env</code>, and other large or sensitive files. This speeds up builds and prevents secrets from
          leaking into images.
        </InfoCard>
      </div>
    </SectionWrapper>
  );
}
