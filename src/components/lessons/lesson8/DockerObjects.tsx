"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import InfoCard from "@/components/story/InfoCard";
import ZineCallout from "@/components/story/ZineCallout";

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

      {/* Security features from the zine */}
      <h3 className="text-2xl font-bold text-text-primary mt-16 mb-6">
        Container Security: Capabilities &amp; seccomp-BPF
      </h3>
      <p className="text-text-secondary leading-relaxed mb-8">
        Beyond namespaces and cgroups, Docker uses two more kernel features to restrict what containers
        can do. These are configured by <code>runc</code> when setting up the container.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow">
          <h4 className="text-docker-blue font-bold text-sm mb-3">Linux Capabilities</h4>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            We think of root as all-powerful, but actually root&apos;s power is split into dozens of
            individual <strong className="text-text-primary">capabilities</strong>. Docker containers run
            with a <em>limited set</em> of capabilities — even if you&apos;re root inside the container.
          </p>
          <div className="space-y-2 mb-4">
            {[
              { cap: "CAP_NET_ADMIN", desc: "Modify network settings (routes, iptables). Dropped by default.", color: "docker-teal" },
              { cap: "CAP_SYS_ADMIN", desc: "Catch-all admin cap. Very dangerous — avoid giving this.", color: "docker-red" },
              { cap: "CAP_CHOWN", desc: "Change file ownership. Allowed by default.", color: "docker-blue" },
              { cap: "CAP_NET_BIND_SERVICE", desc: "Bind to ports < 1024. Allowed by default.", color: "docker-blue" },
            ].map((c) => (
              <div key={c.cap} className="flex items-start gap-2">
                <code className={`text-${c.color} text-[10px] font-bold flex-shrink-0 mt-0.5`}>{c.cap}</code>
                <span className="text-text-secondary text-xs">{c.desc}</span>
              </div>
            ))}
          </div>
          <div className="bg-story-surface rounded-lg px-3 py-2">
            <span className="text-text-muted text-[10px] font-mono">
              $ getpcaps PID &mdash; print a process&apos;s capabilities
            </span>
          </div>
        </div>

        <div className="bg-story-card rounded-2xl p-6 border border-story-border card-shadow">
          <h4 className="text-docker-violet font-bold text-sm mb-3">seccomp-BPF</h4>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            All programs interact with the kernel through <strong className="text-text-primary">system calls</strong>.
            Some syscalls are dangerous &mdash; <code>reboot</code>, <code>request_key</code>,
            <code> process_vm_readv</code> (read another process&apos;s memory). seccomp-BPF lets you run a
            filter <em>before every syscall</em> to decide if it&apos;s allowed.
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
            so this is transparent. Docker uses <em>both</em> dropped capabilities and seccomp-BPF
            for defense in depth.
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
