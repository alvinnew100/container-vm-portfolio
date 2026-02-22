"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";

export default function Tradeoffs() {
  return (
    <SectionWrapper id="sec-tradeoffs" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        When to Use Which?
      </h3>
      <p className="text-text-secondary leading-relaxed mb-8">
        VMs and containers are not competitors &mdash; they solve different problems. In many production
        environments, they&apos;re used <em>together</em>: containers run inside VMs for defense in depth.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow">
          <h4 className="text-docker-violet font-bold text-sm mb-4">Choose VMs when you need...</h4>
          <ul className="space-y-3">
            {[
              "Strong security isolation (multi-tenant, untrusted workloads)",
              "Different operating systems on the same host",
              "Kernel-level customization (custom modules, different kernel versions)",
              "Hardware-level features (GPU passthrough, SR-IOV)",
              "Compliance requirements mandating VM-level separation",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed">
                <span className="text-docker-violet mt-0.5 flex-shrink-0">&#10003;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow">
          <h4 className="text-docker-blue font-bold text-sm mb-4">Choose Containers when you need...</h4>
          <ul className="space-y-3">
            {[
              "Fast startup and scaling (microservices, serverless)",
              "High density — hundreds of instances per host",
              "Reproducible builds and immutable deployments",
              "Developer-friendly workflow (build, ship, run)",
              "CI/CD pipelines with fast, disposable environments",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed">
                <span className="text-docker-blue mt-0.5 flex-shrink-0">&#10003;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <InfoCard variant="tip" title="Best of Both Worlds">
        Most cloud providers run containers inside lightweight VMs (e.g., AWS Fargate uses Firecracker microVMs,
        Google gVisor provides a user-space kernel). This combines the speed and density of containers with the
        security isolation of VMs. Kata Containers follows the same pattern for on-premise Kubernetes deployments.
      </InfoCard>
    </SectionWrapper>
  );
}
