"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import TerminalBlock from "@/components/story/TerminalBlock";
import InfoCard from "@/components/story/InfoCard";

export default function PortMapping() {
  return (
    <SectionWrapper id="sec-port-mapping" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Port Mapping
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        By default, container ports are not accessible from outside the Docker network. The <code>-p</code> flag
        creates iptables DNAT rules that forward traffic from a host port to a container port.
      </p>

      <div className="bg-story-card rounded-2xl border border-story-border card-shadow overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-story-surface">
                <th className="text-left px-4 py-3 text-text-primary font-semibold">Flag</th>
                <th className="text-left px-4 py-3 text-text-primary font-semibold">Meaning</th>
                <th className="text-left px-4 py-3 text-text-primary font-semibold">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-story-border">
              {[
                { flag: "-p 8080:80", meaning: "Map host 8080 → container 80", example: "Access nginx at localhost:8080" },
                { flag: "-p 80", meaning: "Map random host port → container 80", example: "Docker assigns a free host port" },
                { flag: "-p 127.0.0.1:8080:80", meaning: "Bind to localhost only", example: "Not accessible from other machines" },
                { flag: "-p 8080:80/udp", meaning: "Map UDP port", example: "For DNS or game servers" },
                { flag: "-P", meaning: "Map all EXPOSE'd ports randomly", example: "All ports in Dockerfile get mapped" },
              ].map((row) => (
                <tr key={row.flag}>
                  <td className="px-4 py-2"><code className="text-docker-blue text-xs">{row.flag}</code></td>
                  <td className="px-4 py-2 text-text-secondary">{row.meaning}</td>
                  <td className="px-4 py-2 text-text-muted text-xs">{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TerminalBlock
        title="port mapping examples"
        lines={[
          "# Run nginx with port mapping",
          "$ docker run -d -p 8080:80 --name web nginx",
          "",
          "# Check the mapping",
          "$ docker port web",
          "80/tcp -> 0.0.0.0:8080",
          "",
          "# Access from the host",
          "$ curl localhost:8080",
          "<!DOCTYPE html>...<h1>Welcome to nginx!</h1>...",
          "",
          "# See the iptables rules Docker created",
          "$ sudo iptables -t nat -L DOCKER -n",
          "DNAT  tcp  --  0.0.0.0/0  0.0.0.0/0  tcp dpt:8080 to:172.17.0.2:80",
        ]}
      />

      <div className="mt-6">
        <InfoCard variant="warning" title="Port Conflicts">
          Two containers can&apos;t map to the same host port. If port 8080 is already in use, you&apos;ll get
          &ldquo;bind: address already in use.&rdquo; Use <code>docker ps</code> to check existing mappings,
          or let Docker auto-assign with <code>-p 80</code> (no host port specified).
        </InfoCard>
      </div>
    </SectionWrapper>
  );
}
