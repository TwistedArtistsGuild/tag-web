import RegisterSlug from "@/components/forms/onboarding/register-slug"

export default function OrganizationSlugReservationStep({
  context,
  entityLabel,
  apiBaseUrl,
  reservedId,
  reservedSlug,
  buildJoinHref,
  clearProgress,
  getProgress,
  setProgress,
  markStepComplete,
}) {
  return (
    <div className="space-y-3">
      {reservedId > 0 ? (
        <div className="rounded-box border border-base-300 bg-base-200/40 p-3 text-sm space-y-2">
          <div className="font-semibold">Existing {context} registration found</div>
          <div className="text-base-content/70">
            ID: {reservedId}
            {reservedSlug ? ` | Slug: ${reservedSlug}` : ""}
          </div>
          <div className="flex flex-wrap gap-2">
            {reservedSlug ? (
              <a className="btn btn-sm btn-outline" href={buildJoinHref(3, reservedSlug, reservedId)}>
                Continue Existing {entityLabel} Registration
              </a>
            ) : null}
            <button
              type="button"
              className="btn btn-sm btn-error btn-outline"
              onClick={() => {
                clearProgress()
                window.location.href = buildJoinHref(2)
              }}
            >
              Start New {entityLabel} Registration
            </button>
          </div>
        </div>
      ) : null}

      <RegisterSlug
        domain={context}
        domainLabel={entityLabel}
        apiBaseUrl={apiBaseUrl}
        reserveEndpoint={`${apiBaseUrl}${context}/reserve-slug`}
        updateEndpoint={(id) => `${apiBaseUrl}${context}/${id}/update-slug`}
        checkEndpoint={(candidateSlug, currentId) => `${apiBaseUrl}${context}/check-slug/${encodeURIComponent(candidateSlug)}${currentId ? `?excludeId=${encodeURIComponent(currentId)}` : ""}`}
        nextRoute={(id) => {
          const nextProgress = getProgress?.() || {}
          return buildJoinHref(3, nextProgress.slug, id)
        }}
        progressApi={{
          getProgress,
          setProgress,
          markStepComplete,
        }}
        titleFieldLabel={`${entityLabel} Display Name`}
        titlePlaceholder={`Enter ${context} name`}
        slugDescription={`${entityLabel} slug creates a dedicated ${context} workspace URL.`}
      />
    </div>
  )
}
