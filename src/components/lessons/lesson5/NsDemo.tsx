"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import TerminalBlock from "@/components/story/TerminalBlock";
import InfoCard from "@/components/story/InfoCard";

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

      <InfoCard variant="note" title="Key Commands">
        <code>unshare</code> creates new namespaces and runs a program in them. <code>nsenter</code> enters
        existing namespaces (great for debugging containers). <code>ip netns</code> manages named network namespaces.
        <code> lsns</code> lists all namespaces on the system.
      </InfoCard>
    </SectionWrapper>
  );
}
