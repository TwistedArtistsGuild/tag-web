import Link from "next/link";
import { useState } from "react";

import RegisterSlug from "@/components/forms/onboarding/register-slug";
import JoinPageShell from "@/components/join/common/join-page-shell";
import getApiURL from "@/components/widgets/GetApiURL";
import {
  getUserRegistrationProgress,
  markUserRegistrationStepComplete,
  setUserRegistrationProgress,
} from "@/utils/onboarding/userWorkflow";

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
  return parsed === 2 ? 2 : 1;
}

function buildUserJoinHref(step, username, userId) {
  const normalizedUsername = String(username || "").trim().toLowerCase();
  if (normalizedUsername) {
    const idSegment = userId ? `&id=${encodeURIComponent(String(userId))}` : "";
    return `/join/user/${encodeURIComponent(normalizedUsername)}?step=${step}${idSegment}`;
  }

  return `/join/user?step=${step}`;
}

export default function JoinUserIndexPage({ sessionUser, currentStep, userId, routeUsername }) {
  const initialProgress = typeof window !== "undefined" ? (getUserRegistrationProgress?.() || {}) : {};
  const [tcAccepted, setTcAccepted] = useState(Boolean(initialProgress?.tcAccepted));
  const reservedUsername = String(routeUsername || initialProgress?.slug || sessionUser?.username || "").trim().toLowerCase();
  const routeUserId = Number(userId || 0);

  const getScopedProgress = () => {
    const progress = getUserRegistrationProgress?.() || {};
    const progressEntityId = Number(progress?.entityId || 0);

    if (routeUserId <= 0) {
      return {
        ...progress,
        entityId: null,
      };
    }

    if (progressEntityId > 0 && progressEntityId !== routeUserId) {
      return {
        ...progress,
        entityId: routeUserId,
      };
    }

    return progress;
  };

  const pageMetaData = {
    title: "Join User",
    description: "User onboarding starts with terms and username reservation.",
    keywords: "join, user, onboarding",
    robots: "noindex, nofollow",
    og: {
      title: "Join User",
      description: "User onboarding starts with terms and username reservation.",
    },
  };

  return (
    <JoinPageShell
      title="Join as a User"
      description="Start with terms and username reservation, then continue to profile, preferences, and privacy setup in the slug route."
      canonicalSlug="join/user"
      metadata={pageMetaData}
      steps={[
        {
          href: "/join/user?step=1",
          label: "Terms",
          isActive: currentStep === 1,
        },
        {
          href: buildUserJoinHref(2, reservedUsername, userId),
          label: "Username",
          isActive: currentStep === 2,
        },
      ]}
      badge={userId ? `User ID: ${userId}` : null}
    >
      {currentStep === 1 ? (
        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body gap-4">
            <div>
              <h2 className="card-title">Step 1: Terms and Conditions</h2>
              <p className="text-sm text-base-content/70">Review and accept terms before reserving your username.</p>
            </div>

            <div className="rounded-box border border-base-300 bg-base-200/40 p-4 max-h-64 overflow-y-auto text-sm space-y-2">
              <h3 className="font-semibold">User Registration Terms</h3>
              <p>By creating a user account, you agree to:</p>
              <ul className="list-disc list-inside space-y-1 text-base-content/80">
                <li>Provide accurate registration details.</li>
                <li>Follow guild conduct and moderation policies.</li>
                <li>Keep your account credentials secure.</li>
                <li>Avoid illegal, abusive, or deceptive platform use.</li>
                <li>Respect intellectual property and privacy rights.</li>
              </ul>
            </div>

            <label className="form-control">
              <div className="label cursor-pointer gap-3">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={tcAccepted}
                  onChange={(event) => setTcAccepted(event.target.checked)}
                />
                <span className="label-text">I accept the terms and conditions</span>
              </div>
            </label>

            <div className="flex gap-2 justify-end flex-wrap">
              <Link href="/join" className="btn btn-sm btn-outline">Back to Join</Link>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                disabled={!tcAccepted}
                onClick={() => {
                  if (!tcAccepted) {
                    return;
                  }

                  setUserRegistrationProgress({ tcAccepted: true });
                  window.location.href = "/join/user?step=2";
                }}
              >
                Continue to Username
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {currentStep === 2 ? (
        <RegisterSlug
          domain="user"
          domainLabel="User"
          apiBaseUrl={apiUrl}
          reserveEndpoint={`${apiUrl}user-details/reserve-username`}
          updateEndpoint={(id) => `${apiUrl}user-details/${id}/update-username`}
          checkEndpoint={(candidateSlug, currentId) => {
            const currentNumericId = Number(currentId || 0);
            const canExcludeCurrentUser = routeUserId > 0 && currentNumericId === routeUserId;
            const excludeQuery = canExcludeCurrentUser ? `?excludeId=${encodeURIComponent(String(currentNumericId))}` : "";
            return `${apiUrl}user-details/check-username/${encodeURIComponent(candidateSlug)}${excludeQuery}`;
          }}
          nextRoute={(id) => {
            const progress = getUserRegistrationProgress?.() || {};
            return buildUserJoinHref(2, progress.slug, id);
          }}
          sessionUser={sessionUser}
          initialTitle={reservedUsername}
          titleFieldLabel="Username"
          titlePlaceholder="Enter your username"
          showSlugField={false}
          extendPayload={({ payload }) => ({
            payload: {
              username: payload.slug,
            },
          })}
          progressApi={{
            getProgress: getScopedProgress,
            setProgress: setUserRegistrationProgress,
            markStepComplete: markUserRegistrationStepComplete,
          }}
        />
      ) : null}
    </JoinPageShell>
  );
}

export async function getServerSideProps(context) {
  const session = await getSessionFromRequest(context);
  const currentStep = getWizardStep(context.query?.step);
  const queryUserId = Number(context.query?.id || 0);
  const sessionUserId = Number(session?.user?.id || 0);
  const resolvedUserId = queryUserId > 0 ? queryUserId : (sessionUserId > 0 ? sessionUserId : 0);

  let routeUsername = String(context.query?.slug || "").trim().toLowerCase();

  if (!routeUsername && resolvedUserId > 0) {
    try {
      const response = await fetch(`${apiUrl}user-details/${resolvedUserId}/private?viewerUserId=${resolvedUserId}`);
      if (response.ok) {
        const userData = await response.json();
        routeUsername = String(userData?.username || userData?.Username || "").trim().toLowerCase();
      }
    } catch {
      // no-op: keep routeUsername empty if API fetch fails
    }
  }

  return {
    props: {
      sessionUser: session?.user || null,
      currentStep,
      userId: resolvedUserId > 0 ? resolvedUserId : null,
      routeUsername,
    },
  };
}
