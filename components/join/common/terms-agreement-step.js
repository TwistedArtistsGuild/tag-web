import Link from "next/link"
import { useState } from "react"

import { sanitizeDefaultHtml } from "@/components/security/sanitize"

export default function TermsAgreementStep({
  title = "Step 1: Terms and Conditions",
  description = "Review the terms and continue when accepted.",
  termsContent,
  onAccepted,
  backHref = "/join",
  backLabel = "Back to Join",
  continueLabel = "Accept and Continue",
}) {
  const [hasReachedBottom, setHasReachedBottom] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const handleScroll = (event) => {
    const element = event.currentTarget
    const reachedBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 8

    if (reachedBottom) {
      setHasReachedBottom(true)
    }
  }

  return (
    <section className="card bg-base-100 shadow border border-base-300">
      <div className="card-body gap-4">
        <div>
          <h2 className="card-title">{title}</h2>
          <p className="text-sm text-base-content/70">{description}</p>
        </div>

        <div
          className="max-h-80 overflow-y-auto rounded-box border border-base-300 bg-base-200/60 p-4 prose prose-sm max-w-none"
          onScroll={handleScroll}
        >
          <div dangerouslySetInnerHTML={{ __html: sanitizeDefaultHtml(termsContent) }} />
        </div>

        <label className="form-control">
          <div className="label cursor-pointer gap-3 justify-start">
            <input
              type="checkbox"
              className="checkbox"
              checked={agreed}
              disabled={!hasReachedBottom}
              onChange={(event) => setAgreed(event.target.checked)}
            />
            <span className="label-text">I have reviewed and accept the terms</span>
          </div>
        </label>

        <div className="flex gap-2 justify-end flex-wrap">
          <Link href={backHref} className="btn btn-sm btn-outline">{backLabel}</Link>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            disabled={!agreed}
            onClick={onAccepted}
          >
            {continueLabel}
          </button>
        </div>
      </div>
    </section>
  )
}
