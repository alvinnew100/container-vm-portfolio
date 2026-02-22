"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import TerminalBlock from "@/components/story/TerminalBlock";
import CodeBlock from "@/components/story/CodeBlock";
import InfoCard from "@/components/story/InfoCard";
import ZineCallout from "@/components/story/ZineCallout";

export default function NsDemo() {
  return (
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

        <div>
          <h4 className="text-text-primary font-semibold text-sm mb-3">
            Create a Network namespace manually
          </h4>
          <TerminalBlock
            title="network namespace"
            lines={[
              "# Create a named network namespace",
              "$ sudo ip netns add my-netns",
              "",
              "# Run a command inside it",
              "$ sudo ip netns exec my-netns ip link list",
              "1: lo: <LOOPBACK> mtu 65536 qdisc noop state DOWN",
              "",
              "# Only loopback exists — completely isolated network stack",
              "# Add a veth pair to connect it to the host:",
              "$ sudo ip link add veth-host type veth peer name veth-ns",
              "$ sudo ip link set veth-ns netns my-netns",
              "$ sudo ip netns exec my-netns ip addr add 10.0.0.2/24 dev veth-ns",
              "$ sudo ip netns exec my-netns ip link set veth-ns up",
            ]}
          />
        </div>
      </div>

      <div>
          <h4 className="text-text-primary font-semibold text-sm mb-3">
            A container in 15 lines of bash
          </h4>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            The zine &ldquo;How Containers Work&rdquo; includes this remarkable demo: a working container
            built from scratch using just shell commands. It demonstrates that containers are not magic &mdash;
            they&apos;re just Linux kernel features combined together.
          </p>
          <CodeBlock
            language="bash"
            title="containers-aren't-magic.sh (from the zine, p.6)"
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
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            The script above uses <code>chroot</code> for simplicity, but real containers use <code>pivot_root</code>.
            Why? Programs can break out of a chroot (the old filesystem is still there, just hidden).
            <code> pivot_root</code> actually <em>unmounts</em> the old filesystem, making it impossible for
            the container to access it.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-docker-amber/5 rounded-xl p-4 border border-docker-amber/20">
              <h5 className="text-docker-amber font-semibold text-xs mb-1">chroot</h5>
              <p className="text-text-secondary text-xs leading-relaxed">
                Changes the apparent root directory. But the old filesystem is still mounted and
                accessible — a root process can escape with some tricks.
              </p>
            </div>
            <div className="bg-docker-teal/5 rounded-xl p-4 border border-docker-teal/20">
              <h5 className="text-docker-teal font-semibold text-xs mb-1">pivot_root</h5>
              <p className="text-text-secondary text-xs leading-relaxed">
                Swaps the root filesystem entirely and can unmount the old one. The container
                literally cannot access the host filesystem. This is what Docker uses.
              </p>
            </div>
          </div>
        </div>

      <div className="mt-6">
        <InfoCard variant="note" title="Key Commands">
          <code>unshare</code> creates new namespaces and runs a program in them. <code>nsenter</code> enters
          existing namespaces (great for debugging containers). <code>ip netns</code> manages named network namespaces.
          <code> lsns</code> lists all namespaces on the system. Each namespace type has its own man page
          (e.g., <code>man network_namespaces</code>).
        </InfoCard>
      </div>

      <div className="mt-4">
        <ZineCallout page="6, 9, 15" topic="containers aren't magic script, pivot_root, namespace system calls" />
      </div>
    </SectionWrapper>
  );
}
