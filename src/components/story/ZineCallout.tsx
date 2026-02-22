interface ZineCalloutProps {
  page: string;
  topic: string;
}

export default function ZineCallout({ page, topic }: ZineCalloutProps) {
  return (
    <div className="bg-docker-violet/5 border border-docker-violet/20 rounded-xl p-4 flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-docker-violet/10 flex items-center justify-center">
        <svg className="w-4 h-4 text-docker-violet" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-docker-violet font-semibold text-xs mb-0.5">
          Zine Reference &mdash; p.{page}
        </div>
        <p className="text-text-secondary text-xs leading-relaxed">
          This section draws from <em>&ldquo;How Containers Work&rdquo;</em> by Julia Evans ({topic}).{" "}
          <a
            href="https://wizardzines.com/zines/containers/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-docker-violet hover:underline font-medium"
          >
            Get the zine at wizardzines.com
          </a>
        </p>
      </div>
    </div>
  );
}
