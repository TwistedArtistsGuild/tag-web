import { useEffect, useState } from "react"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/pages/api/auth/[...nextauth]"
import RegisterSlug from "@/components/forms/onboarding/register-slug"
import JoinPageShell from "@/components/join/common/join-page-shell";
import TermsAgreementStep from "@/components/join/common/terms-agreement-step";
import getApiURL from "@/components/widgets/GetApiURL"
import { getMarkdownContent } from "@/components/widgets/markdown"
import {
  clearVenueRegistrationProgress,
  getVenueRegistrationProgress,
  markVenueRegistrationStepComplete,
  setVenueRegistrationProgress,
} from "@/utils/onboarding/venueWorkflow"

const apiUrl = getApiURL()

function getWizardStep(rawStep) {
  const parsed = Number(rawStep || 1)
  if (parsed === 2) {
    return 2
  }

  return 1
}

function buildVenueJoinHref(step, slug, id) {
  const normalizedSlug = String(slug || "").trim().toLowerCase()
  if (normalizedSlug) {
    const idSegment = id ? `&id=${encodeURIComponent(String(id))}` : ""
    return `/join/venue/${encodeURIComponent(normalizedSlug)}?step=${step}${idSegment}`
  }

  return `/join/venue?step=${step}`
}

export default function JoinVenueIndexPage({ termsContent, currentStep }) {
  const [progress, setProgress] = useState({})

  useEffect(() => {
    setProgress(getVenueRegistrationProgress?.() || {})
  }, [])

  const reservedSlug = String(progress?.slug || "").trim().toLowerCase()
  const reservedId = Number(progress?.entityId || 0)

  const pageMetaData = {
    title: "Join Venue",
    description: "Start venue onboarding with terms and workspace reservation.",
    keywords: "join, venue, onboarding",
    robots: "noindex, nofollow",
    og: {
      title: "Join Venue",
      description: "Start venue onboarding with terms and workspace reservation.",
    },
  }

  return (
    <JoinPageShell
      title="Join as a Venue"
      description="Start with terms and reserve your venue workspace slug."
      canonicalSlug="join/venue"
      metadata={pageMetaData}
      steps={[
        {
          href: "/join/venue?step=1",
          label: "Terms",
          isActive: currentStep === 1,
        },
        {
          href: "/join/venue?step=2",
          label: "Reserve Workspace",
          isActive: currentStep === 2,
        },
      ]}
      badge={reservedId > 0 ? `Venue ID: ${reservedId}` : null}
    >
      {currentStep === 1 ? (
        <TermsAgreementStep
          termsContent={termsContent}
          onAccepted={() => {
            setVenueRegistrationProgress({ tcAccepted: true })
            window.location.href = "/join/venue?step=2"
          }}
          continueLabel="Continue to Workspace Reservation"
        />
      ) : null}

      {currentStep === 2 ? (
        <div className="space-y-3">
          {reservedId > 0 ? (
            <div className="rounded-box border border-base-300 bg-base-200/40 p-3 text-sm space-y-2">
              <div className="font-semibold">Existing venue registration found</div>
              <div className="text-base-content/70">
                ID: {reservedId}
                {reservedSlug ? ` | Slug: ${reservedSlug}` : ""}
              </div>
              <div className="flex flex-wrap gap-2">
                {reservedSlug ? (
                  <a className="btn btn-sm btn-outline" href={buildVenueJoinHref(3, reservedSlug, reservedId)}>
                    Continue Existing Venue Registration
                  </a>
                ) : null}
                <button
                  type="button"
                  className="btn btn-sm btn-error btn-outline"
                  onClick={() => {
                    clearVenueRegistrationProgress()
                    window.location.href = "/join/venue?step=2"
                  }}
                >
                  Start New Venue Registration
                </button>
              </div>
            </div>
          ) : null}

          <RegisterSlug
            domain="venue"
            domainLabel="Venue"
            apiBaseUrl={apiUrl}
            reserveEndpoint={`${apiUrl}venue/reserve-slug`}
            updateEndpoint={(id) => `${apiUrl}venue/${id}/update-slug`}
            checkEndpoint={(candidateSlug, currentId) => `${apiUrl}venue/check-slug/${encodeURIComponent(candidateSlug)}${currentId ? `?excludeId=${encodeURIComponent(currentId)}` : ""}`}
            nextRoute={(id) => {
              const nextProgress = getVenueRegistrationProgress?.() || {}
              return buildVenueJoinHref(3, nextProgress.slug, id)
            }}
            progressApi={{
              getProgress: getVenueRegistrationProgress,
              setProgress: setVenueRegistrationProgress,
              markStepComplete: markVenueRegistrationStepComplete,
            }}
            titleFieldLabel="Venue Display Name"
            titlePlaceholder="Enter venue name"
            slugDescription="Venue slug creates a dedicated venue profile and booking URL." 
          />
        </div>
      ) : null}
    </JoinPageShell>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session?.user?.id) {
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${encodeURIComponent(context.resolvedUrl || "/join/venue")}`,
        permanent: false,
      },
    }
  }

  const termsContent = await getMarkdownContent("content/tos.md")
  const currentStep = getWizardStep(context.query?.step)

  return {
    props: {
      termsContent,
      currentStep,
    },
  }
}
