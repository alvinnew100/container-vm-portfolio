import type { Metadata } from "next";
import { StoryProvider } from "@/context/StoryContext";
import StoryNav from "@/components/layout/StoryNav";
import StoryFooter from "@/components/layout/StoryFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Container & VM Fundamentals — An Interactive Deep Dive",
  description:
    "A single flowing story that takes you from bare-metal servers through VMs, Linux namespaces, cgroups, and Docker. Interactive diagrams, code examples, and 12 lessons covering everything from hypervisors to Docker Compose.",
  keywords: [
    "Docker",
    "containers",
    "virtual machines",
    "VMs",
    "namespaces",
    "cgroups",
    "Dockerfile",
    "Docker Compose",
    "containerization",
    "virtualization",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <StoryProvider>
          <StoryNav />
          <main className="lg:pl-52">{children}</main>
          <StoryFooter />
        </StoryProvider>
      </body>
    </html>
  );
}
