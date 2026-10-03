import Link from "next/link";

import TagSEO from "@/components/TagSEO";

export default function JoinPageShell({
  title,
  description,
  canonicalSlug,
  metadata,
  backHref = "/join",
  backLabel = "Back to Join",
  steps = [],
  badge,
  progress,
  children,
}) {
  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <TagSEO metadataProp={metadata} canonicalSlug={canonicalSlug} />

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body gap-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-base-content">{title}</h1>
              <Link href={backHref} className="btn btn-sm btn-ghost">{backLabel}</Link>
            </div>
            {description ? <p className="text-base-content/70">{description}</p> : null}
          </div>
        </div>

        {steps.length > 0 ? (
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body gap-3">
              <div className="flex gap-2 flex-wrap items-center">
                {steps.map((step) => {
                  const stateClass = step.isActive
                    ? "btn-primary"
                    : step.isWarning
                      ? "btn-warning btn-outline animate-pulse"
                      : "btn-outline";

                  return (
                    <Link
                      key={`${step.href}-${step.label}`}
                      href={step.href}
                      className={`btn btn-sm ${stateClass}`}
                    >
                      {step.label}
                    </Link>
                  );
                })}
                {badge ? <span className="badge badge-info">{badge}</span> : null}
              </div>

              {typeof progress === "number" ? (
                <>
                  <progress className="progress progress-primary w-full" value={progress} max="100" />
                  <div className="text-xs text-base-content/70">{progress}% complete</div>
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
}
