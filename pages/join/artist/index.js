import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import TagSEO from "@/components/TagSEO";
import RegisterSlug from "@/components/forms/onboarding/register-slug";
import TermsAcceptanceForm from "@/components/forms/onboarding/artists/TermsAcceptanceForm";
import getApiURL from "@/components/widgets/GetApiURL";
import {
  getArtistRegistrationProgress,
  markArtistRegistrationStepComplete,
  setArtistRegistrationProgress,
  markWorkflowStepComplete,
} from "@/utils/onboarding/artistWorkflow";

const apiUrl = getApiURL();

function getRequestOrigin(req) {
  const forwardedProto = String(req?.headers?.["x-forwarded-proto"] || "").split(",")[0].trim();
  const forwardedHost = String(req?.headers?.["x-forwarded-host"] || "").trim();
  const host = forwardedHost || String(req?.headers?.host || "").trim();

  if (!host) {
    return null;
  }

  const protocol = forwardedProto || (process.env.NODE_ENV === "development" ? "http" : "https");
  return `${protocol}://${host}`;
}

async function getSessionFromRequest(context) {
  const origin = getRequestOrigin(context?.req);
  if (!origin) {
    return null;
  }

  try {
    const response = await fetch(`${origin}/api/auth/session`, {
      headers: {
        cookie: context?.req?.headers?.cookie || "",
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

function getWizardStep(rawStep) {
  const parsed = Number(rawStep || 1);
  if (parsed === 2) {
    return 2;
  }

  return 1;
}

function buildArtistJoinHref(step, slug) {
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  if (normalizedSlug) {
    return `/join/artist/${encodeURIComponent(normalizedSlug)}?step=${step}`;
  }

  return `/join/artist?step=${step}`;
}

export default function JoinArtistIndexPage({ sessionUser, currentStep }) {
  const sessionUserId = Number(sessionUser?.id || 0);
  const [draftKey] = useState(() => `artist-draft:${sessionUser?.id || "anon"}:${Date.now()}`);
  const [tcAccepted, setTcAccepted] = useState(false);
  const activeStep = currentStep === 2 ? 2 : 1;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setArtistRegistrationProgress({
      draftKey,
      ownerUserId: Number.isFinite(sessionUserId) && sessionUserId > 0 ? sessionUserId : null,
      entityId: null,
      title: "",
      slug: "",
      tcAccepted: false,
      email: sessionUser?.email || "",
      steps: {},
      currentStep: null,
    });
  }, [draftKey, sessionUser?.email, sessionUserId]);

  const scopedProgressApi = useMemo(() => ({
    getProgress: () => {
      const progress = getArtistRegistrationProgress?.() || {};
      if (progress?.draftKey !== draftKey) {
        return null;
      }
      const ownerUserId = Number(progress?.ownerUserId || 0);
      const isSafeProgress = ownerUserId <= 0
        ? true
        : Number.isFinite(sessionUserId) && sessionUserId > 0 && ownerUserId === sessionUserId;

      return isSafeProgress ? progress : null;
    },
    setProgress: (payload) => {
      setArtistRegistrationProgress({
        draftKey,
        ownerUserId: Number.isFinite(sessionUserId) && sessionUserId > 0 ? sessionUserId : null,
        ...payload,
      });
    },
    markStepComplete: markArtistRegistrationStepComplete,
    markWorkflowStep: (entityId, stepKey) => markWorkflowStepComplete(entityId, stepKey, apiUrl),
  }), [draftKey, sessionUserId]);

  const pageMetaData = {
    title: "Join Artist",
    description: "Artist onboarding start: terms and slug reservation.",
    keywords: "join, artist, registration",
    robots: "noindex, nofollow",
    og: {
      title: "Join Artist",
      description: "Artist onboarding start: terms and slug reservation.",
    },
  };

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
              Start with 2 steps: accept Terms &amp; Conditions, then reserve your artist slug. After slug reservation, you will continue in the slug route to complete profile, contact, media, and public contact setup.
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body gap-3">
            <div className="flex gap-2 flex-wrap">
              <Link href="/join/artist?step=1" className={`btn btn-sm ${activeStep === 1 ? "btn-primary" : "btn-outline"}`}>
                1. Terms &amp; Conditions
              </Link>
              <Link href="/join/artist?step=2" className={`btn btn-sm ${activeStep === 2 ? "btn-primary" : "btn-outline"}`}>
                2. Reserve Slug
              </Link>
            </div>
          </div>
        </div>

        {activeStep === 1 && (
          <TermsAcceptanceForm
            tcAccepted={tcAccepted}
            onAcceptanceChange={setTcAccepted}
            onContinue={() => {
              if (tcAccepted) {
                scopedProgressApi.setProgress({ tcAccepted: true });
                window.location.href = "/join/artist?step=2";
              }
            }}
          />
        )}

        {activeStep === 2 && (
          <RegisterSlug
            domain="artist"
            domainLabel="Artist"
            apiBaseUrl={apiUrl}
            reserveEndpoint={`${apiUrl}artist/reserve-slug`}
            updateEndpoint={(id) => `${apiUrl}artist/${id}/update-slug`}
            checkEndpoint={(candidateSlug, currentId) => `${apiUrl}artist/check-slug/${encodeURIComponent(candidateSlug)}${currentId ? `?excludeId=${encodeURIComponent(currentId)}` : ""}`}
            nextRoute={() => {
              const progress = scopedProgressApi.getProgress?.() || {};
              const nextSlug = String(progress?.slug || "").trim().toLowerCase();
              return buildArtistJoinHref(3, nextSlug);
            }}
            sessionUser={sessionUser}
            progressApi={scopedProgressApi}
            onReserved={async ({ entityId }) => {
              const currentUserId = Number(sessionUser?.id || 0);
              if (!Number.isFinite(currentUserId) || currentUserId <= 0 || !entityId) {
                return;
              }

              try {
                await fetch(`${apiUrl}linker_usertoartist`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    UserID: currentUserId,
                    ArtistID: Number(entityId),
                    Role: "owner",
                  }),
                });
              } catch {
                // Non-blocking: reservation succeeded; linker backfill is best-effort.
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSessionFromRequest(context);
  const currentStep = getWizardStep(context.query?.step);

  if (!session?.user?.id) {
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${encodeURIComponent(context.resolvedUrl || "/join/artist")}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      sessionUser: session?.user || null,
      currentStep,
    },
  };
}
