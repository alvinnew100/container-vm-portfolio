"use client";

import { useState, useEffect, useCallback } from "react";

interface NavItem {
  id: string;
  label: string;
  isLesson?: boolean;
  lessonNum?: number;
  lessonIndex?: number;
}

const NAV_ITEMS: NavItem[] = [
  // Lesson 1: Why Virtualization?
  { id: "lesson-1", label: "Why Virtualization?", isLesson: true, lessonNum: 1, lessonIndex: 0 },
  { id: "sec-why-isolation", label: "Isolation", lessonIndex: 0 },
  { id: "sec-history", label: "History", lessonIndex: 0 },

  // Lesson 2: Virtual Machines
  { id: "lesson-2", label: "Virtual Machines", isLesson: true, lessonNum: 2, lessonIndex: 1 },
  { id: "sec-vm-arch", label: "VM Architecture", lessonIndex: 1 },
  { id: "sec-hypervisors", label: "Hypervisors", lessonIndex: 1 },

  // Lesson 3: VM Internals
  { id: "lesson-3", label: "VM Internals", isLesson: true, lessonNum: 3, lessonIndex: 2 },
  { id: "sec-cpu-virt", label: "CPU Virtualization", lessonIndex: 2 },
  { id: "sec-mem-virt", label: "Memory Virt.", lessonIndex: 2 },
  { id: "sec-io-virt", label: "I/O Virtualization", lessonIndex: 2 },

  // Lesson 4: Containers vs VMs
  { id: "lesson-4", label: "Containers vs VMs", isLesson: true, lessonNum: 4, lessonIndex: 3 },
  { id: "sec-comparison", label: "Comparison", lessonIndex: 3 },
  { id: "sec-tradeoffs", label: "Tradeoffs", lessonIndex: 3 },

  // Lesson 5: Linux Namespaces
  { id: "lesson-5", label: "Namespaces", isLesson: true, lessonNum: 5, lessonIndex: 4 },
  { id: "sec-namespaces", label: "7 NS Types", lessonIndex: 4 },
  { id: "sec-ns-demo", label: "NS Demo", lessonIndex: 4 },

  // Lesson 6: Cgroups
  { id: "lesson-6", label: "Cgroups", isLesson: true, lessonNum: 6, lessonIndex: 5 },
  { id: "sec-cgroups", label: "Resource Control", lessonIndex: 5 },
  { id: "sec-cgroup-demo", label: "Cgroup Demo", lessonIndex: 5 },

  // Lesson 7: Container Images
  { id: "lesson-7", label: "Container Images", isLesson: true, lessonNum: 7, lessonIndex: 6 },
  { id: "sec-layers", label: "Image Layers", lessonIndex: 6 },
  { id: "sec-registries", label: "Registries", lessonIndex: 6 },

  // Lesson 8: Docker Architecture
  { id: "lesson-8", label: "Docker Architecture", isLesson: true, lessonNum: 8, lessonIndex: 7 },
  { id: "sec-docker-arch", label: "Architecture", lessonIndex: 7 },
  { id: "sec-docker-objects", label: "Docker Objects", lessonIndex: 7 },

  // Lesson 9: Dockerfile
  { id: "lesson-9", label: "Dockerfile", isLesson: true, lessonNum: 9, lessonIndex: 8 },
  { id: "sec-dockerfile-basics", label: "Instructions", lessonIndex: 8 },
  { id: "sec-multistage", label: "Multi-stage", lessonIndex: 8 },

  // Lesson 10: Docker Networking
  { id: "lesson-10", label: "Networking", isLesson: true, lessonNum: 10, lessonIndex: 9 },
  { id: "sec-network-types", label: "Network Types", lessonIndex: 9 },
  { id: "sec-port-mapping", label: "Port Mapping", lessonIndex: 9 },
  { id: "sec-dns", label: "DNS", lessonIndex: 9 },

  // Lesson 11: Docker Storage
  { id: "lesson-11", label: "Storage", isLesson: true, lessonNum: 11, lessonIndex: 10 },
  { id: "sec-storage-types", label: "Storage Types", lessonIndex: 10 },
  { id: "sec-volumes", label: "Volumes", lessonIndex: 10 },

  // Lesson 12: Docker Compose
  { id: "lesson-12", label: "Docker Compose", isLesson: true, lessonNum: 12, lessonIndex: 11 },
  { id: "sec-compose-basics", label: "Compose Basics", lessonIndex: 11 },
  { id: "sec-compose-patterns", label: "Patterns", lessonIndex: 11 },
];

export default function StoryNav() {
  const [activeId, setActiveId] = useState("lesson-1");
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = NAV_ITEMS.find((n) => n.id === activeId);
  const activeLessonIndex = activeItem?.lessonIndex ?? 0;
  const totalLessons = NAV_ITEMS.filter((n) => n.isLesson).length;

  useEffect(() => {
    const elements: (HTMLElement | null)[] = NAV_ITEMS.map((n) =>
      document.getElementById(n.id)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = elements.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveId(NAV_ITEMS[idx].id);
          }
        }
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );

    elements.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  }, []);

  const visibleItems = NAV_ITEMS.filter(
    (n) => n.isLesson || n.lessonIndex === activeLessonIndex
  );

  return (
    <>
      {/* Desktop: Left sidebar */}
      <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
        <div className="bg-story-card/95 backdrop-blur-md border border-story-border/50 rounded-xl py-3 px-2 shadow-xl shadow-black/10 w-44 max-h-[80vh] overflow-y-auto">
          {visibleItems.map((item) => {
            const isActive = item.id === activeId;
            const isPastLesson =
              item.isLesson && (item.lessonIndex ?? 0) < activeLessonIndex;

            if (item.isLesson) {
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-left transition-colors ${
                    isActive
                      ? "text-docker-blue"
                      : isPastLesson
                      ? "text-text-secondary"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      isActive
                        ? "bg-docker-blue"
                        : isPastLesson
                        ? "bg-docker-blue/40"
                        : "bg-story-border"
                    }`}
                  />
                  <span className="text-[11px] font-semibold truncate">
                    {item.lessonNum}. {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`flex items-center gap-2 w-full pl-5 pr-2 py-1 rounded-lg text-left transition-colors ${
                  isActive
                    ? "text-docker-teal bg-docker-teal/5"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <span
                  className={`w-1 h-1 rounded-full flex-shrink-0 ${
                    isActive ? "bg-docker-teal" : "bg-story-border/50"
                  }`}
                />
                <span className="text-[10px] truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile: Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="h-0.5 bg-story-border">
          <div
            className="h-full bg-docker-blue transition-all duration-300"
            style={{
              width: `${((activeLessonIndex + 1) / totalLessons) * 100}%`,
            }}
          />
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="absolute bottom-4 right-4 bg-story-card border border-story-border rounded-full px-4 py-2 text-xs text-text-secondary font-mono shadow-lg shadow-black/5"
        >
          Lesson {activeLessonIndex + 1} / {totalLessons}
        </button>
      </div>

      {/* Mobile: Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute bottom-16 right-4 bg-story-card border border-story-border rounded-2xl p-3 shadow-xl max-h-[70vh] overflow-y-auto w-52">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`block w-full text-left rounded-lg transition-colors ${
                  item.isLesson
                    ? `px-3 py-2 text-xs font-semibold ${
                        item.id === activeId
                          ? "text-docker-blue bg-docker-blue/5"
                          : "text-text-secondary hover:bg-story-surface"
                      }`
                    : `pl-7 pr-3 py-1.5 text-[11px] ${
                        item.id === activeId
                          ? "text-docker-teal"
                          : "text-text-muted hover:text-text-secondary"
                      }`
                }`}
              >
                {item.isLesson ? `${item.lessonNum}. ${item.label}` : item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
