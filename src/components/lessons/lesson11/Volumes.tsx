"use client";

import SectionWrapper from "@/components/story/SectionWrapper";
import TerminalBlock from "@/components/story/TerminalBlock";
import InfoCard from "@/components/story/InfoCard";

export default function Volumes() {
  return (
    <SectionWrapper id="sec-volumes" className="max-w-4xl mx-auto px-4 py-16">
      <h3 className="text-2xl font-bold text-text-primary mb-6">
        Working with Volumes
      </h3>
      <p className="text-text-secondary leading-relaxed mb-6">
        Volumes are the preferred mechanism for persisting data in Docker. They&apos;re managed by the Docker
        daemon, work on both Linux and Windows, and can be safely shared among multiple containers.
      </p>

      <div className="space-y-6 mb-8">
        <TerminalBlock
          title="volume operations"
          lines={[
            "# Create a named volume",
            "$ docker volume create pgdata",
            "",
            "# Run PostgreSQL with persistent storage",
            "$ docker run -d --name postgres \\",
            "    -v pgdata:/var/lib/postgresql/data \\",
            "    -e POSTGRES_PASSWORD=secret \\",
            "    postgres:16",
            "",
            "# The data persists even if we remove the container",
            "$ docker rm -f postgres",
            "$ docker run -d --name postgres-new \\",
            "    -v pgdata:/var/lib/postgresql/data \\",
            "    -e POSTGRES_PASSWORD=secret \\",
            "    postgres:16",
            "# All databases and tables are still there!",
          ]}
        />

        <TerminalBlock
          title="volume management"
          lines={[
            "# List all volumes",
            "$ docker volume ls",
            "DRIVER    VOLUME NAME",
            "local     pgdata",
            "local     redis-data",
            "",
            "# Inspect a volume",
            "$ docker volume inspect pgdata",
            '[{"Name":"pgdata","Mountpoint":"/var/lib/docker/volumes/pgdata/_data",...}]',
            "",
            "# Remove unused volumes (dangling)",
            "$ docker volume prune",
            "WARNING! This will remove all local volumes not used by at least one container.",
            "",
            "# Backup a volume",
            "$ docker run --rm -v pgdata:/data -v $(pwd):/backup alpine \\",
            "    tar czf /backup/pgdata-backup.tar.gz -C /data .",
          ]}
        />
      </div>

      <InfoCard variant="warning" title="Volumes Survive Container Removal">
        When you <code>docker rm</code> a container, its volumes are NOT removed by default.
        Use <code>docker rm -v</code> to remove a container AND its anonymous volumes.
        Named volumes are never auto-removed — you must explicitly use <code>docker volume rm</code>.
        Run <code>docker volume prune</code> periodically to clean up unused volumes.
      </InfoCard>
    </SectionWrapper>
  );
}
