"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "@/components/story/SectionWrapper";
import AnalogyCard from "@/components/story/AnalogyCard";
import TermDefinition from "@/components/story/TermDefinition";
import InfoCard from "@/components/story/InfoCard";

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

const FILE_TREE: TreeNode = {
  name: "/",
  children: [
    {
      name: "bin",
      children: [{ name: "ls" }, { name: "cat" }, { name: "bash" }],
    },
    {
      name: "etc",
      children: [{ name: "hosts" }, { name: "passwd" }],
    },
    {
      name: "home",
      children: [
        { name: "user", children: [{ name: "documents" }, { name: "code" }] },
      ],
    },
    {
      name: "var",
      children: [{ name: "log" }, { name: "lib" }],
    },
  ],
};

function TreeNodeComponent({
  node,
  depth,
  index,
  isInView,
}: {
  node: TreeNode;
  depth: number;
  index: number;
  isInView: boolean;
}) {
  const globalDelay = depth * 0.15 + index * 0.06;
  const isRoot = depth === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: globalDelay, duration: 0.35 }}
      className={depth > 0 ? "ml-5 border-l border-story-border pl-3" : ""}
    >
      <div className="flex items-center gap-2 py-1">
        <span className={`text-xs font-mono ${isRoot ? "text-docker-blue font-bold" : node.children ? "text-docker-teal" : "text-text-secondary"}`}>
          {node.children ? (isRoot ? "/" : `${node.name}/`) : node.name}
        </span>
        {isRoot && (
          <span className="text-[9px] text-text-muted font-mono bg-story-surface px-1.5 py-0.5 rounded">
            root directory
          </span>
        )}
      </div>
      {node.children?.map((child, i) => (
        <TreeNodeComponent
          key={child.name}
          node={child}
          depth={depth + 1}
          index={index + i}
          isInView={isInView}
        />
      ))}
    </motion.div>
  );
}

function DirectoryTreeDiagram() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="bg-story-card rounded-2xl p-6 sm:p-8 border border-story-border card-shadow mb-8">
      <h4 className="text-sm font-mono text-docker-blue uppercase tracking-wider mb-6 text-center">
        Linux Directory Tree
      </h4>

      <div className="bg-story-dark rounded-xl p-5 font-mono text-sm">
        <TreeNodeComponent node={FILE_TREE} depth={0} index={0} isInView={isInView} />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="text-text-muted text-xs text-center mt-4"
      >
        Everything in Linux starts from the root directory <code>/</code> and branches into subdirectories
      </motion.p>
    </div>
  );
}

export default function FilesystemBasics() {
  return (
    <SectionWrapper id="sec-filesystem" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Filesystems: How Data Is Organized
      </h3>

      <p className="text-text-secondary leading-relaxed mb-6">
        A{" "}
        <TermDefinition term="filesystem" definition="the system that organizes files and directories on a storage device — it decides how data is named, stored, and retrieved" />{" "}
        gives structure to your disk. Without one, your disk would just be a sea of raw bytes
        with no way to find anything.
      </p>

      <AnalogyCard
        concept="A Filesystem Is a Filing Cabinet"
        analogy="Folders are the drawers, files are the documents inside. The path '/home/user/documents/report.pdf' is like saying 'Go to the filing cabinet, open the Home drawer, then the User folder, then Documents, and grab report.pdf.'"
      />

      <div className="mt-8">
        <DirectoryTreeDiagram />
      </div>

      <div className="space-y-4 mb-8">
        <p className="text-text-secondary leading-relaxed">
          A{" "}
          <TermDefinition term="path" definition="the address of a file, like /home/user/file.txt — each '/' separates a directory level" />{" "}
          tells the OS exactly where a file lives. In Linux, everything is organized under a single
          root directory <code>/</code>, unlike Windows which uses drive letters (C:\, D:\).
        </p>

        <p className="text-text-secondary leading-relaxed">
          <TermDefinition term="Mounting" definition="attaching a storage device or filesystem to a specific directory, making its contents accessible at that path" />{" "}
          is a critical concept for containers. When you plug in a USB drive on Linux,
          the OS &ldquo;mounts&rdquo; it at a path like <code>/mnt/usb</code> — now the USB&apos;s files
          appear as part of the main directory tree.
        </p>

        <p className="text-text-secondary leading-relaxed">
          Containers use mounting extensively: each container gets its own filesystem
          view by mounting a fresh set of directories. The container sees <code>/</code> as its root,
          but the host knows it&apos;s actually a subdirectory. This trick — giving each container
          its own filesystem — is one of the building blocks of isolation (covered in Lesson 5).
        </p>
      </div>

      <InfoCard variant="tip" title="Preview: Container Filesystems">
        In Lesson 5, you&apos;ll learn about <code>pivot_root</code> — the system call that gives a container its
        own root filesystem. In Lesson 7, you&apos;ll learn how container images use <em>layered filesystems</em> to
        share base files efficiently. Mounting is the foundation for both.
      </InfoCard>
    </SectionWrapper>
  );
}
