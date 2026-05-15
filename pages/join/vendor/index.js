import Link from "next/link"
import { useState } from "react"

import TagSEO from "@/components/TagSEO"
import { getMarkdownContent } from "@/components/widgets/markdown"
import { sanitizeDefaultHtml } from "@/components/security/sanitize"

function TermsAgreementStep({ termsContent }) {
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
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-xl font-semibold text-base-content">Final Step: Terms of Service Agreement</h2>
            <p className="text-sm text-base-content/70">
              Review the current terms below. You must scroll to the bottom before you can agree.
            </p>
          </div>
          <Link href="/about/termsofservice" className="btn btn-sm btn-ghost">Open terms page</Link>
        </div>

        <div
          className="max-h-80 overflow-y-auto rounded-box border border-base-300 bg-base-200/60 p-4 prose prose-sm max-w-none"
          onScroll={handleScroll}
        >
          <div dangerouslySetInnerHTML={{ __html: sanitizeDefaultHtml(termsContent) }} />
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm text-base-content/70">
            {agreed
              ? "Terms acknowledged for this session."
              : hasReachedBottom
                ? "You reached the bottom and can now agree."
                : "Scroll to the bottom to enable the Agree button."}
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {agreed && <span className="badge badge-success">Agreed</span>}
            <a href="mailto:admin@twistedartistsguild.com?subject=Terms%20of%20Service%20Disagreement" className="btn btn-sm btn-outline btn-error">
              Disagree
            </a>
            <button type="button" className="btn btn-sm btn-primary" disabled={!hasReachedBottom} onClick={() => setAgreed(true)}>
              Agree
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function JoinVendorIndexPage({ termsContent }) {
  const pageMetaData = {
    title: "Join Vendor",
    description: "Vendor onboarding folder.",
    keywords: "join, vendor, onboarding",
    robots: "noindex, nofollow",
    og: {
      title: "Join Vendor",
      description: "Vendor onboarding folder.",
    },
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="join/vendor" />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body gap-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-base-content">Join as a Vendor</h1>
              <Link href="/join" className="btn btn-sm btn-ghost">Back to Join</Link>
            </div>
            <p className="text-base-content/70">
              This folder is ready for vendor onboarding forms. When dynaform pages are added here, they should be listed and embedded at the bottom of this page.
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body">
            <h2 className="text-lg font-semibold text-base-content">Available Forms</h2>
            <p className="text-sm text-base-content/70">No vendor dynaform pages are published in this directory yet.</p>
          </div>
        </div>

        <TermsAgreementStep termsContent={termsContent} />
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const termsContent = await getMarkdownContent("content/tos.md")

  return {
    props: {
      termsContent,
    },
  }
}

