interface InfoCardProps {
  children: React.ReactNode;
  variant?: "info" | "warning" | "tip" | "note";
  title?: string;
}

const variants = {
  info: {
    border: "border-l-docker-blue",
    bg: "bg-docker-blue/5",
    icon: "i",
    iconBg: "bg-docker-blue/10 text-docker-blue",
  },
  warning: {
    border: "border-l-docker-amber",
    bg: "bg-docker-amber/5",
    icon: "!",
    iconBg: "bg-docker-amber/10 text-docker-amber",
  },
  tip: {
    border: "border-l-docker-teal",
    bg: "bg-docker-teal/5",
    icon: "*",
    iconBg: "bg-docker-teal/10 text-docker-teal",
  },
  note: {
    border: "border-l-docker-violet",
    bg: "bg-docker-violet/5",
    icon: "#",
    iconBg: "bg-docker-violet/10 text-docker-violet",
  },
};

export default function InfoCard({
  children,
  variant = "info",
  title,
}: InfoCardProps) {
  const v = variants[variant];
  return (
    <div className={`rounded-xl border-l-4 ${v.border} ${v.bg} p-5`}>
      <div className="flex gap-3">
        <div
          className={`flex-shrink-0 w-7 h-7 rounded-full ${v.iconBg} flex items-center justify-center text-xs font-bold`}
        >
          {v.icon}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <div className="text-text-primary font-semibold text-sm mb-1">
              {title}
            </div>
          )}
          <div className="text-text-secondary text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
