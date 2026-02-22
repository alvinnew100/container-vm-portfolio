"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import TerminalBlock from "@/components/story/TerminalBlock";
import CodeBlock from "@/components/story/CodeBlock";
import InfoCard from "@/components/story/InfoCard";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";
import ZineCallout from "@/components/story/ZineCallout";
import KnowledgeCheck from "@/components/story/KnowledgeCheck";

const SCRIPT_STEPS = [
  { label: "Download image", line: "wget + tar", color: "docker-blue" },
  { label: "Create cgroup", line: "cgcreate", color: "docker-teal" },
  { label: "Set limits", line: "cgset cpu + memory", color: "docker-violet" },
  { label: "Apply cgroup", line: "cgexec", color: "docker-amber" },
  { label: "Create namespaces", line: "unshare -fmuipn", color: "docker-blue" },
  { label: "Change root", line: "chroot", color: "docker-teal" },
  { label: "Mount /proc", line: "mount -t proc", color: "docker-violet" },
  { label: "Set hostname", line: "hostname", color: "docker-amber" },
  { label: "Start shell", line: "/usr/bin/fish", color: "docker-blue" },
];

function ScriptFlowDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Container-in-a-Script Flow
      </h4>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {SCRIPT_STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 * i, duration: 0.3 }}
              className={`bg-${step.color}/10 border border-${step.color}/20 rounded-lg px-2 py-1.5 text-center`}
            >
              <div className={`text-${step.color} font-bold text-[9px]`}>{step.label}</div>
              <div className="text-text-muted text-[8px] font-mono">{step.line}</div>
            </motion.div>
            {i < SCRIPT_STEPS.length - 1 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.1 * i + 0.05, duration: 0.2 }}
                className="text-text-muted text-[10px]"
              >
                &rarr;
              </motion.span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NsDemo() {
  return (
    <>
    <SectionWrapper id="sec-ns-demo" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Hands-On: unshare and nsenter
      </h3>
      <p className="text-text-secondary leading-relaxed mb-8">
        You can create and enter namespaces directly from the command line using <code>unshare</code> (create
        a new namespace and run a command in it) and <code>nsenter</code> (enter an existing namespace).
      </p>

      <div className="space-y-6 mb-8">
        <div>
          <h4 className="text-text-primary font-semibold text-sm mb-3">
            Create a PID + Mount namespace with unshare
          </h4>
          <TerminalBlock
            title="creating namespaces"
            lines={[
              "# Create a new PID and mount namespace, with a new root filesystem",
              "$ sudo unshare --pid --mount --fork --mount-proc bash",
              "",
              "# Inside the new namespace — we are PID 1!",
              "$ ps aux",
              "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND",
              "root         1  0.0  0.0  18508  3432 pts/0    S    12:00   0:00 bash",
              "root         2  0.0  0.0  34400  2928 pts/0    R+   12:00   0:00 ps aux",
              "",
              "# Only 2 processes visible — we can't see the host's processes",
              "$ echo $$",
              "1",
            ]}
          />
        </div>

        <div>
          <h4 className="text-text-primary font-semibold text-sm mb-3">
            Enter a container&apos;s namespace with nsenter
          </h4>
          <TerminalBlock
            title="entering namespaces"
            lines={[
              "# Find a running container's PID on the host",
              "$ docker inspect --format '{{.State.Pid}}' my-container",
              "4523",
              "",
              "# Enter all of its namespaces",
              "$ sudo nsenter -t 4523 -m -u -i -n -p -- bash",
              "",
              "# Now we're 'inside' the container, seeing its view of the world",
              "$ hostname",
              "my-container",
              "$ ip addr show eth0",
              "    inet 172.17.0.2/16 scope global eth0",
            ]}
          />
        </div>
      </div>

      <div>
        <h4 className="text-text-primary font-semibold text-sm mb-3">
          A container in 15 lines of bash
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          This script builds a working container from scratch using just shell commands. It demonstrates
          that containers are not magic &mdash; they&apos;re just Linux kernel features combined together.
        </p>

        <ScriptFlowDiagram />

        <CodeBlock
          language="bash"
          title="containers-aren't-magic.sh"
          code={`wget bit.ly/fish-container -O fish.tar
mkdir container-root; cd container-root
tar -xf ../fish.tar                          # 1. download & unpack the image
cgroup_id="cgroup_$(shuf -i 1000-2000 -n 1)" # 2. random cgroup name
cgcreate -g "cpu,cpuacct,memory:$cgroup_id"  # 3. make a cgroup &
cgset -r cpu.shares=512 "$cgroup_id"          #    set CPU/memory limits
cgset -r memory.limit_in_bytes=1000000000 \\
  "$cgroup_id"
cgexec -g "cpu,cpuacct,memory:$cgroup_id" \\  # 4. use the cgroup
  unshare -fmuipn --mount-proc \\              # 5. make + use some namespaces
  chroot "\${PWD}" \\                           # 6. change root directory
  /bin/sh -c "                                 # 7-10:
    /bin/mount -t proc proc /proc &&           #    mount /proc
    hostname container-fun-times &&            #    set hostname
    /usr/bin/fish"                             #    start fish shell!`}
        />
      </div>

      <div className="mt-6">
        <h4 className="text-text-primary font-semibold text-sm mb-3">
          pivot_root vs chroot
        </h4>

        <AnalogyCard
          concept="chroot vs pivot_root"
          analogy="chroot is like putting a blindfold on someone in your house — they can't see, but they're still in your house and might find their way around. pivot_root is like teleporting them to a different house entirely and demolishing the bridge back."
        />

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-docker-amber/5 rounded-xl p-4 border border-docker-amber/20">
            <h5 className="text-docker-amber font-semibold text-xs mb-1">
              <TermDefinition term="chroot" definition="changes the apparent root directory for a process — it sees a subfolder as '/'" />
            </h5>
            <p className="text-text-secondary text-xs leading-relaxed">
              The old filesystem is still mounted and accessible — a root process can escape with some tricks.
              Used in the script above for simplicity.
            </p>
          </div>
          <div className="bg-docker-teal/5 rounded-xl p-4 border border-docker-teal/20">
            <h5 className="text-docker-teal font-semibold text-xs mb-1">
              <TermDefinition term="pivot_root" definition="swaps the entire root filesystem and can unmount the old one completely" />
            </h5>
            <p className="text-text-secondary text-xs leading-relaxed">
              The container literally cannot access the host filesystem. This is what Docker actually uses
              for real containers.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <InfoCard variant="note" title="Key Commands">
          <code>unshare</code> creates new namespaces and runs a program in them. <code>nsenter</code> enters
          existing namespaces (great for debugging containers). <code>ip netns</code> manages named network namespaces.
          <code> lsns</code> lists all namespaces on the system.
        </InfoCard>
      </div>

      <div className="mt-4">
        <ZineCallout page="6, 9, 15" topic="containers aren't magic script, pivot_root, namespace system calls" />
      </div>
    </SectionWrapper>

      <KnowledgeCheck
        id="lesson5-pid-kc1"
        question="A container's main process is PID 1 inside the container but PID 4523 on the host. What happens if PID 1 exits?"
        options={["The container dies — all its processes are killed", "Nothing — another process becomes PID 1"]}
        correctIndex={0}
        explanation="PID 1 is the init process of the PID namespace. When it exits, the kernel sends SIGKILL to all remaining processes in that namespace, effectively destroying the container. This is why 'docker stop' sends SIGTERM to PID 1."
        hint="PID 1 has a special role — it's the parent of all processes in the namespace."
      />
    </>
  );
}
