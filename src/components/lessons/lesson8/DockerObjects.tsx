"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";
import ZineCallout from "@/components/story/ZineCallout";

const DOCKER_OBJECTS = [
  {
    title: "Images",
    icon: "\u{1F4E6}",
    desc: "Read-only templates containing application code, runtime, libraries, and configuration. Built from Dockerfiles. Stored as layers in registries. Immutable once built.",
    examples: "nginx:latest, node:20-alpine, postgres:16",
    color: "docker-blue",
  },
  {
    title: "Containers",
    icon: "\u25B6",
    desc: "Runnable instances of images. Each container has its own writable layer, network interface, and process space. Can be started, stopped, paused, restarted, or removed.",
    examples: "docker run, docker start, docker stop",
    color: "docker-teal",
  },
  {
    title: "Networks",
    icon: "\u{1F517}",
    desc: "Provide connectivity between containers and the outside world. Docker creates a default bridge network. Custom networks enable DNS-based service discovery between containers.",
    examples: "bridge, host, overlay, macvlan",
    color: "docker-violet",
  },
  {
    title: "Volumes",
    icon: "\u{1F4BE}",
    desc: "Persistent storage that survives container removal. Managed by Docker, stored on the host filesystem. Preferred over bind mounts for production data.",
    examples: "docker volume create, -v mydata:/data",
    color: "docker-amber",
  },
];

function ObjectGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="grid sm:grid-cols-2 gap-4 mb-8">
      {DOCKER_OBJECTS.map((obj, i) => (
        <motion.div
          key={obj.title}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.12 * i, duration: 0.4 }}
          className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{obj.icon}</span>
            <h4 className={`text-${obj.color} font-bold text-sm`}>{obj.title}</h4>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">{obj.desc}</p>
          <div className="bg-story-surface rounded-lg px-3 py-2">
            <span className="text-text-muted text-[10px] font-mono">{obj.examples}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

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

      <ObjectGrid />

      <InfoCard variant="note" title="OCI Runtime Specification">
        The OCI Runtime Spec defines a standard interface for container runtimes. It specifies
        how the filesystem bundle, configuration (namespaces, cgroups, mounts), and lifecycle hooks
        should work. This means you can swap runc for alternatives like crun (faster startup),
        youki (Rust), or gVisor&apos;s runsc (sandboxed) without changing Docker or containerd.
      </InfoCard>

      {/* Security features */}
      <h3 className="text-2xl font-bold text-text-primary mt-16 mb-6">
        Container Security: Capabilities &amp; seccomp-BPF
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        Beyond namespaces and cgroups, Docker uses two more kernel features to restrict what containers
        can do. These are configured by <code>runc</code> when setting up the container.
      </p>

      <AnalogyCard
        concept="Capabilities = A Keychain"
        analogy="Think of root's power as a keychain with dozens of keys. Docker removes most keys before handing the keychain to the container. It can still unlock the doors it needs (changing file ownership, binding to port 80) but can't unlock dangerous doors (modifying the network stack, loading kernel modules)."
      />

      <div className="grid sm:grid-cols-2 gap-6 mt-8 mb-8">
        <div className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow">
          <h4 className="text-docker-blue font-bold text-sm mb-3">Linux Capabilities</h4>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            We think of root as all-powerful, but actually root&apos;s power is split into dozens of
            individual <strong className="text-text-primary">capabilities</strong>. Docker containers run
            with a <em>limited set</em> — even if you&apos;re root inside the container.
          </p>
          <div className="space-y-2 mb-4">
            {[
              { cap: "CAP_NET_ADMIN", desc: "Modify network settings. Dropped by default.", color: "docker-teal" },
              { cap: "CAP_SYS_ADMIN", desc: "Catch-all admin cap. Very dangerous — avoid.", color: "docker-red" },
              { cap: "CAP_CHOWN", desc: "Change file ownership. Allowed by default.", color: "docker-blue" },
              { cap: "CAP_NET_BIND_SERVICE", desc: "Bind to ports < 1024. Allowed by default.", color: "docker-blue" },
            ].map((c) => (
              <div key={c.cap} className="flex items-start gap-2">
                <code className={`text-${c.color} text-[10px] font-bold flex-shrink-0 mt-0.5`}>{c.cap}</code>
                <span className="text-text-secondary text-xs">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow">
          <h4 className="text-docker-violet font-bold text-sm mb-3">seccomp-BPF</h4>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            All programs interact with the kernel through{" "}
            <TermDefinition term="system calls" definition="requests from a program to the kernel, as we learned in the Primer — open files, send data, allocate memory" />.
            Some syscalls are dangerous &mdash; <code>reboot</code>, <code>request_key</code>.
            seccomp-BPF runs a filter <em>before every syscall</em> to decide if it&apos;s allowed.
          </p>
          <div className="bg-story-dark rounded-lg p-3 mb-4">
            <code className="text-white/70 text-xs">
              <span className="text-docker-teal">if</span> name <span className="text-docker-teal">in</span> allowed_list {"{"}<br />
              &nbsp;&nbsp;<span className="text-docker-teal">return</span> <span className="text-green-400">true</span>;<br />
              {"}"}<br />
              <span className="text-docker-teal">return</span> <span className="text-docker-red">false</span>; <span className="text-white/30">// syscall blocked!</span>
            </code>
          </div>
          <p className="text-text-secondary text-xs leading-relaxed">
            Docker blocks <strong>~44 dangerous syscalls</strong> by default. Most programs don&apos;t need them,
            so this is transparent.
          </p>
        </div>
      </div>

      <InfoCard variant="info" title="Containers = Processes with Restrictions">
        A container is just a group of Linux processes with restrictions enforced by the kernel:
        <strong> namespaces</strong> (what it can see), <strong>cgroups</strong> (how much it can use),
        <strong> capabilities</strong> (what root powers it has), <strong>seccomp-BPF</strong> (which syscalls
        are allowed), and <strong>pivot_root</strong> (its filesystem). That&apos;s it — no magic.
      </InfoCard>

      <div className="mt-4">
        <ZineCallout page="7-8, 20-21" topic="containers = processes, capabilities, seccomp-BPF" />
      </div>
    </SectionWrapper>
  );
}
