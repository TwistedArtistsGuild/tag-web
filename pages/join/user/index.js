import Link from "next/link";
import { getServerSession } from "next-auth/next";

import TagSEO from "@/components/TagSEO";
import RegisterSlug from "@/components/forms/register_slug";
import DynaFormDB from "@/components/widgets/DynaFormDB";
import getApiURL from "@/components/widgets/GetApiURL";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
  getUserRegistrationProgress,
  markUserRegistrationStepComplete,
  setUserRegistrationProgress,
} from "@/utils/onboarding/userWorkflow";

const apiUrl = getApiURL();
const formName = "UserForm1";

function getWizardStep(rawStep) {
  const parsed = Number(rawStep || 1);
  return parsed === 2 ? 2 : 1;
}

function buildUserJoinHref(step, userId) {
  if (userId) {
    return `/join/user?step=${step}&id=${userId}`;
  }

  return `/join/user?step=${step}`;
}

async function fetchFormMetadata() {
  let response = await fetch(`${apiUrl}formsmetadata/${formName}`);

  if (!response.ok) {
    response = await fetch(`${apiUrl}forms_metadata/${formName}`);
  }

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default function JoinUserIndexPage({ sessionUser, currentStep, userId, metadataProp, userData }) {
  const pageMetaData = {
    title: "Join User",
    description: "User onboarding wizard with slug registration first and DynaForm packets after.",
    keywords: "join, user, onboarding",
    robots: "noindex, nofollow",
    og: {
      title: "Join User",
      description: "User onboarding wizard with slug registration first and DynaForm packets after.",
    },
  };

  const baseMetadata = Array.isArray(metadataProp) ? metadataProp[0] : metadataProp;
  const enhancedMetadata = baseMetadata && userId
    ? {
        ...baseMetadata,
        FromURL: "/join/user",
        redirectURL: "/user",
        APIURL: `${apiUrl}user/${userId}`,
      }
    : null;

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="join/user" />

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body gap-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-base-content">Join as a User</h1>
              <Link href="/join" className="btn btn-sm btn-ghost">Back to Join</Link>
            </div>
            <p className="text-base-content/70">
              Browse back and forth between registration pages. Step 1 reserves slug and row; Step 2 sends DynaForm packets.
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body gap-3">
            <div className="flex gap-2 flex-wrap">
              <Link href={buildUserJoinHref(1, userId)} className={`btn btn-sm ${currentStep === 1 ? "btn-primary" : "btn-outline"}`}>
                1. Reserve Slug
              </Link>
              <Link href={buildUserJoinHref(2, userId)} className={`btn btn-sm ${currentStep === 2 ? "btn-primary" : "btn-outline"}`}>
                2. Profile Packets
              </Link>
              {userId && <span className="badge badge-info">User ID: {userId}</span>}
            </div>
          </div>
        </div>

        {currentStep === 1 && (
          <RegisterSlug
            domain="user"
            domainLabel="User"
            apiBaseUrl={apiUrl}
            reserveEndpoint={`${apiUrl}user/reserve-slug`}
            updateEndpoint={(id) => `${apiUrl}user/${id}/update-slug`}
            checkEndpoint={(candidateSlug, currentId) => `${apiUrl}user/check-slug/${encodeURIComponent(candidateSlug)}${currentId ? `?excludeId=${encodeURIComponent(currentId)}` : ""}`}
            nextRoute={(id) => buildUserJoinHref(2, id)}
            sessionUser={sessionUser}
            progressApi={{
              getProgress: getUserRegistrationProgress,
              setProgress: setUserRegistrationProgress,
              markStepComplete: markUserRegistrationStepComplete,
            }}
          />
        )}

        {currentStep === 2 && !userId && (
          <div className="alert alert-warning">
            <span>Start at Step 1 first so we can reserve your slug and create your user record.</span>
          </div>
        )}

        {currentStep === 2 && userId && !enhancedMetadata && (
          <div className="alert alert-error">
            <span>Unable to load form metadata for UserForm1.</span>
          </div>
        )}

        {currentStep === 2 && userId && enhancedMetadata && (
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body">
              <DynaFormDB request="update" metadataProp={enhancedMetadata} formData={userData} />
              <div className="mt-4 flex gap-2 justify-between flex-wrap">
                <Link href={buildUserJoinHref(1, userId)} className="btn btn-sm btn-outline">Back to Slug Step</Link>
                <Link href="/user" className="btn btn-sm btn-primary">Finish and Open User Dashboard</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const currentStep = getWizardStep(context.query?.step);
  const userId = Number(context.query?.id || 0);

  let metadataProp = null;
  let userData = null;

  if (userId > 0) {
    try {
      metadataProp = await fetchFormMetadata();
    } catch (error) {
      console.error("Unable to load user metadata:", error.message);
    }

    try {
      const response = await fetch(`${apiUrl}user/${userId}`);
      if (response.ok) {
        userData = await response.json();
      }
    } catch (error) {
      console.error("Unable to load user data by ID:", error.message);
    }
  }

  return {
    props: {
      sessionUser: session?.user || null,
      currentStep,
      userId: userId > 0 ? userId : null,
      metadataProp,
      userData,
    },
  };
}
