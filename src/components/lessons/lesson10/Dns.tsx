"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import TerminalBlock from "@/components/story/TerminalBlock";
import InfoCard from "@/components/story/InfoCard";

export default function Dns() {
  return (
    <SectionWrapper id="sec-dns" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Container DNS Resolution
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        On <strong className="text-text-primary">user-defined bridge networks</strong>, Docker runs an embedded DNS server
        that lets containers find each other by name. This is one of the biggest advantages of custom networks
        over the default bridge, where you&apos;d need to use IP addresses or legacy <code>--link</code>.
      </p>

      <TerminalBlock
        title="DNS discovery demo"
        lines={[
          "# Create a custom bridge network",
          "$ docker network create myapp-net",
          "",
          "# Start two containers on the same network",
          "$ docker run -d --name api --network myapp-net nginx",
          "$ docker run -d --name web --network myapp-net alpine sleep 3600",
          "",
          "# From 'web', resolve 'api' by container name",
          "$ docker exec web ping -c 2 api",
          "PING api (172.18.0.2): 56 data bytes",
          "64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.089 ms",
          "64 bytes from 172.18.0.2: seq=1 ttl=64 time=0.107 ms",
          "",
          "# DNS resolution works — no hardcoded IPs needed!",
          "$ docker exec web nslookup api",
          "Name:      api",
          "Address 1: 172.18.0.2 api.myapp-net",
        ]}
      />

      <div className="mt-6 grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
          <h4 className="text-docker-blue font-semibold text-sm mb-2">Default Bridge</h4>
          <ul className="space-y-1 text-text-secondary text-sm">
            <li>&#10008; No automatic DNS</li>
            <li>&#10008; Must use IP addresses or --link</li>
            <li>&#10008; All containers on same default network</li>
          </ul>
        </div>
        <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
          <h4 className="text-docker-teal font-semibold text-sm mb-2">Custom Bridge</h4>
          <ul className="space-y-1 text-text-secondary text-sm">
            <li>&#10004; Automatic DNS by container name</li>
            <li>&#10004; Network aliases supported</li>
            <li>&#10004; Network isolation between apps</li>
          </ul>
        </div>
      </div>

      <InfoCard variant="tip" title="Always Use Custom Networks">
        For any multi-container application, create a custom network with <code>docker network create</code>.
        This gives you DNS-based service discovery, better isolation (containers on different networks
        can&apos;t communicate), and the ability to connect/disconnect containers dynamically.
      </InfoCard>
    </SectionWrapper>
  );
}
