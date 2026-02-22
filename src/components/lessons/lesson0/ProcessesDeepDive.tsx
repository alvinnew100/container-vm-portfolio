"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";
import InfoCard from "@/components/story/InfoCard";

interface ProcNode {
  pid: number;
  name: string;
  children?: ProcNode[];
}

const PROCESS_TREE: ProcNode = {
  pid: 1,
  name: "init/systemd",
  children: [
    {
      pid: 100,
      name: "sshd",
      children: [
        { pid: 1200, name: "bash" },
      ],
    },
    {
      pid: 200,
      name: "nginx",
      children: [
        { pid: 201, name: "nginx worker" },
        { pid: 202, name: "nginx worker" },
      ],
    },
    {
      pid: 300,
      name: "postgres",
      children: [
        { pid: 301, name: "postgres writer" },
      ],
    },
  ],
};

function ProcessNode({
  node,
  depth,
  index,
  isInView,
}: {
  node: ProcNode;
  depth: number;
  index: number;
  isInView: boolean;
}) {
  const delay = depth * 0.2 + index * 0.08;
  const isRoot = depth === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.35 }}
      className={depth > 0 ? "ml-6 border-l border-white/10 pl-3" : ""}
    >
      <div className="flex items-center gap-2 py-1.5">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
          isRoot ? "bg-docker-blue" : depth === 1 ? "bg-docker-teal" : "bg-docker-violet/60"
        }`} />
        <span className={`font-mono text-xs ${isRoot ? "text-docker-blue font-bold" : "text-white/70"}`}>
          PID {node.pid}
        </span>
        <span className="text-white/40 text-xs">{node.name}</span>
        {isRoot && (
          <span className="text-[8px] text-docker-blue/60 font-mono bg-docker-blue/10 px-1.5 py-0.5 rounded ml-1">
            parent of all
          </span>
        )}
      </div>
      {node.children?.map((child, i) => (
        <ProcessNode
          key={child.pid}
          node={child}
          depth={depth + 1}
          index={index + i}
          isInView={isInView}
        />
      ))}
    </motion.div>
  );
}

function ProcessTreeDiagram() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Process Tree
      </h4>

      <div className="bg-story-dark rounded-xl p-5">
        <ProcessNode node={PROCESS_TREE} depth={0} index={0} isInView={isInView} />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="text-text-muted text-xs text-center mt-4"
      >
        Every process has a parent. PID 1 is the ancestor of all user processes.
      </motion.p>
    </div>
  );
}

export default function ProcessesDeepDive() {
  return (
    <SectionWrapper id="sec-processes" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Processes: The Building Blocks
      </h3>

      <p className="text-text-secondary leading-relaxed mb-6">
        A{" "}
        <TermDefinition term="process" definition="a running instance of a program — when you open a browser, that's a process; open two browsers, that's two processes" />{" "}
        is the fundamental unit of work in an operating system. Every running program — your
        web browser, a database, a terminal — is a process. And here&apos;s the key insight:
      </p>

      <div className="bg-docker-blue/5 border border-docker-blue/20 rounded-xl p-5 mb-6">
        <p className="text-docker-blue font-semibold text-sm mb-1">The Big Reveal</p>
        <p className="text-text-secondary text-sm leading-relaxed">
          A container <strong className="text-text-primary">IS</strong> a process with special restrictions.
          Understand processes, and you understand 80% of containers. That&apos;s why we&apos;re
          covering this now.
        </p>
      </div>

      <AnalogyCard
        concept="Processes Are Like Workers in an Office"
        analogy="Each worker (process) has their own desk (memory), an employee ID (PID), and a manager (parent process). PID 1 is the CEO — it starts when the company opens and is the last to leave. When a worker quits (exits), their manager is notified."
      />

      <div className="mt-8">
        <ProcessTreeDiagram />
      </div>

      <div className="space-y-4 mb-8">
        <p className="text-text-secondary leading-relaxed">
          Every process gets a{" "}
          <TermDefinition term="PID" definition="Process ID — a unique number the kernel assigns to each running process" />.
          The most important process is{" "}
          <TermDefinition term="PID 1" definition="the first process started by the kernel (usually init or systemd) — it's the ancestor of all other processes and handles cleanup when child processes exit" />,
          which starts during boot and manages all other processes.
        </p>

        <p className="text-text-secondary leading-relaxed">
          Processes are created using{" "}
          <TermDefinition term="fork" definition="a system call that creates a copy of the current process — the child starts as a clone of the parent" />{" "}
          and{" "}
          <TermDefinition term="exec" definition="a system call that replaces the current process's program with a new one — fork creates the copy, exec loads the new code" />.
          When you type <code>ls</code> in a terminal, your shell <em>forks</em> a copy of itself,
          then the copy <em>execs</em> the <code>ls</code> program.
        </p>

        <p className="text-text-secondary leading-relaxed">
          Each process &ldquo;owns&rdquo; resources: its own memory space, open file handles,
          network connections, and environment variables. The kernel tracks all of this. When a container
          starts, it&apos;s really just a process whose resource ownership is carefully restricted using
          namespaces (Lesson 5) and cgroups (Lesson 6).
        </p>
      </div>

      <InfoCard variant="tip" title="Containers = Restricted Processes">
        In Lesson 5, you&apos;ll see that a container&apos;s &ldquo;PID 1&rdquo; thinks it&apos;s the first
        process in the system — but it&apos;s actually just a regular process on the host with
        a PID namespace that makes it <em>appear</em> to be PID 1. Same process, different view.
      </InfoCard>
    </SectionWrapper>
  );
}
