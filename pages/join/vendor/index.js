import { useEffect, useState } from "react"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/pages/api/auth/[...nextauth]"
import RegisterSlug from "@/components/forms/onboarding/register-slug"
import JoinPageShell from "@/components/join/common/join-page-shell"
import TermsAgreementStep from "@/components/join/common/terms-agreement-step"
import getApiURL from "@/components/widgets/GetApiURL"
import { getMarkdownContent } from "@/components/widgets/markdown"
import {
  clearVendorRegistrationProgress,
  getVendorRegistrationProgress,
  markVendorRegistrationStepComplete,
  setVendorRegistrationProgress,
} from "@/utils/onboarding/vendorWorkflow"

const apiUrl = getApiURL()

function getWizardStep(rawStep) {
  const parsed = Number(rawStep || 1)
  if (parsed === 2) {
    return 2
  }

  return 1
}

function buildVendorJoinHref(step, slug, id) {
  const normalizedSlug = String(slug || "").trim().toLowerCase()
  if (normalizedSlug) {
    const idSegment = id ? `&id=${encodeURIComponent(String(id))}` : ""
    return `/join/vendor/${encodeURIComponent(normalizedSlug)}?step=${step}${idSegment}`
  }

  return `/join/vendor?step=${step}`
}

export default function JoinVendorIndexPage({ termsContent, currentStep }) {
  const [progress, setProgress] = useState({})

  useEffect(() => {
    setProgress(getVendorRegistrationProgress?.() || {})
  }, [])

  const reservedSlug = String(progress?.slug || "").trim().toLowerCase()
  const reservedId = Number(progress?.entityId || 0)

  const pageMetaData = {
    title: "Join Vendor",
    description: "Start vendor onboarding with terms and workspace slug reservation.",
    keywords: "join, vendor, onboarding",
    robots: "noindex, nofollow",
    og: {
      title: "Join Vendor",
      description: "Start vendor onboarding with terms and workspace slug reservation.",
    },
  }

  return (
    <JoinPageShell
      title="Join as a Vendor"
      description="Start with terms and reserve your vendor workspace slug."
      canonicalSlug="join/vendor"
      metadata={pageMetaData}
      steps={[
        {
          href: "/join/vendor?step=1",
          label: "Terms",
          isActive: currentStep === 1,
        },
        {
          href: "/join/vendor?step=2",
          label: "Reserve Workspace",
          isActive: currentStep === 2,
        },
      ]}
      badge={reservedId > 0 ? `Vendor ID: ${reservedId}` : null}
    >
      {currentStep === 1 ? (
        <TermsAgreementStep
          termsContent={termsContent}
          onAccepted={() => {
            setVendorRegistrationProgress({ tcAccepted: true })
            window.location.href = "/join/vendor?step=2"
          }}
          continueLabel="Continue to Workspace Reservation"
        />
      ) : null}

      {currentStep === 2 ? (
        <div className="space-y-3">
          {reservedId > 0 ? (
            <div className="rounded-box border border-base-300 bg-base-200/40 p-3 text-sm space-y-2">
              <div className="font-semibold">Existing vendor registration found</div>
              <div className="text-base-content/70">
                ID: {reservedId}
                {reservedSlug ? ` | Slug: ${reservedSlug}` : ""}
              </div>
              <div className="flex flex-wrap gap-2">
                {reservedSlug ? (
                  <a className="btn btn-sm btn-outline" href={buildVendorJoinHref(3, reservedSlug, reservedId)}>
                    Continue Existing Vendor Registration
                  </a>
                ) : null}
                <button
                  type="button"
                  className="btn btn-sm btn-error btn-outline"
                  onClick={() => {
                    clearVendorRegistrationProgress()
                    window.location.href = "/join/vendor?step=2"
                  }}
                >
                  Start New Vendor Registration
                </button>
              </div>
            </div>
          ) : null}

          <RegisterSlug
            domain="vendor"
            domainLabel="Vendor"
            apiBaseUrl={apiUrl}
            reserveEndpoint={`${apiUrl}vendor/reserve-slug`}
            updateEndpoint={(id) => `${apiUrl}vendor/${id}/update-slug`}
            checkEndpoint={(candidateSlug, currentId) => `${apiUrl}vendor/check-slug/${encodeURIComponent(candidateSlug)}${currentId ? `?excludeId=${encodeURIComponent(currentId)}` : ""}`}
            nextRoute={(id) => {
              const nextProgress = getVendorRegistrationProgress?.() || {}
              return buildVendorJoinHref(3, nextProgress.slug, id)
            }}
            progressApi={{
              getProgress: getVendorRegistrationProgress,
              setProgress: setVendorRegistrationProgress,
              markStepComplete: markVendorRegistrationStepComplete,
            }}
            titleFieldLabel="Vendor Display Name"
            titlePlaceholder="Enter vendor name"
            slugDescription="Vendor slug creates a dedicated vendor workspace URL."
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
        destination: `/api/auth/signin?callbackUrl=${encodeURIComponent(context.resolvedUrl || "/join/vendor")}`,
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

