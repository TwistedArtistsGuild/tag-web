import Link from "next/link"
import { useState } from "react"

import TagSEO from "@/components/TagSEO"
import getApiURL from "@/components/widgets/GetApiURL"
import { getMarkdownContent } from "@/components/widgets/markdown"
import { sanitizeDefaultHtml } from "@/components/security/sanitize"

import Registration1 from "./registration1"
import { Registration2Notes } from "./registration2"

const ARTIST_PAGES = [
  {
    slug: "registration1",
    formName: "ArtistForm1",
    title: "Artist Registration 1",
    description: "Initial artist registration and profile setup form.",
    route: "/join/artist/registration1",
    kind: "dynaform",
  },
  {
    slug: "registration2",
    title: "Artist Registration 2",
    description: "Planning notes for business entity type, category, genre, existing DB fields, and profile picture upload.",
    route: "/join/artist/registration2",
    kind: "notes",
  },
]

const FORM_COMPONENTS = {
  registration1: Registration1,
  registration2: Registration2Notes,
}

async function fetchFormMetadata(apiUrl, formName) {
  let response = await fetch(`${apiUrl}formsmetadata/${formName}`)

  if (!response.ok) {
    response = await fetch(`${apiUrl}forms_metadata/${formName}`)
  }

  if (!response.ok) {
    return null
  }

  return response.json()
}

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

export default function JoinArtistIndexPage({ metadataBySlug, termsContent }) {
  const pageMetaData = {
    title: "Join Artist",
    description: "Artist onboarding and registration forms.",
    keywords: "join, artist, registration",
    robots: "noindex, nofollow",
    og: {
      title: "Join Artist",
      description: "Artist onboarding and registration forms.",
    },
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="join/artist" />

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body gap-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-base-content">Join as an Artist</h1>
              <Link href="/join" className="btn btn-sm btn-ghost">Back to Join</Link>
            </div>
            <p className="text-base-content/70">
              This folder hosts artist onboarding pages. Dynaform-backed and notes-only registration pages are listed below, with embedded content at the bottom.
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body gap-3">
            <h2 className="text-lg font-semibold text-base-content">Available Registration Pages</h2>
            <div className="space-y-3">
              {ARTIST_PAGES.map((form) => (
                <div key={form.slug} className="rounded-box border border-base-300 bg-base-200/60 p-4 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-medium text-base-content">{form.title}</div>
                    <p className="text-sm text-base-content/70">{form.description}</p>
                    <div className="pt-2">
                      <span className={`badge ${form.kind === "dynaform" ? "badge-outline" : "badge-ghost"}`}>
                        {form.kind === "dynaform" ? "Dynaform" : "Notes only"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Link href={form.route} className="btn btn-sm btn-outline">Open standalone page</Link>
                    <a href={`#${form.slug}`} className="btn btn-sm btn-primary">Jump to embedded section</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {ARTIST_PAGES.map((form) => {
            const FormComponent = FORM_COMPONENTS[form.slug]
            const metadata = metadataBySlug?.[form.slug] || null

            return (
              <section key={form.slug} id={form.slug} className="card bg-base-100 shadow border border-base-300 scroll-mt-24">
                <div className="card-body gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-base-content">{form.title}</h2>
                    <p className="text-sm text-base-content/70">{form.description}</p>
                  </div>
                  {form.kind === "dynaform" ? <FormComponent metadataProp={metadata} /> : <FormComponent />}
                </div>
              </section>
            )
          })}
        </div>

        <TermsAgreementStep termsContent={termsContent} />
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const apiUrl = getApiURL()
  const metadataBySlug = {}
  const termsContent = await getMarkdownContent("content/tos.md")

  for (const form of ARTIST_PAGES.filter((entry) => entry.formName)) {
    try {
      metadataBySlug[form.slug] = await fetchFormMetadata(apiUrl, form.formName)
    } catch (error) {
      console.error(`Unable to load form metadata for ${form.formName}:`, error.message)
      metadataBySlug[form.slug] = null
    }
  }

  return {
    props: {
      metadataBySlug,
      termsContent,
    },
  }
}

