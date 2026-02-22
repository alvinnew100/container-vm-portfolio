export default function StoryFooter() {
  return (
    <footer className="border-t border-story-border py-16 px-4 bg-story-surface">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-text-muted text-sm">
          Container &amp; VM Fundamentals &mdash; An interactive guide to virtualization and containerization
        </p>
        <p className="text-text-muted text-xs mt-2">
          Built with Next.js. References:{" "}
          <a
            href="https://docs.docker.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-docker-blue hover:underline"
          >
            Docker Documentation
          </a>
          {" | "}
          <a
            href="https://man7.org/linux/man-pages/man7/namespaces.7.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-docker-blue hover:underline"
          >
            Linux Namespaces
          </a>
          {" | "}
          <a
            href="https://wizardzines.com/zines/containers/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-docker-violet hover:underline"
          >
            &ldquo;How Containers Work&rdquo; by Julia Evans
          </a>
        </p>
      </div>
    </footer>
  );
}
