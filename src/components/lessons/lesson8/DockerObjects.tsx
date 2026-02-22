"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";

export default function DockerObjects() {
  return (
    <SectionWrapper id="sec-docker-objects" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Docker Objects
      </h3>
      <p className="text-text-secondary leading-relaxed mb-8">
        Docker manages four primary object types. Understanding how they relate to each other
        is essential for building and operating containerized applications.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {[
          {
            title: "Images",
            icon: "&#128230;",
            desc: "Read-only templates containing application code, runtime, libraries, and configuration. Built from Dockerfiles. Stored as layers in registries. Immutable once built.",
            examples: "nginx:latest, node:20-alpine, postgres:16",
            color: "docker-blue",
          },
          {
            title: "Containers",
            icon: "&#9654;",
            desc: "Runnable instances of images. Each container has its own writable layer, network interface, and process space. Can be started, stopped, paused, restarted, or removed.",
            examples: "docker run, docker start, docker stop",
            color: "docker-teal",
          },
          {
            title: "Networks",
            icon: "&#128279;",
            desc: "Provide connectivity between containers and the outside world. Docker creates a default bridge network. Custom networks enable DNS-based service discovery between containers.",
            examples: "bridge, host, overlay, macvlan",
            color: "docker-violet",
          },
          {
            title: "Volumes",
            icon: "&#128190;",
            desc: "Persistent storage that survives container removal. Managed by Docker, stored on the host filesystem. Preferred over bind mounts for production data.",
            examples: "docker volume create, -v mydata:/data",
            color: "docker-amber",
          },
        ].map((obj) => (
          <div key={obj.title} className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl" dangerouslySetInnerHTML={{ __html: obj.icon }} />
              <h4 className={`text-${obj.color} font-bold text-sm`}>{obj.title}</h4>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed mb-3">{obj.desc}</p>
            <div className="bg-story-surface rounded-lg px-3 py-2">
              <span className="text-text-muted text-[10px] font-mono">{obj.examples}</span>
            </div>
          </div>
        ))}
      </div>

      <InfoCard variant="note" title="OCI Runtime Specification">
        The OCI Runtime Spec defines a standard interface for container runtimes. It specifies
        how the filesystem bundle, configuration (namespaces, cgroups, mounts), and lifecycle hooks
        should work. This means you can swap runc for alternatives like crun (written in C, faster startup),
        youki (Rust), or gVisor&apos;s runsc (sandboxed) without changing Docker or containerd.
      </InfoCard>
    </SectionWrapper>
  );
}
