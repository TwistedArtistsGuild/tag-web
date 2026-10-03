import { useEffect, useState } from "react"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/pages/api/auth/[...nextauth]"
import OrganizationSlugReservationStep from "@/components/forms/onboarding/organizations/OrganizationSlugReservationStep"
import JoinPageShell from "@/components/join/common/join-page-shell"
import TermsAgreementStep from "@/components/join/common/terms-agreement-step"
import { getMarkdownContent } from "@/components/widgets/markdown"
import {
  clearVendorRegistrationProgress,
  getVendorRegistrationProgress,
  markVendorRegistrationStepComplete,
  setVendorRegistrationProgress,
} from "@/utils/onboarding/vendorWorkflow"

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
        <OrganizationSlugReservationStep
          context="vendor"
          entityLabel="Vendor"
          reservedId={reservedId}
          reservedSlug={reservedSlug}
          buildJoinHref={buildVendorJoinHref}
          clearProgress={clearVendorRegistrationProgress}
          getProgress={getVendorRegistrationProgress}
          setProgress={setVendorRegistrationProgress}
          markStepComplete={markVendorRegistrationStepComplete}
        />
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

