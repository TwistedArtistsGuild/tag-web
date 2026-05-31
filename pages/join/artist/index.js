import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { useEffect, useMemo, useState } from "react";

import TagSEO from "@/components/TagSEO";
import CountryRegionSelector, {
  getCountryLabel,
  getRegionLabel,
} from "@/components/forms/country-region-selector";
import RegisterSlug from "@/components/forms/register_slug";
import DynaFormDB from "@/components/widgets/DynaFormDB";
import getApiURL from "@/components/widgets/GetApiURL";
import GalleryManager from "@/components/gallery/GalleryManager";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
  getArtistRegistrationProgress,
  markArtistRegistrationStepComplete,
  setArtistRegistrationProgress,
} from "@/utils/onboarding/artistWorkflow";
import { SocialRealtimeProvider } from "@/components/social/SocialRealtimeContext";
import SocialHandlesForm from "@/components/social/contact/social-handles-form";
import AddressForm from "@/components/social/contact/address-form";
import EmailForm from "@/components/social/contact/email-form";
import PhoneForm from "@/components/social/contact/phone-form";
import UrlLinksForm from "@/components/social/contact/url-links-form";

const apiUrl = getApiURL();
const formName = "ArtistForm1";
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

function getWizardStep(rawStep) {
  const parsed = Number(rawStep || 1);
  if (parsed === 4) {
    return 4;
  }

  if (parsed === 3) {
    return 3;
  }

  return parsed === 2 ? 2 : 1;
}

function buildArtistJoinHref(step, id) {
  if (id) return `/join/artist?step=${step}&id=${id}`;
  return `/join/artist?step=${step}`;
}

const CONTACT_TABS = [
  { key: "address", label: "Address" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "social", label: "Social Handles" },
  { key: "urls", label: "URLs" },
];

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

export default function JoinArtistIndexPage({ sessionUser, currentStep, artistId, metadataProp, artistData, pictures }) {
  const initialProgress = typeof window !== "undefined" ? (getArtistRegistrationProgress?.() || {}) : {};
  const [resolvedArtistId] = useState(artistId || initialProgress.entityId || null);
  const [liveArtistData, setLiveArtistData] = useState(artistData || null);
  const [country, setCountry] = useState(initialProgress.country || "");
  const [stateOrProvince, setStateOrProvince] = useState(initialProgress.stateOrProvince || "");
  const [businessEntityType, setBusinessEntityType] = useState(initialProgress.businessEntityType || "");
  const [incorporationStatus, setIncorporationStatus] = useState(initialProgress.incorporationStatus || "");
  const [incorporatedYear, setIncorporatedYear] = useState(initialProgress.incorporatedYear || "");
  const [profileFiles, setProfileFiles] = useState([]);
  const [coverFiles, setCoverFiles] = useState([]);
  const [mediaFeedback, setMediaFeedback] = useState({ type: "", message: "" });
  const [isSavingMedia, setIsSavingMedia] = useState(false);

  const [contactsTab, setContactsTab] = useState("address");
  const [socialContacts, setSocialContacts] = useState([]);
  const [urlContacts, setUrlContacts] = useState([]);
  const [emailContacts, setEmailContacts] = useState([]);
  const [phoneContacts, setPhoneContacts] = useState([]);
  const [addressContacts, setAddressContacts] = useState([]);
  const [primaryPhone, setPrimaryPhone] = useState(null);
  const [primaryAddress, setPrimaryAddress] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(false);

  useEffect(() => {
    if (!resolvedArtistId) {
      return;
    }

    let cancelled = false;

    const loadArtistData = async () => {
      try {
        const response = await fetch(`${apiUrl}artist/byID/${resolvedArtistId}`);
        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        if (!cancelled) {
          setLiveArtistData(payload);
        }
      } catch {
        if (!cancelled) {
          setLiveArtistData(null);
        }
      }
    };

    loadArtistData();

    return () => {
      cancelled = true;
    };
  }, [resolvedArtistId]);

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

  const baseMetadata = Array.isArray(metadataProp) ? metadataProp[0] : metadataProp;
  const filteredStep2Metadata = useMemo(() => {
    if (!baseMetadata) {
      return null;
    }

    const hiddenStep3FieldNames = new Set(["since", "galleryid", "profilepicid", "coverpicid", "primarycontactid", "byline"]);
    const fields = Array.isArray(baseMetadata.forms_Fields) ? baseMetadata.forms_Fields : [];

    return {
      ...baseMetadata,
      forms_Fields: fields.filter((field) => {
        const rawName = field?.name || field?.Name || "";
        return !hiddenStep3FieldNames.has(String(rawName).toLowerCase());
      }),
    };
  }, [baseMetadata]);

  const enhancedMetadata = baseMetadata && resolvedArtistId
    ? {
        ...filteredStep2Metadata,
        FromURL: "/join/artist",
        redirectURL: "",
        APIURL: `${apiUrl}artist/byID/${resolvedArtistId}`,
      }
    : null;

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


  useEffect(() => {
    if (currentStep !== 4 || !resolvedArtistId) return;
    let cancelled = false;

    const loadContacts = async () => {
      setLoadingContacts(true);
      try {
        const r = await fetch(`${apiUrl}contact/artist/${resolvedArtistId}`);
        if (cancelled || !r.ok) return;
        const data = await r.json();
        if (cancelled) return;
        const rows = Array.isArray(data.contacts) ? data.contacts : [];
        setPrimaryPhone(data.primaryPhone || null);
        setPrimaryAddress(data.primaryAddress || null);
        setPhoneContacts(rows.filter((c) => String(c?.contactType || "").toLowerCase() === "phone"));
        setEmailContacts(rows.filter((c) => String(c?.contactType || "").toLowerCase() === "email"));
        setAddressContacts(rows.filter((c) => String(c?.contactType || "").toLowerCase() === "address"));
        setUrlContacts(rows.filter((c) => String(c?.contactType || "").toLowerCase() === "url" && String(c?.category || "").toLowerCase() === "website"));
        setSocialContacts(rows.filter((c) => String(c?.contactType || "").toLowerCase() === "url" && String(c?.category || "").toLowerCase() !== "website"));
      } catch {
      } finally {
        if (!cancelled) setLoadingContacts(false);
      }
    };

    loadContacts();
    return () => { cancelled = true; };
  }, [currentStep, resolvedArtistId]);

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
              Browse back and forth between registration pages. Step 1 reserves slug and row; Step 2 sends profile packets; Step 3 sets media and gallery; Step 4 sets contacts.
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body gap-3">
            <div className="flex gap-2 flex-wrap">
              <Link href={buildArtistJoinHref(1, resolvedArtistId)} className={`btn btn-sm ${currentStep === 1 ? "btn-primary" : "btn-outline"}`}>
                1. Reserve Slug
              </Link>
              <Link href={buildArtistJoinHref(2, resolvedArtistId)} className={`btn btn-sm ${currentStep === 2 ? "btn-primary" : "btn-outline"}`}>
                2. Profile Packets
              </Link>
              <Link href={buildArtistJoinHref(3, resolvedArtistId)} className={`btn btn-sm ${currentStep === 3 ? "btn-primary" : "btn-outline"}`}>
                3. Media Selector
              </Link>
              <Link href={buildArtistJoinHref(4, resolvedArtistId)} className={`btn btn-sm ${currentStep === 4 ? "btn-primary" : "btn-outline"}`}>
                4. Contacts
              </Link>
              {resolvedArtistId && <span className="badge badge-info">Artist ID: {resolvedArtistId}</span>}
            </div>
          </div>
        </div>

        {currentStep === 1 && (
          <RegisterSlug
            domain="artist"
            domainLabel="Artist"
            apiBaseUrl={apiUrl}
            reserveEndpoint={`${apiUrl}artist/reserve-slug`}
            updateEndpoint={(id) => `${apiUrl}artist/${id}/update-slug`}
            checkEndpoint={(candidateSlug, currentId) => `${apiUrl}artist/check-slug/${encodeURIComponent(candidateSlug)}${currentId ? `?excludeId=${encodeURIComponent(currentId)}` : ""}`}
            nextRoute={(id) => buildArtistJoinHref(2, id)}
            sessionUser={sessionUser}
            progressApi={{
              getProgress: getArtistRegistrationProgress,
              setProgress: setArtistRegistrationProgress,
              markStepComplete: markArtistRegistrationStepComplete,
            }}
            extendPayload={() => {
              const trimmedCountry = country.trim();
              const trimmedStateOrProvince = stateOrProvince.trim();
              const countryLabel = getCountryLabel(trimmedCountry);
              const regionLabel = getRegionLabel(trimmedCountry, trimmedStateOrProvince);

              if (!incorporationStatus) {
                return { errorMessage: "Incorporation status is required." };
              }

              if (!trimmedCountry) {
                return { errorMessage: "Country is required." };
              }

              if (!trimmedStateOrProvince) {
                return { errorMessage: "State or province is required." };
              }

              if (!businessEntityType) {
                return { errorMessage: "Business entity type is required." };
              }

              const isIncorporated = incorporationStatus === "true";
              const parsedYear = incorporatedYear ? Number(incorporatedYear) : null;
              const validYear = parsedYear && parsedYear >= 1800 && parsedYear <= new Date().getFullYear() ? parsedYear : null;
              if (isIncorporated && incorporatedYear && !validYear) {
                return { errorMessage: "Incorporated year must be a valid 4-digit year." };
              }

              return {
                payload: {
                  country: countryLabel || trimmedCountry,
                  stateOrProvince: regionLabel || trimmedStateOrProvince,
                  businessEntityType,
                  isFormallyIncorporated: isIncorporated,
                  incorporatedYear: isIncorporated ? validYear : null,
                },
                progress: {
                  country: trimmedCountry,
                  stateOrProvince: trimmedStateOrProvince,
                  businessEntityType,
                  incorporationStatus,
                  incorporatedYear: incorporatedYear || "",
                },
              };
            }}
          >
            <div className="space-y-4">
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

              {incorporationStatus !== "" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CountryRegionSelector
                    country={country}
                    region={stateOrProvince}
                    onCountryChange={setCountry}
                    onRegionChange={setStateOrProvince}
                    countryLabel="Country"
                    regionLabel="State or Region"
                  />

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
              )}
            </div>
          </RegisterSlug>
        )}

        {currentStep === 2 && !resolvedArtistId && (
          <div className="alert alert-warning">
            <span>Start at Step 1 first so we can reserve your slug and create the artist record.</span>
          </div>
        )}

        {currentStep === 2 && resolvedArtistId && !enhancedMetadata && (
          <div className="alert alert-error">
            <span>Unable to load form metadata for ArtistForm1.</span>
          </div>
        )}

        {currentStep === 2 && resolvedArtistId && enhancedMetadata && (
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body">
              <DynaFormDB request="update" metadataProp={enhancedMetadata} formData={liveArtistData} />
              <div className="mt-4 flex gap-2 justify-between flex-wrap">
                <Link href={buildArtistJoinHref(1, resolvedArtistId)} className="btn btn-sm btn-outline">Back to Slug Step</Link>
                <Link href={buildArtistJoinHref(3, resolvedArtistId)} className="btn btn-sm btn-primary">Continue to Media Selector</Link>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && !resolvedArtistId && (
          <div className="alert alert-warning">
            <span>Start at Step 1 first so we can reserve your slug and create the artist record.</span>
          </div>
        )}

        {currentStep === 3 && resolvedArtistId && (
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body gap-4">
              <div>
                <h2 className="card-title">Step 3: Picture and Gallery Selection</h2>
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
                <Link href={buildArtistJoinHref(2, resolvedArtistId)} className="btn btn-sm btn-outline">Back to Profile Step</Link>
                <div className="flex gap-2">
                  <button type="button" className="btn btn-sm btn-primary" onClick={saveMediaSelection} disabled={isSavingMedia}>
                    {isSavingMedia ? "Saving..." : "Sync Active Profile + Cover"}
                  </button>
                  <Link href={buildArtistJoinHref(4, resolvedArtistId)} className="btn btn-sm btn-success">Continue to Contacts</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && !resolvedArtistId && (
          <div className="alert alert-warning">
            <span>Start at Step 1 first so we can reserve your slug and create the artist record.</span>
          </div>
        )}

        {currentStep === 4 && resolvedArtistId && (
          <SocialRealtimeProvider>
            <div className="card bg-base-100 shadow border border-base-300">
              <div className="card-body gap-4">
                <div>
                  <h2 className="card-title">Step 4: Contacts</h2>
                  <p className="text-sm text-base-content/70">Add at least a business address and email before finishing registration. You can add phone, social handles, and URLs too.</p>
                </div>

                {loadingContacts ? (
                  <div className="flex items-center gap-2 text-sm text-base-content/60">
                    <span className="loading loading-spinner loading-sm" />
                    Loading existing contacts...
                  </div>
                ) : (
                  <>
                    <div role="tablist" className="tabs tabs-bordered">
                      {CONTACT_TABS.map((tab) => (
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

                    {contactsTab === "address" && (
                      <AddressForm
                        artistID={resolvedArtistId}
                        existingContacts={addressContacts}
                        primaryAddress={primaryAddress}
                      />
                    )}
                    {contactsTab === "email" && (
                      <EmailForm
                        context="artist"
                        entityID={resolvedArtistId}
                        existingContacts={emailContacts}
                      />
                    )}
                    {contactsTab === "phone" && (
                      <PhoneForm
                        artistID={resolvedArtistId}
                        existingContacts={phoneContacts}
                        primaryPhone={primaryPhone}
                      />
                    )}
                    {contactsTab === "social" && (
                      <SocialHandlesForm
                        artistID={resolvedArtistId}
                        existingContacts={socialContacts}
                      />
                    )}
                    {contactsTab === "urls" && (
                      <UrlLinksForm
                        artistID={resolvedArtistId}
                        existingContacts={urlContacts}
                      />
                    )}
                  </>
                )}

                <div className="flex gap-2 justify-between flex-wrap pt-2">
                  <Link href={buildArtistJoinHref(3, resolvedArtistId)} className="btn btn-sm btn-outline">Back to Media Step</Link>
                  <Link href="/portal/artist" className="btn btn-sm btn-success">Finish and Open Artist Portal</Link>
                </div>
              </div>
            </div>
          </SocialRealtimeProvider>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const currentStep = getWizardStep(context.query?.step);
  const artistId = Number(context.query?.id || 0);

  let metadataProp = null;
  let artistData = null;
  let pictures = [];

  try {
    metadataProp = await fetchFormMetadata();
  } catch (error) {
    console.error("Unable to load artist form metadata:", error.message);
  }

  try {
    const picturesResponse = await fetch(`${apiUrl}picture`);
    if (picturesResponse.ok) {
      pictures = await picturesResponse.json();
    }
  } catch (error) {
    console.error("Unable to load pictures:", error.message);
  }

  if (artistId > 0) {
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
      metadataProp,
      artistData,
      pictures,
    },
  };
}
