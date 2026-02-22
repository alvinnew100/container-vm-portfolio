"use client";

import LessonDivider from "@/components/story/LessonDivider";
import LessonObjectives from "@/components/story/LessonObjectives";

// Hero
import Hero from "@/components/lessons/lesson1/Hero";

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

      {/* ===================== LESSON 1: WHY VIRTUALIZATION? ===================== */}
      <LessonDivider lesson={1} title="Why Virtualization?" id="lesson-1" />
      <LessonObjectives objectives={[
        "Understand why isolation matters for running multiple applications",
        "Explain the evolution from physical servers to VMs to containers",
      ]} />
      <WhyVirtualization />

      {/* ===================== LESSON 2: VIRTUAL MACHINES ===================== */}
      <LessonDivider lesson={2} title="Virtual Machines" id="lesson-2" />
      <LessonObjectives objectives={[
        "Distinguish Type 1 (bare-metal) vs Type 2 (hosted) hypervisors",
        "Describe VM components: vCPU, vRAM, vNIC, vDisk",
        "Understand the VM lifecycle: create, start, snapshot, migrate, destroy",
      ]} />
      <VmArchitecture />
      <Hypervisors />

      {/* ===================== LESSON 3: VM INTERNALS ===================== */}
      <LessonDivider lesson={3} title="VM Internals" id="lesson-3" />
      <LessonObjectives objectives={[
        "Explain how hardware-assisted CPU virtualization (VT-x/AMD-V) works",
        "Compare shadow page tables with EPT/NPT for memory virtualization",
        "Compare I/O virtualization approaches: emulation, paravirtual (virtio), SR-IOV",
      ]} />
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
      <Comparison />
      <Tradeoffs />

      {/* ===================== LESSON 5: LINUX NAMESPACES ===================== */}
      <LessonDivider lesson={5} title="Linux Namespaces" id="lesson-5" />
      <LessonObjectives objectives={[
        "Name all 7 namespace types and explain what each isolates",
        "Demonstrate creating a namespace with unshare and entering one with nsenter",
      ]} />
      <Namespaces />
      <NsDemo />

      {/* ===================== LESSON 6: CGROUPS ===================== */}
      <LessonDivider lesson={6} title="Cgroups — Resource Control" id="lesson-6" />
      <LessonObjectives objectives={[
        "Explain how cgroups limit CPU and memory for groups of processes",
        "Distinguish cgroup v1 (per-controller hierarchy) from v2 (unified hierarchy)",
      ]} />
      <Cgroups />
      <CgroupDemo />

      {/* ===================== LESSON 7: CONTAINER IMAGES ===================== */}
      <LessonDivider lesson={7} title="Container Images" id="lesson-7" />
      <LessonObjectives objectives={[
        "Explain how image layers and union filesystems (OverlayFS) work",
        "Understand layer caching for build optimization",
        "Pull images from registries and inspect their layers",
      ]} />
      <ImageLayers />
      <Registries />

      {/* ===================== LESSON 8: DOCKER ARCHITECTURE ===================== */}
      <LessonDivider lesson={8} title="Docker Architecture" id="lesson-8" />
      <LessonObjectives objectives={[
        "Trace a docker run command through the entire stack: CLI → dockerd → containerd → runc",
        "Identify each component's role in the Docker architecture",
      ]} />
      <DockerArch />
      <DockerObjects />

      {/* ===================== LESSON 9: DOCKERFILE ===================== */}
      <LessonDivider lesson={9} title="Dockerfile" id="lesson-9" />
      <LessonObjectives objectives={[
        "Write a production-ready Dockerfile using key instructions (FROM, RUN, COPY, CMD, ENTRYPOINT)",
        "Use multi-stage builds to dramatically reduce image size",
      ]} />
      <DockerfileBasics />
      <MultiStage />

      {/* ===================== LESSON 10: DOCKER NETWORKING ===================== */}
      <LessonDivider lesson={10} title="Docker Networking" id="lesson-10" />
      <LessonObjectives objectives={[
        "Explain how Docker bridge networking works with veth pairs and iptables",
        "Configure port mapping with the -p flag",
        "Use custom bridge networks for DNS-based service discovery",
      ]} />
      <NetworkTypes />
      <PortMapping />
      <Dns />

      {/* ===================== LESSON 11: DOCKER STORAGE ===================== */}
      <LessonDivider lesson={11} title="Docker Storage" id="lesson-11" />
      <LessonObjectives objectives={[
        "Choose the right storage type (volumes, bind mounts, tmpfs) for a given use case",
        "Explain why volumes survive container removal and how to manage them",
      ]} />
      <StorageTypes />
      <Volumes />

      {/* ===================== LESSON 12: DOCKER COMPOSE ===================== */}
      <LessonDivider lesson={12} title="Docker Compose" id="lesson-12" />
      <LessonObjectives objectives={[
        "Write a docker-compose.yml for a multi-service application",
        "Manage the container lifecycle with Compose commands (up, down, build, logs)",
        "Apply common Compose patterns for production-ready applications",
      ]} />
      <ComposeBasics />
      <ComposePatterns />
    </div>
  );
}
