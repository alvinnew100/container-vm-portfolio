"use client";

import LessonDivider from "@/components/story/LessonDivider";
import LessonObjectives from "@/components/story/LessonObjectives";
import ProgressBar from "@/components/story/ProgressBar";

// Hero
import Hero from "@/components/lessons/lesson1/Hero";

// Primer: Computer Architecture
import WhatIsAComputer from "@/components/lessons/lesson0/WhatIsAComputer";
import WhatIsAnOS from "@/components/lessons/lesson0/WhatIsAnOS";
import FilesystemBasics from "@/components/lessons/lesson0/FilesystemBasics";
import Networking101 from "@/components/lessons/lesson0/Networking101";
import ProcessesDeepDive from "@/components/lessons/lesson0/ProcessesDeepDive";

// Lesson 1: Why Virtualization?
import WhyVirtualization from "@/components/lessons/lesson1/WhyVirtualization";

// Lesson 2: Virtual Machines
import VmArchitecture from "@/components/lessons/lesson2/VmArchitecture";
import Hypervisors from "@/components/lessons/lesson2/Hypervisors";

// Lesson 3: VM Internals
import CpuVirt from "@/components/lessons/lesson3/CpuVirt";
import MemVirt from "@/components/lessons/lesson3/MemVirt";
import IoVirt from "@/components/lessons/lesson3/IoVirt";

// Lesson 4: Containers vs VMs
import Comparison from "@/components/lessons/lesson4/Comparison";
import Tradeoffs from "@/components/lessons/lesson4/Tradeoffs";

// Lesson 5: Linux Namespaces
import Namespaces from "@/components/lessons/lesson5/Namespaces";
import NsDemo from "@/components/lessons/lesson5/NsDemo";

// Lesson 6: Cgroups
import Cgroups from "@/components/lessons/lesson6/Cgroups";
import CgroupDemo from "@/components/lessons/lesson6/CgroupDemo";

// Lesson 7: Container Images
import ImageLayers from "@/components/lessons/lesson7/ImageLayers";
import Registries from "@/components/lessons/lesson7/Registries";

// Lesson 8: Docker Architecture
import DockerArch from "@/components/lessons/lesson8/DockerArch";
import DockerObjects from "@/components/lessons/lesson8/DockerObjects";

// Lesson 9: Dockerfile
import DockerfileBasics from "@/components/lessons/lesson9/DockerfileBasics";
import MultiStage from "@/components/lessons/lesson9/MultiStage";

// Lesson 10: Docker Networking
import NetworkTypes from "@/components/lessons/lesson10/NetworkTypes";
import PortMapping from "@/components/lessons/lesson10/PortMapping";
import Dns from "@/components/lessons/lesson10/Dns";

// Lesson 11: Docker Storage
import StorageTypes from "@/components/lessons/lesson11/StorageTypes";
import Volumes from "@/components/lessons/lesson11/Volumes";

// Lesson 12: Docker Compose
import ComposeBasics from "@/components/lessons/lesson12/ComposeBasics";
import ComposePatterns from "@/components/lessons/lesson12/ComposePatterns";

export default function HomePage() {
  return (
    <div>
      {/* ===================== HERO ===================== */}
      <Hero />

      {/* ===================== PRIMER: COMPUTER ARCHITECTURE ===================== */}
      <LessonDivider lesson={0} title="Computer Architecture" id="lesson-0" />
      <LessonObjectives objectives={[
        "Identify the four main components of a computer (CPU, RAM, disk, NIC) and what each does",
        "Explain what an operating system and kernel do, and why Ring 0 vs Ring 3 matters",
        "Understand filesystems, paths, and mounting — the foundation for container filesystems",
        "Know the basics of networking: IP addresses, ports, DNS, NAT",
        "Understand processes, PIDs, and fork/exec — because containers ARE processes",
      ]} />
      <ProgressBar lessonPrefix="lesson0-" total={5} label="Primer Progress" />
      <WhatIsAComputer />
      <WhatIsAnOS />
      <FilesystemBasics />
      <Networking101 />
      <ProcessesDeepDive />

      {/* ===================== LESSON 1: WHY VIRTUALIZATION? ===================== */}
      <LessonDivider lesson={1} title="Why Virtualization?" id="lesson-1" />
      <LessonObjectives objectives={[
        "Understand why isolation matters for running multiple applications",
        "Explain the evolution from physical servers to VMs to containers",
      ]} />
      <ProgressBar lessonPrefix="lesson1-" total={1} />
      <WhyVirtualization />

      {/* ===================== LESSON 2: VIRTUAL MACHINES ===================== */}
      <LessonDivider lesson={2} title="Virtual Machines" id="lesson-2" />
      <LessonObjectives objectives={[
        "Distinguish Type 1 (bare-metal) vs Type 2 (hosted) hypervisors",
        "Describe VM components: vCPU, vRAM, vNIC, vDisk",
        "Understand the VM lifecycle: create, start, snapshot, migrate, destroy",
      ]} />
      <ProgressBar lessonPrefix="lesson2-" total={2} />
      <VmArchitecture />
      <Hypervisors />

      {/* ===================== LESSON 3: VM INTERNALS ===================== */}
      <LessonDivider lesson={3} title="VM Internals" id="lesson-3" />
      <LessonObjectives objectives={[
        "Explain how hardware-assisted CPU virtualization (VT-x/AMD-V) works",
        "Compare shadow page tables with EPT/NPT for memory virtualization",
        "Compare I/O virtualization approaches: emulation, paravirtual (virtio), SR-IOV",
      ]} />
      <ProgressBar lessonPrefix="lesson3-" total={3} />
      <CpuVirt />
      <MemVirt />
      <IoVirt />

      {/* ===================== LESSON 4: CONTAINERS VS VMS ===================== */}
      <LessonDivider lesson={4} title="Containers vs VMs" id="lesson-4" />
      <LessonObjectives objectives={[
        "Explain the fundamental architectural difference: shared kernel vs guest OS",
        "Evaluate tradeoffs in startup time, memory, isolation, and density",
        "Choose the right technology for a given use case",
      ]} />
      <ProgressBar lessonPrefix="lesson4-" total={2} />
      <Comparison />
      <Tradeoffs />

      {/* ===================== LESSON 5: LINUX NAMESPACES ===================== */}
      <LessonDivider lesson={5} title="Linux Namespaces" id="lesson-5" />
      <LessonObjectives objectives={[
        "Name all 7 namespace types and explain what each isolates",
        "Demonstrate creating a namespace with unshare and entering one with nsenter",
      ]} />
      <ProgressBar lessonPrefix="lesson5-" total={2} />
      <Namespaces />
      <NsDemo />

      {/* ===================== LESSON 6: CGROUPS ===================== */}
      <LessonDivider lesson={6} title="Cgroups — Resource Control" id="lesson-6" />
      <LessonObjectives objectives={[
        "Explain how cgroups limit CPU and memory for groups of processes",
        "Distinguish cgroup v1 (per-controller hierarchy) from v2 (unified hierarchy)",
      ]} />
      <ProgressBar lessonPrefix="lesson6-" total={2} />
      <Cgroups />
      <CgroupDemo />

      {/* ===================== LESSON 7: CONTAINER IMAGES ===================== */}
      <LessonDivider lesson={7} title="Container Images" id="lesson-7" />
      <LessonObjectives objectives={[
        "Explain how image layers and union filesystems (OverlayFS) work",
        "Understand layer caching for build optimization",
        "Pull images from registries and inspect their layers",
      ]} />
      <ProgressBar lessonPrefix="lesson7-" total={3} />
      <ImageLayers />
      <Registries />

      {/* ===================== LESSON 8: DOCKER ARCHITECTURE ===================== */}
      <LessonDivider lesson={8} title="Docker Architecture" id="lesson-8" />
      <LessonObjectives objectives={[
        "Trace a docker run command through the entire stack: CLI → dockerd → containerd → runc",
        "Identify each component's role in the Docker architecture",
      ]} />
      <ProgressBar lessonPrefix="lesson8-" total={2} />
      <DockerArch />
      <DockerObjects />

      {/* ===================== LESSON 9: DOCKERFILE ===================== */}
      <LessonDivider lesson={9} title="Dockerfile" id="lesson-9" />
      <LessonObjectives objectives={[
        "Write a production-ready Dockerfile using key instructions (FROM, RUN, COPY, CMD, ENTRYPOINT)",
        "Use multi-stage builds to dramatically reduce image size",
      ]} />
      <ProgressBar lessonPrefix="lesson9-" total={2} />
      <DockerfileBasics />
      <MultiStage />

      {/* ===================== LESSON 10: DOCKER NETWORKING ===================== */}
      <LessonDivider lesson={10} title="Docker Networking" id="lesson-10" />
      <LessonObjectives objectives={[
        "Explain how Docker bridge networking works with veth pairs and iptables",
        "Configure port mapping with the -p flag",
        "Use custom bridge networks for DNS-based service discovery",
      ]} />
      <ProgressBar lessonPrefix="lesson10-" total={3} />
      <NetworkTypes />
      <PortMapping />
      <Dns />

      {/* ===================== LESSON 11: DOCKER STORAGE ===================== */}
      <LessonDivider lesson={11} title="Docker Storage" id="lesson-11" />
      <LessonObjectives objectives={[
        "Choose the right storage type (volumes, bind mounts, tmpfs) for a given use case",
        "Explain why volumes survive container removal and how to manage them",
      ]} />
      <ProgressBar lessonPrefix="lesson11-" total={2} />
      <StorageTypes />
      <Volumes />

      {/* ===================== LESSON 12: DOCKER COMPOSE ===================== */}
      <LessonDivider lesson={12} title="Docker Compose" id="lesson-12" />
      <LessonObjectives objectives={[
        "Write a docker-compose.yml for a multi-service application",
        "Manage the container lifecycle with Compose commands (up, down, build, logs)",
        "Apply common Compose patterns for production-ready applications",
      ]} />
      <ProgressBar lessonPrefix="lesson12-" total={2} />
      <ComposeBasics />
      <ComposePatterns />
    </div>
  );
}
