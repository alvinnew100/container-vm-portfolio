"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import TerminalBlock from "@/components/story/TerminalBlock";
import InfoCard from "@/components/story/InfoCard";

export default function CgroupDemo() {
  return (
    <SectionWrapper id="sec-cgroup-demo" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Cgroup v1 vs v2
      </h3>
      <p className="text-text-secondary leading-relaxed mb-8">
        Linux supports two versions of cgroups. <strong className="text-text-primary">v1</strong> uses
        separate hierarchies per resource controller (cpu, memory, blkio are independent trees).
        <strong className="text-text-primary"> v2</strong> uses a single unified hierarchy where all
        controllers are managed in one tree. Most modern distros (Ubuntu 22.04+, Fedora 31+) default to v2.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
          <h4 className="text-docker-amber font-semibold text-sm mb-3">Cgroup v1</h4>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li>Separate hierarchy per controller</li>
            <li>A process can be in different groups for different controllers</li>
            <li>Complex to manage, inconsistent behavior</li>
            <li>Mounted at <code>/sys/fs/cgroup/cpu/</code>, <code>/sys/fs/cgroup/memory/</code>, etc.</li>
          </ul>
        </div>
        <div className="bg-story-card rounded-xl p-5 border border-story-border card-shadow">
          <h4 className="text-docker-teal font-semibold text-sm mb-3">Cgroup v2 (unified)</h4>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li>Single hierarchy for all controllers</li>
            <li>A process is in exactly one group, all controllers apply</li>
            <li>Simpler, consistent, better resource distribution</li>
            <li>Mounted at <code>/sys/fs/cgroup/</code> (unified)</li>
          </ul>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <h4 className="text-text-primary font-semibold text-sm mb-3">
            Cgroup v2: Create a resource-limited group manually
          </h4>
          <TerminalBlock
            title="cgroups v2 demo"
            lines={[
              "# Check if cgroup v2 is active",
              "$ mount | grep cgroup2",
              "cgroup2 on /sys/fs/cgroup type cgroup2 (rw,nosuid,nodev,noexec,relatime)",
              "",
              "# Create a cgroup",
              "$ sudo mkdir /sys/fs/cgroup/my-container",
              "",
              "# Limit to 256MB memory and 50% of one CPU",
              "$ echo 268435456 | sudo tee /sys/fs/cgroup/my-container/memory.max",
              "$ echo '50000 100000' | sudo tee /sys/fs/cgroup/my-container/cpu.max",
              "",
              "# Add current shell to the cgroup",
              "$ echo $$ | sudo tee /sys/fs/cgroup/my-container/cgroup.procs",
              "",
              "# Verify limits",
              "$ cat /sys/fs/cgroup/my-container/memory.max",
              "268435456",
              "$ cat /sys/fs/cgroup/my-container/cpu.max",
              "50000 100000",
            ]}
          />
        </div>

        <div>
          <h4 className="text-text-primary font-semibold text-sm mb-3">
            Docker resource limits → cgroup settings
          </h4>
          <TerminalBlock
            title="docker cgroups"
            lines={[
              "# Run a container with resource limits",
              "$ docker run -d --name limited --memory=256m --cpus=0.5 nginx",
              "",
              "# Find the container's cgroup on the host",
              "$ CONTAINER_ID=$(docker inspect --format '{{.Id}}' limited)",
              "$ cat /sys/fs/cgroup/system.slice/docker-${CONTAINER_ID}.scope/memory.max",
              "268435456",
              "$ cat /sys/fs/cgroup/system.slice/docker-${CONTAINER_ID}.scope/cpu.max",
              "50000 100000",
            ]}
          />
        </div>
      </div>

      <InfoCard variant="tip" title="Namespaces + Cgroups = Containers">
        This is the key insight: a container is just a regular Linux process with <strong>namespaces</strong> for
        isolation (what it can see) and <strong>cgroups</strong> for resource control (what it can use).
        Docker, containerd, and other runtimes are just convenient tools for setting these up correctly.
      </InfoCard>
    </SectionWrapper>
  );
}
