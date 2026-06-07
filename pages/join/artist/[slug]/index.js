import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

import TagSEO from "@/components/TagSEO";
import getApiURL from "@/components/widgets/GetApiURL";
import GalleryManager from "@/components/gallery/GalleryManager";
import TTTitleLine from "@/components/tiptap/TT_TitleLine";
import TTArticle from "@/components/tiptap/TT_Article";
import {
  getArtistRegistrationProgress,
  setArtistRegistrationProgress,
  ARTIST_REGISTRATION_STEPS,
  markWorkflowStepComplete,
} from "@/utils/onboarding/artistWorkflow";
import { SocialRealtimeProvider } from "@/components/social/SocialRealtimeContext";
import SocialHandlesForm from "@/components/forms/contact/social-handles-form"
import EmailForm from "@/components/forms/contact/email-form"
import PhoneForm from "@/components/forms/contact/phone-form"
import AddressForm from "@/components/forms/contact/address-form"
import UrlLinksForm from "@/components/forms/contact/url-links-form"

const apiUrl = getApiURL();
const businessEntityOptions = [
  { value: "", label: "Select business entity" },
  { value: "sole-proprietorship", label: "Sole Proprietorship" },
  { value: "llc", label: "LLC" },
  { value: "corporation", label: "Corporation" },
  { value: "partnership", label: "Partnership" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "other", label: "Other" },
];

const incorporationOptions = [
  { value: "", label: "Select incorporation status" },
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

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
  if (parsed >= 1 && parsed <= 7) {
    return parsed;
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

function extractPlainText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function validateSeoTags(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return { isValid: true, normalized: "" };
  }

  if (!raw.includes(",")) {
    return {
      isValid: false,
      message: "SEO tags must be comma-separated (example: abstract art, mixed media, surrealism).",
    };
  }

  const segments = raw.split(",").map((segment) => segment.trim());
  if (segments.some((segment) => !segment)) {
    return {
      isValid: false,
      message: "SEO tags cannot contain empty values. Remove extra commas and keep one tag per comma.",
    };
  }

  return {
    isValid: true,
    normalized: segments.join(", "),
  };
}

const PUBLIC_CONTACT_TABS = [
  { key: "public-address", label: "Public Address" },
  { key: "public-email", label: "Public Email" },
  { key: "public-phone", label: "Public Phone" },
  { key: "public-social", label: "Public Social" },
  { key: "public-urls", label: "Public URLs" },
];

export default function JoinArtistIndexPage({ sessionUser, currentStep, artistId, artistData, pictures }) {
  const initialProgress = typeof window !== "undefined" ? (getArtistRegistrationProgress?.() || {}) : {};
  const initialArtistSlug = String(artistData?.path || artistData?.Path || initialProgress.slug || "").trim().toLowerCase();
  const initialArtistTitle = String(artistData?.title || artistData?.Title || "").trim();
  const initialArtistByline = String(artistData?.byline || artistData?.Byline || "").trim();
  const initialArtistBiography = String(artistData?.biography || artistData?.Biography || "").trim();
  const initialArtistStatement = String(artistData?.statement || artistData?.Statement || "").trim();
  const initialArtistSeoTags = String(artistData?.seoTags || artistData?.SEOTags || "").trim();
  const initialArtistCity = String(artistData?.city || artistData?.City || "").trim();
  const initialArtistCountry = String(artistData?.country || artistData?.Country || "").trim();
  const initialArtistRegion = String(artistData?.stateOrProvince || artistData?.StateOrProvince || "").trim();
  const initialArtistZipCode = String(artistData?.zipCode || artistData?.ZipCode || artistData?.postalCode || artistData?.PostalCode || "").trim();
  const initialArtistBusinessEntityType = String(artistData?.businessEntityType || artistData?.BusinessEntityType || "").trim();
  const initialArtistIncorporatedYear = String(artistData?.incorporatedYear || artistData?.IncorporatedYear || "").trim();
  const initialArtistIncorporatedFlag =
    typeof artistData?.isFormallyIncorporated === "boolean"
      ? artistData.isFormallyIncorporated
      : typeof artistData?.IsFormallyIncorporated === "boolean"
        ? artistData.IsFormallyIncorporated
        : null;
  const [resolvedArtistId] = useState(artistId || initialProgress.entityId || null);
  const [resolvedArtistSlug] = useState(initialArtistSlug || "");
        const [profileTitle, setProfileTitle] = useState(initialProgress.title || initialArtistTitle || "");
        const [profileByline, setProfileByline] = useState(initialArtistByline || "");
        const [profileBiography, setProfileBiography] = useState(initialArtistBiography || "");
        const [profileStatement, setProfileStatement] = useState(initialArtistStatement || "");
        const [profileSeoTags, setProfileSeoTags] = useState(initialArtistSeoTags || "");
        const [city, setCity] = useState(initialProgress.city || initialArtistCity || "");
        const [stateOrProvince, setStateOrProvince] = useState(initialProgress.stateOrProvince || initialArtistRegion || "");
        const [zipCode, setZipCode] = useState(initialProgress.zipCode || initialArtistZipCode || "");
        const [country, setCountry] = useState(initialProgress.country || initialArtistCountry || "USA");
  const [businessEntityType, setBusinessEntityType] = useState(initialProgress.businessEntityType || initialArtistBusinessEntityType || "");
  const [incorporationStatus, setIncorporationStatus] = useState(
    initialProgress.incorporationStatus ||
    (initialArtistIncorporatedFlag === null ? "" : initialArtistIncorporatedFlag ? "true" : "false") ||
    ""
  );
  const [incorporatedYear, setIncorporatedYear] = useState(initialProgress.incorporatedYear || initialArtistIncorporatedYear || "");
  const [profileFormError, setProfileFormError] = useState("");
  const [isSavingProfileForm, setIsSavingProfileForm] = useState(false);
  const [profileFiles, setProfileFiles] = useState([]);
  const [coverFiles, setCoverFiles] = useState([]);
  const [mediaFeedback, setMediaFeedback] = useState({ type: "", message: "" });
  const [isSavingMedia, setIsSavingMedia] = useState(false);

  const [contactsTab, setContactsTab] = useState("public-address");
  const [publicSocialContacts, setPublicSocialContacts] = useState([]);
  const [publicUrlContacts, setPublicUrlContacts] = useState([]);
  const [publicEmailContacts, setPublicEmailContacts] = useState([]);
  const [publicPhoneContacts, setPublicPhoneContacts] = useState([]);
  const [publicAddressContacts, setPublicAddressContacts] = useState([]);
  const [privateEmailContacts, setPrivateEmailContacts] = useState([]);
  const [privatePhoneContacts, setPrivatePhoneContacts] = useState([]);
  const [privateAddressContacts, setPrivateAddressContacts] = useState([]);
  const [privateUrlContacts, setPrivateUrlContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [privateContactRequirementError, setPrivateContactRequirementError] = useState("");

  const [workflowSummary, setWorkflowSummary] = useState(null);
  const [loadingWorkflowSummary, setLoadingWorkflowSummary] = useState(false);
  const [isPublishingProfile, setIsPublishingProfile] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState("");

  const workflowCompletionMap = useMemo(() => {
    const rows = Array.isArray(workflowSummary?.steps) ? workflowSummary.steps : [];
    return rows.reduce((acc, step) => {
      const key = String(step?.stepKey || "").trim().toLowerCase();
      if (key) {
        acc[key] = Boolean(step?.isCompleted);
      }
      return acc;
    }, {});
  }, [workflowSummary]);

  const businessAddressContacts = useMemo(
    () => privateAddressContacts,
    [privateAddressContacts]
  );

  const businessPhoneContacts = useMemo(
    () => privatePhoneContacts,
    [privatePhoneContacts]
  );

  const businessEmailContacts = useMemo(
    () => privateEmailContacts,
    [privateEmailContacts]
  );

  const businessUrlContacts = useMemo(
    () => privateUrlContacts,
    [privateUrlContacts]
  );

  const businessContactCardComplete = useMemo(
    () => businessAddressContacts.length > 0 && businessPhoneContacts.length > 0 && businessEmailContacts.length > 0,
    [businessAddressContacts.length, businessPhoneContacts.length, businessEmailContacts.length]
  );

  const stepCompletionMap = useMemo(() => {
    const hasProfileDraft = Boolean(extractPlainText(profileTitle)) && Boolean(extractPlainText(profileByline) || extractPlainText(profileBiography));
    const hasSelectedMedia = Boolean(
      artistData?.profilePicID ||
      artistData?.ProfilePicID ||
      artistData?.coverPicID ||
      artistData?.CoverPicID
    );
    const hasPublicContacts = (
      publicAddressContacts.length +
      publicEmailContacts.length +
      publicPhoneContacts.length +
      publicSocialContacts.length +
      publicUrlContacts.length
    ) > 0;

    return {
      3: hasProfileDraft || Boolean(workflowCompletionMap.added_bio),
      4: businessContactCardComplete || Boolean(workflowCompletionMap.private_contacts),
      5: hasSelectedMedia || Boolean(workflowCompletionMap.uploaded_photos),
      6: hasPublicContacts || Boolean(workflowCompletionMap.added_contacts),
      7: Boolean(workflowSummary?.isPublished || workflowSummary?.IsPublished || artistData?.isPublished || artistData?.IsPublished),
    };
  }, [
    artistData?.CoverPicID,
    artistData?.IsPublished,
    artistData?.ProfilePicID,
    artistData?.coverPicID,
    artistData?.isPublished,
    artistData?.profilePicID,
    businessContactCardComplete,
    profileBiography,
    profileByline,
    profileTitle,
    publicAddressContacts.length,
    publicEmailContacts.length,
    publicPhoneContacts.length,
    publicSocialContacts.length,
    publicUrlContacts.length,
    workflowCompletionMap,
    workflowSummary?.IsPublished,
    workflowSummary?.isPublished,
  ]);

  const postSlugPercentComplete = useMemo(() => {
    const postSlugSteps = [3, 4, 5, 6, 7];
    const completedCount = postSlugSteps.filter((step) => Boolean(stepCompletionMap?.[step])).length;
    return Math.round((completedCount / postSlugSteps.length) * 100);
  }, [stepCompletionMap]);

  const hasLiveArtist = Boolean(resolvedArtistId);
  const activeStep = hasLiveArtist ? Math.min(Math.max(currentStep, 3), 7) : 3;
  const showMissingIndicators = Boolean(resolvedArtistId) && !loadingWorkflowSummary;

  /**
   * Helper to mark a workflow step complete and navigate to the next step.
   * @param {string} stepKey - Step key from ARTIST_WORKFLOW_STEPS
   * @param {number} nextStep - Next step number to navigate to (0 = finish and go to portal)
   */
  const completeStepAndContinue = async (stepKey, nextStep) => {
    if (resolvedArtistId && stepKey) {
      await markWorkflowStepComplete(resolvedArtistId, stepKey, apiUrl);
    }

    const targetUrl = nextStep === 0 ? "/portal/artist" : buildArtistJoinHref(nextStep, resolvedArtistSlug);
    window.location.href = targetUrl;
  };

  const publishArtistProfile = async () => {
    if (!resolvedArtistId) {
      setPublishFeedback("Artist profile is missing an ID. Return to step 3 and try again.");
      return;
    }

    setIsPublishingProfile(true);
    setPublishFeedback("");

    try {
      const response = await fetch(`${apiUrl}workflows/artist/${resolvedArtistId}/publish`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPublished: true,
          enforceRequiredSteps: true,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        setPublishFeedback(message || "Unable to publish artist profile yet. Complete all required steps first.");
        return;
      }

      const portalUrl = resolvedArtistSlug ? `/portal/artist/${encodeURIComponent(resolvedArtistSlug)}` : "/portal/artist";
      window.location.href = portalUrl;
    } catch (error) {
      setPublishFeedback(error?.message || "Unable to publish artist profile yet.");
    } finally {
      setIsPublishingProfile(false);
    }
  };

  const pageMetaData = {
    title: "Join Artist",
    description: "Artist onboarding wizard with slug registration first and packeted DynaForm updates after.",
    keywords: "join, artist, registration",
    robots: "noindex, nofollow",
    og: {
      title: "Join Artist",
      description: "Artist onboarding wizard with slug registration first and packeted DynaForm updates after.",
    },
  };

  const pictureByUrl = useMemo(() => {
    const safePictures = Array.isArray(pictures) ? pictures : [];
    return safePictures.reduce((acc, picture) => {
      const url = String(picture?.url || picture?.URL || picture?.normalizedURL || picture?.NormalizedURL || "").trim().toLowerCase();
      if (url) {
        acc[url] = picture;
      }
      return acc;
    }, {});
  }, [pictures]);

  const artistMediaRoot = useMemo(() => {
    if (!resolvedArtistId) {
      return "";
    }

    return `platformpics/artists/${resolvedArtistId}/`;
  }, [resolvedArtistId]);

  const galleryPrefix = useMemo(() => (artistMediaRoot ? `${artistMediaRoot}gallery/` : ""), [artistMediaRoot]);
  const profilePrefix = useMemo(() => (artistMediaRoot ? `${artistMediaRoot}profile/` : ""), [artistMediaRoot]);
  const coverPrefix = useMemo(() => (artistMediaRoot ? `${artistMediaRoot}cover/` : ""), [artistMediaRoot]);

  const getMostRecentActiveFile = (files) => {
    const safeFiles = Array.isArray(files) ? files : [];
    if (!safeFiles.length) {
      return null;
    }

    return [...safeFiles].sort((a, b) => {
      const aTime = new Date(a?.lastModified || 0).getTime();
      const bTime = new Date(b?.lastModified || 0).getTime();
      return bTime - aTime;
    })[0];
  };

  const activeProfileFile = useMemo(() => getMostRecentActiveFile(profileFiles), [profileFiles]);
  const activeCoverFile = useMemo(() => getMostRecentActiveFile(coverFiles), [coverFiles]);

  const activeProfilePictureId = useMemo(() => {
    if (!activeProfileFile?.url) {
      return null;
    }

    const picture = pictureByUrl[String(activeProfileFile.url).trim().toLowerCase()];
    return picture?.pictureID || picture?.PictureID || activeProfileFile?.persistedPictureId || null;
  }, [activeProfileFile, pictureByUrl]);

  const activeCoverPictureId = useMemo(() => {
    if (!activeCoverFile?.url) {
      return null;
    }

    const picture = pictureByUrl[String(activeCoverFile.url).trim().toLowerCase()];
    return picture?.pictureID || picture?.PictureID || activeCoverFile?.persistedPictureId || null;
  }, [activeCoverFile, pictureByUrl]);


  const refreshArtistContacts = useCallback(async () => {
    if (!resolvedArtistId) {
      return;
    }

    setLoadingContacts(true);
    try {
      const r = await fetch(`${apiUrl}contact/artist/${resolvedArtistId}?includePrivate=true`);
      if (!r.ok) {
        return;
      }

      const data = await r.json();
      const rows = Array.isArray(data.contacts) ? data.contacts : [];
      const secondaryRows = rows.filter((c) => String(c?.scope || "").trim().toLowerCase() === "secondary");
      const internalRows = rows.filter((c) => String(c?.scope || "").trim().toLowerCase() === "private" || String(c?.scope || "").trim().toLowerCase() === "primary");

      setPublicPhoneContacts(secondaryRows.filter((c) => String(c?.contactType || "").toLowerCase() === "phone"));
      setPublicEmailContacts(secondaryRows.filter((c) => String(c?.contactType || "").toLowerCase() === "email"));
      setPublicAddressContacts(secondaryRows.filter((c) => String(c?.contactType || "").toLowerCase() === "address"));
      setPublicUrlContacts(secondaryRows.filter((c) => String(c?.contactType || "").toLowerCase() === "url" && String(c?.category || "").toLowerCase() === "website"));
      setPublicSocialContacts(secondaryRows.filter((c) => String(c?.contactType || "").toLowerCase() === "url" && String(c?.category || "").toLowerCase() !== "website"));

      setPrivatePhoneContacts(internalRows.filter((c) => String(c?.contactType || "").toLowerCase() === "phone"));
      setPrivateEmailContacts(internalRows.filter((c) => String(c?.contactType || "").toLowerCase() === "email"));
      setPrivateAddressContacts(internalRows.filter((c) => String(c?.contactType || "").toLowerCase() === "address"));
      setPrivateUrlContacts(internalRows.filter((c) => String(c?.contactType || "").toLowerCase() === "url" && String(c?.category || "").toLowerCase() === "website"));
    } catch {
      // no-op
    } finally {
      setLoadingContacts(false);
    }
  }, [resolvedArtistId]);

  useEffect(() => {
    if (activeStep !== 4 && activeStep !== 6) {
      return;
    }

    const refreshHandle = setTimeout(() => {
      refreshArtistContacts();
    }, 0);

    return () => clearTimeout(refreshHandle);
  }, [activeStep, refreshArtistContacts]);

  useEffect(() => {
    if (!resolvedArtistId) {
      return;
    }

    let ignore = false;
    const loadWorkflowSummary = async () => {
      setLoadingWorkflowSummary(true);
      try {
        const response = await fetch(`${apiUrl}workflows/artist/${resolvedArtistId}?workflowName=default`);
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (!ignore) {
          setWorkflowSummary(data);
        }
      } catch {
        // no-op
      } finally {
        if (!ignore) {
          setLoadingWorkflowSummary(false);
        }
      }
    };

    loadWorkflowSummary();
    return () => {
      ignore = true;
    };
  }, [activeStep, resolvedArtistId]);

  const saveMediaSelection = async () => {
    if (!resolvedArtistId) {
      setMediaFeedback({ type: "error", message: "Artist ID is missing." });
      return;
    }

    setIsSavingMedia(true);
    setMediaFeedback({ type: "", message: "" });

    try {
      const response = await fetch(`${apiUrl}artist/byID/${resolvedArtistId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ProfilePicID: activeProfilePictureId || null,
          CoverPicID: activeCoverPictureId || null,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMediaFeedback({
          type: "error",
          message: errorText || `Unable to save media fields (${response.status}).`,
        });
        return;
      }

      setMediaFeedback({ type: "success", message: "Active profile and cover media synced from folders." });
    } catch (error) {
      setMediaFeedback({ type: "error", message: error.message || "Unable to save media selections." });
    } finally {
      setIsSavingMedia(false);
    }
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
              Artist post-slug setup: Step 3 complete profile and business details, Step 4 add business contact information, Step 5 set profile and gallery media, Step 6 configure public contacts, then Step 7 review and publish.
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body gap-3">
            <div className="flex gap-2 flex-wrap">
              <Link href={buildArtistJoinHref(3, resolvedArtistSlug)} className={`btn btn-sm ${activeStep === 3 ? "btn-primary" : (showMissingIndicators && !stepCompletionMap[3]) ? "btn-warning btn-outline animate-pulse" : "btn-outline"}`}>
                 Profile
              </Link>
              <Link href={buildArtistJoinHref(4, resolvedArtistSlug)} className={`btn btn-sm ${activeStep === 4 ? "btn-primary" : (showMissingIndicators && !stepCompletionMap[4]) ? "btn-warning btn-outline animate-pulse" : "btn-outline"}`}>
                 Business Contacts
              </Link>
              <Link href={buildArtistJoinHref(5, resolvedArtistSlug)} className={`btn btn-sm ${activeStep === 5 ? "btn-primary" : (showMissingIndicators && !stepCompletionMap[5]) ? "btn-warning btn-outline animate-pulse" : "btn-outline"}`}>
                 Profile Media Editor
              </Link>
              <Link href={buildArtistJoinHref(6, resolvedArtistSlug)} className={`btn btn-sm ${activeStep === 6 ? "btn-primary" : (showMissingIndicators && !stepCompletionMap[6]) ? "btn-warning btn-outline animate-pulse" : "btn-outline"}`}>
                 Public Contacts
              </Link>
              <Link href={buildArtistJoinHref(7, resolvedArtistSlug)} className={`btn btn-sm ${activeStep === 7 ? "btn-primary" : (showMissingIndicators && !stepCompletionMap[7]) ? "btn-warning btn-outline animate-pulse" : "btn-outline"}`}>
                 Review &amp; Publish
              </Link>
              {resolvedArtistId && <span className="badge badge-info">Artist ID: {resolvedArtistId}</span>}
            </div>

            {resolvedArtistId && (
              <>
                {loadingWorkflowSummary ? (
                  <div className="text-sm text-base-content/60">Loading progress…</div>
                ) : (
                  <>
                    <progress
                      className="progress progress-primary w-full"
                      value={postSlugPercentComplete}
                      max="100"
                    />
                    <div className="text-xs text-base-content/70">
                      {postSlugPercentComplete}% complete
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {activeStep === 3 && resolvedArtistId && (
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body gap-4">
              <div>
                <h2 className="card-title">Step 3: Profile</h2>
                <p className="text-sm text-base-content/70">Complete profile and business details in one form.</p>
              </div>

              <div className="rounded-box border border-base-300 bg-base-200/40 p-4 space-y-4">
                <h3 className="font-semibold text-base-content">Profile Details</h3>

                <div className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Title (H1)</span>
                  </div>
                  <TTTitleLine
                    value={profileTitle}
                    onChange={setProfileTitle}
                    headingLevel={1}
                    placeholder="Artist or group title"
                  />
                </div>

                <div className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Byline (H2)</span>
                  </div>
                  <TTTitleLine
                    value={profileByline}
                    onChange={setProfileByline}
                    headingLevel={2}
                    placeholder="Short byline"
                  />
                </div>

                <div className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Biography</span>
                  </div>
                  <TTArticle
                    value={profileBiography}
                    onChange={setProfileBiography}
                    actionPreset="none"
                    minHeight={220}
                  />
                </div>

                <div className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Statement</span>
                  </div>
                  <TTArticle
                    value={profileStatement}
                    onChange={setProfileStatement}
                    actionPreset="none"
                    minHeight={240}
                  />
                </div>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">SEO Tags</span>
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={profileSeoTags}
                    onChange={(event) => setProfileSeoTags(event.target.value)}
                    placeholder="abstract art, mixed media, surrealism"
                  />
                  <div className="label">
                    <span className="label-text-alt">Use commas to separate tags.</span>
                  </div>
                </label>
              </div>

              <div className="rounded-box border border-base-300 bg-base-200/40 p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-base-content">Business Details</h3>
                  <p className="text-sm text-base-content/70">Complete your business details as part of profile setup.</p>
                </div>

                <label className="form-control w-full">
                  <div className="label flex-col items-start gap-0.5">
                    <span className="label-text font-semibold">Formally Incorporated?</span>
                    <span className="label-text-alt text-base-content/60">Formally incorporated companies are given priority access to premium and exact-match slugs.</span>
                  </div>
                  <select
                    className="select select-bordered w-full"
                    value={incorporationStatus}
                    onChange={(event) => setIncorporationStatus(event.target.value)}
                  >
                    {incorporationOptions.map((option) => (
                      <option key={option.value || "empty"} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">City</span>
                    </div>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      placeholder="City"
                    />
                  </label>

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">State or Region</span>
                    </div>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={stateOrProvince}
                      onChange={(event) => setStateOrProvince(event.target.value)}
                      placeholder="State or Region"
                    />
                  </label>

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Zip / Postal Code</span>
                    </div>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={zipCode}
                      onChange={(event) => setZipCode(event.target.value)}
                      placeholder="Zip / Postal Code"
                    />
                  </label>

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Country</span>
                    </div>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={country}
                      onChange={(event) => setCountry(event.target.value)}
                      placeholder="Country"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Business Entity Type</span>
                    </div>
                    <select
                      className="select select-bordered w-full"
                      value={businessEntityType}
                      onChange={(event) => setBusinessEntityType(event.target.value)}
                    >
                      {businessEntityOptions.map((option) => (
                        <option key={option.value || "empty"} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  {incorporationStatus === "true" && (
                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text">Year Incorporated</span>
                      </div>
                      <input
                        type="number"
                        min="1800"
                        max={new Date().getFullYear()}
                        step="1"
                        className="input input-bordered w-full"
                        placeholder={`e.g. ${new Date().getFullYear() - 5}`}
                        value={incorporatedYear}
                        onChange={(event) => setIncorporatedYear(event.target.value)}
                      />
                      <div className="label">
                        <span className="label-text-alt">Optional — four-digit year your entity was formally incorporated.</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {profileFormError ? (
                <div className="alert alert-error">
                  <span>{profileFormError}</span>
                </div>
              ) : null}

              <div className="mt-4 flex gap-2 justify-between flex-wrap">
                <Link href="/join/artist?step=2" className="btn btn-sm btn-outline">Back to Slug Step</Link>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  disabled={isSavingProfileForm}
                  onClick={async () => {
                    if (!resolvedArtistId) {
                      return;
                    }

                    const titleText = extractPlainText(profileTitle);
                    if (!titleText) {
                      setProfileFormError("Title is required.");
                      return;
                    }

                    const trimmedCountry = country.trim();
                    const trimmedCity = city.trim();
                    const trimmedStateOrProvince = stateOrProvince.trim();
                    const trimmedZipCode = zipCode.trim();

                    if (!incorporationStatus) {
                      setProfileFormError("Incorporation status is required.");
                      return;
                    }

                    if (!trimmedCity) {
                      setProfileFormError("City is required.");
                      return;
                    }

                    if (!trimmedCountry) {
                      setProfileFormError("Country is required.");
                      return;
                    }

                    if (!trimmedStateOrProvince) {
                      setProfileFormError("State or province is required.");
                      return;
                    }

                    if (!trimmedZipCode) {
                      setProfileFormError("Zip or postal code is required.");
                      return;
                    }

                    if (!businessEntityType) {
                      setProfileFormError("Business entity type is required.");
                      return;
                    }

                    const isIncorporated = incorporationStatus === "true";
                    const parsedYear = incorporatedYear ? Number(incorporatedYear) : null;
                    const validYear = parsedYear && parsedYear >= 1800 && parsedYear <= new Date().getFullYear() ? parsedYear : null;

                    if (isIncorporated && incorporatedYear && !validYear) {
                      setProfileFormError("Incorporated year must be a valid 4-digit year.");
                      return;
                    }

                    const seoValidation = validateSeoTags(profileSeoTags);
                    if (!seoValidation.isValid) {
                      setProfileFormError(seoValidation.message);
                      return;
                    }

                    setProfileFormError("");
                    setIsSavingProfileForm(true);

                    setArtistRegistrationProgress({
                      title: titleText,
                      city: trimmedCity,
                      country: trimmedCountry,
                      stateOrProvince: trimmedStateOrProvince,
                      zipCode: trimmedZipCode,
                      businessEntityType,
                      incorporationStatus,
                      incorporatedYear: incorporatedYear || "",
                    });

                    try {
                      const response = await fetch(`${apiUrl}artist/byID/${resolvedArtistId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          title: profileTitle,
                          byline: profileByline.trim() || null,
                          biography: profileBiography.trim() || null,
                          statement: profileStatement.trim() || null,
                          seoTags: seoValidation.normalized || null,
                          city: trimmedCity,
                          country: trimmedCountry,
                          stateOrProvince: trimmedStateOrProvince,
                          zipCode: trimmedZipCode,
                          businessEntityType,
                          isFormallyIncorporated: isIncorporated,
                          incorporatedYear: isIncorporated ? validYear : null,
                        }),
                      });

                      if (!response.ok) {
                        const errorText = await response.text();
                        setProfileFormError(errorText || `Unable to save profile (${response.status}).`);
                        return;
                      }

                      await completeStepAndContinue(ARTIST_REGISTRATION_STEPS.PROFILE_INFO, 4);
                    } catch (error) {
                      setProfileFormError(error.message || "Unable to save profile details.");
                    } finally {
                      setIsSavingProfileForm(false);
                    }
                  }}
                >
                  {isSavingProfileForm ? "Saving..." : "Continue to Business Contact Info"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeStep === 4 && resolvedArtistId && (
          <SocialRealtimeProvider>
            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body gap-4">
                <div>
                  <h2 className="card-title">Step 4: Primary Business Contact Info <span className="badge badge-sm badge-info">Guild Only</span></h2>
                  <p className="text-sm text-base-content/70">Enter your business contact details for guild records and operations. Use the scope selector on any entry to mark it as <strong>Private</strong> or <strong>Primary</strong>. Nothing saved here is treated as primary unless you explicitly choose Primary.</p>
                </div>

                {loadingContacts ? (
                  <div className="flex items-center gap-2 text-sm text-base-content/60">
                    <span className="loading loading-spinner loading-sm" />
                    Loading existing contacts...
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="rounded-box border border-base-300 bg-base-200/40 p-4">
                      <h3 className="font-semibold text-base-content mb-1">Business Address</h3>
                      <p className="text-xs text-base-content/60 mb-4">Required. Use Private for guild-only storage or Primary for the direct linked contact.</p>
                      <AddressForm
                        artistID={resolvedArtistId}
                        existingContacts={businessAddressContacts}
                        defaultScope="private"
                        availableScopes={["private", "primary"]}
                        requireFullAddressFields
                        defaultLabel="work"
                        onSaved={refreshArtistContacts}
                      />
                    </div>

                    <div className="rounded-box border border-base-300 bg-base-200/40 p-4">
                      <h3 className="font-semibold text-base-content mb-1">Business Phone</h3>
                      <p className="text-xs text-base-content/60 mb-4">Required. Use Private for guild-only storage or Primary for the direct linked contact.</p>
                      <PhoneForm
                        artistID={resolvedArtistId}
                        existingContacts={businessPhoneContacts}
                        defaultScope="private"
                        availableScopes={["private", "primary"]}
                        requirePrimaryPhone
                        onSaved={refreshArtistContacts}
                      />
                    </div>

                    <div className="rounded-box border border-base-300 bg-base-200/40 p-4">
                      <h3 className="font-semibold text-base-content mb-1">Business Email</h3>
                      <p className="text-sm text-base-content/70 mb-4">Use Private for guild-only storage or Primary for the direct linked guild outreach address.</p>
                      <EmailForm
                        context="artist"
                        entityID={resolvedArtistId}
                        existingContacts={businessEmailContacts}
                        onSaved={refreshArtistContacts}
                        defaultScope="private"
                        availableScopes={["private", "primary"]}
                      />
                    </div>

                    <div className="rounded-box border border-base-300 bg-base-200/40 p-4">
                      <h3 className="font-semibold text-base-content mb-1">Business Website URL</h3>
                      <p className="text-xs text-base-content/60 mb-1">Optional but recommended</p>
                      <p className="text-sm text-base-content/70 mb-4">Use Private for guild-only storage or Primary if this should be the direct linked website contact.</p>
                      <UrlLinksForm
                        artistID={resolvedArtistId}
                        existingContacts={businessUrlContacts}
                        onSaved={refreshArtistContacts}
                        defaultScope="private"
                        availableScopes={["private", "primary"]}
                      />
                    </div>
                  </div>
                )}

                {privateContactRequirementError ? (
                  <div className="alert alert-error">
                    <span>{privateContactRequirementError}</span>
                  </div>
                ) : null}

                <div className="flex gap-2 justify-between flex-wrap pt-2">
                  <Link href={buildArtistJoinHref(3, resolvedArtistSlug)} className="btn btn-sm btn-outline">Back to Profile</Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      const hasBusinessAddress = businessAddressContacts.length > 0;
                      const hasBusinessPhone = businessPhoneContacts.length > 0;
                      const hasBusinessEmail = businessEmailContacts.length > 0;

                      if (!hasBusinessAddress || !hasBusinessPhone || !hasBusinessEmail) {
                        setPrivateContactRequirementError("Before continuing, save at least one business physical address, one business phone number, and one business email.");
                        return;
                      }

                      setPrivateContactRequirementError("");
                      completeStepAndContinue(ARTIST_REGISTRATION_STEPS.PRIVATE_CONTACTS, 5);
                    }}
                  >
                    Continue to Profile Media Editor
                  </button>
                </div>
              </div>
            </div>
          </SocialRealtimeProvider>
        )}

        {activeStep === 5 && resolvedArtistId && (
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body gap-4">
              <div>
                <h2 className="card-title">Step 5: Profile Media Editor</h2>
                <p className="text-sm text-base-content/70">Manage media in standardized folders. Anything in the folder root is active; anything moved into a timestamped subfolder is archived.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="rounded-box border border-base-300 bg-base-200/40 p-4 space-y-3">
                  <h3 className="font-semibold text-base-content">Active Profile Photo</h3>
                  {activeProfileFile ? (
                    <>
                      <div className="relative h-48 rounded-box overflow-hidden bg-base-100 border border-base-300">
                        <Image src={activeProfileFile.url} alt="Active profile" fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
                      </div>
                      <div className="text-xs text-base-content/70">Current root file: {activeProfileFile.name}</div>
                    </>
                  ) : (
                    <div className="text-sm text-base-content/60">No active profile photo found in the profile folder root.</div>
                  )}
                </div>

                <div className="rounded-box border border-base-300 bg-base-200/40 p-4 space-y-3">
                  <h3 className="font-semibold text-base-content">Active Cover Photo</h3>
                  {activeCoverFile ? (
                    <>
                      <div className="relative h-48 rounded-box overflow-hidden bg-base-100 border border-base-300">
                        <Image src={activeCoverFile.url} alt="Active cover" fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
                      </div>
                      <div className="text-xs text-base-content/70">Current root file: {activeCoverFile.name}</div>
                    </>
                  ) : (
                    <div className="text-sm text-base-content/60">No active cover photo found in the cover folder root.</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <GalleryManager
                  entityType="artist"
                  entityId={resolvedArtistId}
                  entityLabel={`Artist: ${resolvedArtistId}`}
                  currentUser={sessionUser}
                  folderKind="profile"
                  title="Profile Photo Manager"
                  allowVideo={false}
                  basePrefix={profilePrefix}
                  onFilesChanged={setProfileFiles}
                />

                <GalleryManager
                  entityType="artist"
                  entityId={resolvedArtistId}
                  entityLabel={`Artist: ${resolvedArtistId}`}
                  currentUser={sessionUser}
                  folderKind="cover"
                  title="Cover Photo Manager"
                  allowVideo={false}
                  basePrefix={coverPrefix}
                  onFilesChanged={setCoverFiles}
                />
              </div>

              <div className="rounded-box border border-base-300 bg-base-200/40 p-4">
                <h3 className="font-semibold text-base-content mb-2">Gallery Media Tools</h3>
                <p className="text-sm text-base-content/70 mb-3">Root files in the gallery folder are active gallery entries. Archive older gallery media with the archive button.</p>
                <GalleryManager
                  entityType="artist"
                  entityId={resolvedArtistId}
                  entityLabel={`Artist: ${resolvedArtistId}`}
                  currentUser={sessionUser}
                  folderKind="gallery"
                  title="Gallery Media Manager"
                  basePrefix={galleryPrefix}
                />
              </div>

              {mediaFeedback.message && (
                <div className={`alert ${mediaFeedback.type === "error" ? "alert-error" : "alert-success"}`}>
                  <span>{mediaFeedback.message}</span>
                </div>
              )}

              <div className="flex gap-2 justify-between flex-wrap">
                <Link href={buildArtistJoinHref(4, resolvedArtistSlug)} className="btn btn-sm btn-outline">Back to Business Contact Info</Link>
                <div className="flex gap-2">
                  <button type="button" className="btn btn-sm btn-primary" onClick={saveMediaSelection} disabled={isSavingMedia}>
                    {isSavingMedia ? "Saving..." : "Sync Active Profile + Cover"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    onClick={() => completeStepAndContinue(ARTIST_REGISTRATION_STEPS.MEDIA_SETUP, 6)}
                  >
                    Continue to Public Contacts
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeStep === 6 && resolvedArtistId && (
          <SocialRealtimeProvider>
            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body gap-4">
                <div>
                  <h2 className="card-title">Step 6: Public Contacts</h2>
                  <p className="text-sm text-base-content/70">These contacts will be visible on your public artist profile. ⚠️ Do NOT publish personal phone numbers or home studio addresses unless you welcome drop-in business. Use city/state only for sensitive locations, or add those details in Step 4 (Business Contact Info) instead.</p>
                </div>

                {loadingContacts ? (
                  <div className="flex items-center gap-2 text-sm text-base-content/60">
                    <span className="loading loading-spinner loading-sm" />
                    Loading existing contacts...
                  </div>
                ) : (
                  <>
                    <div role="tablist" className="tabs tabs-bordered">
                      {PUBLIC_CONTACT_TABS.map((tab) => (
                        <button
                          key={tab.key}
                          role="tab"
                          type="button"
                          className={`tab${contactsTab === tab.key ? " tab-active" : ""}`}
                          onClick={() => setContactsTab(tab.key)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {contactsTab === "public-address" && (
                      <AddressForm
                        artistID={resolvedArtistId}
                        existingContacts={publicAddressContacts}
                        defaultScope="secondary"
                        availableScopes={["secondary"]}
                        defaultLabel="office"
                        requireCityStateCountry
                        onSaved={refreshArtistContacts}
                      />
                    )}
                    {contactsTab === "public-email" && (
                      <EmailForm
                        context="artist"
                        entityID={resolvedArtistId}
                        existingContacts={publicEmailContacts}
                        defaultScope="secondary"
                        availableScopes={["secondary"]}
                        onSaved={refreshArtistContacts}
                      />
                    )}
                    {contactsTab === "public-phone" && (
                      <PhoneForm
                        artistID={resolvedArtistId}
                        existingContacts={publicPhoneContacts}
                        defaultScope="secondary"
                        availableScopes={["secondary"]}
                        onSaved={refreshArtistContacts}
                      />
                    )}
                    {contactsTab === "public-social" && (
                      <SocialHandlesForm
                        artistID={resolvedArtistId}
                        existingContacts={publicSocialContacts}
                        defaultScope="secondary"
                        availableScopes={["secondary"]}
                        onSaved={refreshArtistContacts}
                      />
                    )}
                    {contactsTab === "public-urls" && (
                      <UrlLinksForm
                        artistID={resolvedArtistId}
                        existingContacts={publicUrlContacts}
                        defaultScope="secondary"
                        availableScopes={["secondary"]}
                        onSaved={refreshArtistContacts}
                      />
                    )}
                  </>
                )}

                <div className="flex gap-2 justify-between flex-wrap pt-2">
                  <Link href={buildArtistJoinHref(5, resolvedArtistSlug)} className="btn btn-sm btn-outline">Back to Profile Media Editor</Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    onClick={() => completeStepAndContinue(ARTIST_REGISTRATION_STEPS.PUBLIC_CONTACTS, 7)}
                  >
                    Continue to Review
                  </button>
                </div>
              </div>
            </div>
          </SocialRealtimeProvider>
        )}

        {activeStep === 7 && resolvedArtistId && (
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body gap-4">
              <div>
                <h2 className="card-title">Step 7: Review &amp; Publish</h2>
                <p className="text-sm text-base-content/70">Review your setup and publish when ready. Publishing removes this registration from your join-in-progress list and makes your profile visible on the site.</p>
              </div>

              <div className="rounded-box border border-base-300 bg-base-200/40 p-4 space-y-2 text-sm">
                <div><span className="font-semibold">Title:</span> {extractPlainText(profileTitle) || "Missing"}</div>
                <div><span className="font-semibold">Slug:</span> {resolvedArtistSlug || "Missing"}</div>
                <div><span className="font-semibold">Business address on file:</span> {businessAddressContacts.length > 0 ? "Yes ✓" : "No"}</div>
                <div><span className="font-semibold">Business phone on file:</span> {businessPhoneContacts.length > 0 ? "Yes ✓" : "No"}</div>
                <div><span className="font-semibold">Business email on file:</span> {businessEmailContacts.length > 0 ? "Yes ✓" : "No"}</div>
                <div><span className="font-semibold">Public contact count:</span> {publicAddressContacts.length + publicEmailContacts.length + publicPhoneContacts.length + publicSocialContacts.length + publicUrlContacts.length}</div>
                <div><span className="font-semibold">Workflow progress:</span> {postSlugPercentComplete}%</div>
              </div>

              {publishFeedback ? (
                <div className="alert alert-error">
                  <span>{publishFeedback}</span>
                </div>
              ) : null}

              <div className="flex gap-2 justify-between flex-wrap pt-2">
                <Link href={buildArtistJoinHref(6, resolvedArtistSlug)} className="btn btn-sm btn-outline">Back to Public Contacts</Link>
                <button
                  type="button"
                  className="btn btn-sm btn-success"
                  onClick={publishArtistProfile}
                  disabled={isPublishingProfile || Boolean(stepCompletionMap[7])}
                >
                  {isPublishingProfile ? "Publishing..." : stepCompletionMap[7] ? "Published" : "Publish Artist Profile"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getArtistJoinServerProps(context, routeSlug = null, options = {}) {
  const session = await getSessionFromRequest(context);

  if (!session?.user?.id) {
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${encodeURIComponent(context.resolvedUrl || "/join/artist")}`,
        permanent: false,
      },
    };
  }

  const strictPreSlugFlow = Boolean(options?.strictPreSlugFlow);
  const currentStep = getWizardStep(context.query?.step);
  let artistId = strictPreSlugFlow ? 0 : Number(context.query?.id || 0);
  const normalizedRouteSlug = String(routeSlug || "").trim().toLowerCase();
  const sessionUserId = Number(session?.user?.id || 0);

  let artistData = null;
  let pictures = [];

  try {
    const picturesResponse = await fetch(`${apiUrl}picture`);
    if (picturesResponse.ok) {
      pictures = await picturesResponse.json();
    }
  } catch (error) {
    console.error("Unable to load pictures:", error.message);
  }

  if (normalizedRouteSlug) {
    try {
      const response = await fetch(`${apiUrl}artist/${encodeURIComponent(normalizedRouteSlug)}`);
      if (response.ok) {
        artistData = await response.json();
        artistId = Number(artistData?.artistID || artistData?.ArtistID || 0);
      }
    } catch {
      // no-op
    }
  }

  if (!strictPreSlugFlow && !artistData && !(artistId > 0) && Number.isFinite(sessionUserId) && sessionUserId > 0) {
    try {
      const linkedResponse = await fetch(`${apiUrl}linker_usertoartist/byUserID/${sessionUserId}`);
      if (linkedResponse.ok) {
        const linkedArtists = await linkedResponse.json();
        const rows = Array.isArray(linkedArtists) ? linkedArtists : [];
        const latestArtistId = rows
          .map((artist) => Number(artist?.artistID || artist?.ArtistID || 0))
          .filter((value) => Number.isFinite(value) && value > 0)
          .sort((a, b) => b - a)[0];

        if (latestArtistId) {
          artistId = latestArtistId;
        }
      }
    } catch {
      // no-op
    }
  }

  if (!strictPreSlugFlow && !artistData && artistId > 0) {
    try {
      const response = await fetch(`${apiUrl}artist/byID/${artistId}`);
      if (response.ok) {
        artistData = await response.json();
      }
    } catch (error) {
      console.error("Unable to load artist by ID:", error.message);
    }
  }

  return {
    props: {
      sessionUser: session?.user || null,
      currentStep,
      artistId: artistId > 0 ? artistId : null,
      artistData,
      pictures,
    },
  };
}

export async function getServerSideProps(context) {
  const routeSlug = String(context?.params?.slug || "").trim().toLowerCase();
  return getArtistJoinServerProps(context, routeSlug, { strictPreSlugFlow: false });
}
