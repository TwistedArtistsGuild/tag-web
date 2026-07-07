import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"

import TagSEO from "@/components/TagSEO"
import getApiURL from "@/components/widgets/GetApiURL"
import { getArtistRegistrationProgress } from "@/utils/onboarding/artistWorkflow"
import { clearVendorRegistrationProgress, getVendorRegistrationProgress } from "@/utils/onboarding/vendorWorkflow"
import { clearVenueRegistrationProgress, getVenueRegistrationProgress } from "@/utils/onboarding/venueWorkflow"

const apiUrl = getApiURL()

function getRequestOrigin(req) {
  const forwardedProto = String(req?.headers?.["x-forwarded-proto"] || "").split(",")[0].trim()
  const forwardedHost = String(req?.headers?.["x-forwarded-host"] || "").trim()
  const host = forwardedHost || String(req?.headers?.host || "").trim()

  if (!host) {
    return null
  }

  const protocol = forwardedProto || (process.env.NODE_ENV === "development" ? "http" : "https")
  return `${protocol}://${host}`
}

async function getSessionFromRequest(context) {
  const origin = getRequestOrigin(context?.req)
  if (!origin) {
    return null
  }

  try {
    const response = await fetch(`${origin}/api/auth/session`, {
      headers: {
        cookie: context?.req?.headers?.cookie || "",
      },
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch {
    return null
  }
}

function normalizeArtistPath(artist) {
  return String(artist?.path || artist?.Path || "").trim().toLowerCase()
}

function normalizeArtistId(artist) {
  const parsed = Number(artist?.artistID || artist?.ArtistID || 0)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function toPositiveNumber(value) {
  const parsed = Number(value || 0)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function getArtistDisplayTitle(artist) {
  return artist?.title || artist?.Title || artist?.name || artist?.Name || "Untitled Artist"
}

function resolveNextJoinStep(progress) {
  const raw = Number(progress?.currentStep || 3)
  if (Number.isFinite(raw) && raw >= 3 && raw <= 6) {
    return raw
  }

  return 3
}

function buildDraftFromProgress(progress, type) {
  if (!progress || typeof progress !== "object") {
    return null
  }

  const entityId = Number(progress?.entityId || 0)
  const slug = String(progress?.slug || "").trim().toLowerCase()
  if (!entityId || !slug) {
    return null
  }

  const title = String(progress?.title || "").trim()
  const nextStep = resolveNextJoinStep(progress)

  return {
    type,
    entityId,
    slug,
    title,
    nextStep,
  }
}

function buildArtistProgress(artist) {
  const slug = normalizeArtistPath(artist)
  const artistID = normalizeArtistId(artist)
  const profilePicID = toPositiveNumber(artist?.profilePicID || artist?.ProfilePicID)
  const coverPicID = toPositiveNumber(artist?.coverPicID || artist?.CoverPicID)
  const contactCount = toPositiveNumber(artist?.contactCount || artist?.ContactCount)
  const isPublished = Boolean(artist?.isPublished || artist?.IsPublished)

  const titleValue = String(artist?.title || artist?.Title || "").trim()
  const hasCountry = Boolean(String(artist?.country || artist?.Country || "").trim())
  const hasStateOrProvince = Boolean(String(artist?.stateOrProvince || artist?.StateOrProvince || "").trim())
  const hasBusinessEntityType = Boolean(String(artist?.businessEntityType || artist?.BusinessEntityType || "").trim())
  const hasIncorporationStatus = typeof artist?.isFormallyIncorporated === "boolean"
    || typeof artist?.IsFormallyIncorporated === "boolean"

  const hasProfilePacketData = Boolean(
    titleValue &&
    hasCountry &&
    hasStateOrProvince &&
    hasBusinessEntityType &&
    hasIncorporationStatus
  )

  const steps = [
    { step: 2, label: "Slug reserved", done: Boolean(slug) },
    { step: 3, label: "Profile packets", done: hasProfilePacketData },
    { step: 5, label: "Media selected", done: Boolean(profilePicID || coverPicID) },
    { step: 6, label: "Contacts", done: Boolean(contactCount) },
  ]

  const completed = steps.filter((s) => s.done).length
  const allDone = completed === steps.length
  const nextIncompleteStep = steps.find((s) => !s.done)?.step || 3

  return {
    artistID,
    slug,
    title: getArtistDisplayTitle(artist),
    isPublished,
    completed,
    total: steps.length,
    allDone,
    nextIncompleteStep,
    steps,
  }
}

export default function JoinIndexPage({ artistProgressRows = [], sessionUserId = null, sessionUser = null, userRegistrationComplete = false }) {
  const [hydratedRows, setHydratedRows] = useState([])
  const [vendorDraft, setVendorDraft] = useState(null)
  const [venueDraft, setVenueDraft] = useState(null)
  const [deletedRegistrationKeys, setDeletedRegistrationKeys] = useState([])
  const [deletingRegistrationKey, setDeletingRegistrationKey] = useState("")
  const [actionFeedback, setActionFeedback] = useState({ type: "", message: "" })
  const baseRows = useMemo(() => (Array.isArray(artistProgressRows) ? artistProgressRows : []), [artistProgressRows])
  const isAdminUser = Array.isArray(sessionUser?.roles) && sessionUser.roles.includes("admin")
  const canAccessOtherRegistrations = isAdminUser || userRegistrationComplete
  const showOtherRegistrationsView = canAccessOtherRegistrations
  const deletedKeySet = useMemo(() => new Set(deletedRegistrationKeys), [deletedRegistrationKeys])

  const makeRegistrationKey = useCallback((type, entityId) => `${String(type || "").trim().toLowerCase()}:${Number(entityId || 0)}`, [])

  const deleteRegistration = useCallback(async ({ type, entityId, title }) => {
    const normalizedType = String(type || "").trim().toLowerCase()
    const resolvedEntityId = Number(entityId || 0)

    if (!resolvedEntityId || !["artist", "vendor", "venue"].includes(normalizedType)) {
      return
    }

    const targetName = title || `${normalizedType} ${resolvedEntityId}`
    const confirmed = window.confirm(
      `Delete ${targetName} (ID: ${resolvedEntityId})?\n\nThis will permanently remove this registration from the database. This action cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    const endpoint = `${apiUrl}${normalizedType}/${resolvedEntityId}`
    const registrationKey = makeRegistrationKey(normalizedType, resolvedEntityId)

    setDeletingRegistrationKey(registrationKey)
    setActionFeedback({ type: "", message: "" })

    try {
      const response = await fetch(endpoint, { method: "DELETE" })
      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || `Unable to delete ${normalizedType} registration (${response.status}).`)
      }

      setDeletedRegistrationKeys((previous) => (
        previous.includes(registrationKey) ? previous : [...previous, registrationKey]
      ))

      if (normalizedType === "vendor") {
        clearVendorRegistrationProgress()
        setVendorDraft(null)
      }

      if (normalizedType === "venue") {
        clearVenueRegistrationProgress()
        setVenueDraft(null)
      }

      if (normalizedType === "artist") {
        setHydratedRows((previous) => previous.filter((row) => Number(row?.artistID || 0) !== resolvedEntityId))
      }

      setActionFeedback({ type: "success", message: `${targetName} was deleted.` })
    } catch (error) {
      setActionFeedback({ type: "error", message: error?.message || `Unable to delete ${targetName}.` })
    } finally {
      setDeletingRegistrationKey("")
    }
  }, [makeRegistrationKey])

  const rows = useMemo(() => {
    if (!hydratedRows.length) {
      return baseRows
    }

    const mapByArtistId = new Map()
    for (const row of baseRows) {
      mapByArtistId.set(Number(row?.artistID || 0), row)
    }

    for (const row of hydratedRows) {
      mapByArtistId.set(Number(row?.artistID || 0), row)
    }

    return Array.from(mapByArtistId.values())
  }, [baseRows, hydratedRows])

  useEffect(() => {
    let cancelled = false

    const hydrateFromLocalProgress = async () => {
      const progress = getArtistRegistrationProgress?.() || null
      const localArtistId = Number(progress?.entityId || 0)
      if (!Number.isFinite(localArtistId) || localArtistId <= 0) {
        return
      }

      const alreadyPresent = baseRows.some((row) => Number(row?.artistID || 0) === localArtistId)
      if (alreadyPresent) {
        return
      }

      try {
        const [artistRes, contactsRes] = await Promise.all([
            fetch(`/api/artist/byID/${localArtistId}`),
          fetch(`${apiUrl}contact/artist/${localArtistId}?includePrivate=true`),
        ])

        if (!artistRes.ok) {
          return
        }

        const artist = await artistRes.json()
        let contactCount = 0
        if (contactsRes.ok) {
          const contactsData = await contactsRes.json()
          const contactRows = Array.isArray(contactsData?.contacts) ? contactsData.contacts : []
          contactCount = contactRows.length
        }

        const progressRow = buildArtistProgress({ ...artist, contactCount })

        if (!cancelled) {
          setHydratedRows((previous) => {
            const hasRow = previous.some((row) => Number(row?.artistID || 0) === localArtistId)
            return hasRow ? previous : [progressRow, ...previous]
          })
        }

        const normalizedUserId = Number(sessionUserId || 0)
        if (Number.isFinite(normalizedUserId) && normalizedUserId > 0) {
          try {
            await fetch(`${apiUrl}linker_usertoartist`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                UserID: normalizedUserId,
                ArtistID: localArtistId,
                Role: "owner",
              }),
            })
          } catch {
            // Best-effort backfill only.
          }
        }
      } catch {
        // Ignore hydration failures.
      }
    }

    hydrateFromLocalProgress()

    return () => {
      cancelled = true
    }
  }, [baseRows, sessionUserId])

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const vendorProgress = getVendorRegistrationProgress?.() || null
      const venueProgress = getVenueRegistrationProgress?.() || null

      setVendorDraft(buildDraftFromProgress(vendorProgress, "vendor"))
      setVenueDraft(buildDraftFromProgress(venueProgress, "venue"))
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [])

  const pageMetaData = {
    title: "Join",
    description: "Entry point for join and onboarding flows.",
    keywords: "join, onboarding, registration",
    robots: "noindex, nofollow",
    og: {
      title: "Join",
      description: "Entry point for join and onboarding flows.",
    },
  }

  const visibleRows = rows.filter((artist) => {
    if (artist.isPublished) {
      return false
    }

    const artistId = Number(artist?.artistID || 0)
    return !deletedKeySet.has(makeRegistrationKey("artist", artistId))
  })
  const inProgressArtists = visibleRows.filter((a) => !a.allDone)
  const completedArtists = visibleRows.filter((a) => a.allDone)

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="join" />

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-base-content">Join</h1>
            <p className="text-base-content/70">
              Choose a registration area below. Each section routes into its own onboarding folder and published forms.
            </p>
          </div>
        </div>

        {actionFeedback.message ? (
          <div className={`alert ${actionFeedback.type === "error" ? "alert-error" : "alert-success"}`}>
            <span>{actionFeedback.message}</span>
          </div>
        ) : null}

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="card-title text-base">New User Registration</h2>
              <span className={`badge badge-sm ${userRegistrationComplete ? "badge-success" : "badge-warning"}`}>
                {userRegistrationComplete ? "Completed" : "Required before other registrations"}
              </span>
            </div>
            <p className="text-sm text-base-content/70">User onboarding runs once. Complete it first, then continue to artist, venue, or vendor registration flows.</p>
            <div className="flex flex-wrap items-center gap-2">
              {!userRegistrationComplete ? (
                <Link href="/join/user" className="btn btn-sm btn-primary">
                  Continue User Registration
                </Link>
              ) : null}
              {!userRegistrationComplete ? (
                <span className="text-xs text-base-content/60">Other registration panels stay hidden until this is complete.</span>
              ) : null}
            </div>
          </div>
        </div>

        {!isAdminUser && !userRegistrationComplete ? (
          <div className="alert alert-warning">
            <span>Complete user registration first to unlock artist, venue, and vendor registration panels.</span>
          </div>
        ) : null}

        {showOtherRegistrationsView && inProgressArtists.length > 0 && (
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="card-title text-warning">Artist Registrations In Progress</h2>
                <Link href="/join/artist?step=1" className="btn btn-sm btn-outline">
                  Register New Artist
                </Link>
              </div>
              <p className="text-sm text-base-content/70">Pick up where you left off. Completed registrations are managed from the Artist Portal.</p>
              <div className="space-y-3">
                {inProgressArtists.map((artist) => (
                  <div
                    key={`inprogress-${artist.artistID || artist.slug}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-md border border-base-300 bg-base-200 p-3"
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-base-content">
                        {artist.title}
                        {artist.slug ? <span className="ml-1 text-xs text-base-content/60 font-normal">/{artist.slug}</span> : null}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {artist.steps.map((s) => (
                          <span key={s.label} className={`badge badge-xs ${s.done ? "badge-success" : "badge-neutral"}`}>
                            {s.done ? "✓" : s.step} {s.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:ml-auto">
                      <button
                        type="button"
                        className="btn btn-sm btn-error btn-outline whitespace-nowrap"
                        disabled={deletingRegistrationKey === makeRegistrationKey("artist", artist.artistID)}
                        onClick={() => deleteRegistration({
                          type: "artist",
                          entityId: artist.artistID,
                          title: artist.title,
                        })}
                      >
                        {deletingRegistrationKey === makeRegistrationKey("artist", artist.artistID) ? "Deleting..." : "Delete"}
                      </button>
                      <Link
                        href={artist.slug
                          ? `/join/artist/${encodeURIComponent(artist.slug)}?step=${artist.nextIncompleteStep}`
                          : `/join/artist?step=${artist.nextIncompleteStep}`}
                        className="btn btn-sm btn-warning whitespace-nowrap"
                      >
                        Continue Step {artist.nextIncompleteStep}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showOtherRegistrationsView && vendorDraft && !deletedKeySet.has(makeRegistrationKey("vendor", vendorDraft.entityId)) ? (
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="card-title text-warning">Vendor Registration In Progress</h2>
                <Link href="/join/vendor?step=1" className="btn btn-sm btn-outline">
                  Register New Vendor
                </Link>
              </div>
              <p className="text-sm text-base-content/70">Continue your vendor draft or start a new one from the vendor join page.</p>
              <div className="flex flex-wrap items-center gap-2 rounded-md border border-base-300 bg-base-200 p-3">
                <span className="text-sm font-semibold">{vendorDraft.title || "Untitled Vendor"}</span>
                <span className="badge badge-sm">/{vendorDraft.slug}</span>
                <span className="badge badge-sm badge-outline">ID: {vendorDraft.entityId}</span>
                <div className="ml-auto" />
                <button
                  type="button"
                  className="btn btn-sm btn-error btn-outline"
                  disabled={deletingRegistrationKey === makeRegistrationKey("vendor", vendorDraft.entityId)}
                  onClick={() => deleteRegistration({
                    type: "vendor",
                    entityId: vendorDraft.entityId,
                    title: vendorDraft.title || "Vendor",
                  })}
                >
                  {deletingRegistrationKey === makeRegistrationKey("vendor", vendorDraft.entityId) ? "Deleting..." : "Delete"}
                </button>
                <Link
                  href={`/join/vendor/${encodeURIComponent(vendorDraft.slug)}?step=${vendorDraft.nextStep}&id=${vendorDraft.entityId}`}
                  className="btn btn-sm btn-warning"
                >
                  Continue Vendor Step {vendorDraft.nextStep}
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        {showOtherRegistrationsView && venueDraft && !deletedKeySet.has(makeRegistrationKey("venue", venueDraft.entityId)) ? (
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="card-title text-warning">Venue Registration In Progress</h2>
                <Link href="/join/venue?step=1" className="btn btn-sm btn-outline">
                  Register New Venue
                </Link>
              </div>
              <p className="text-sm text-base-content/70">Continue your venue draft or start a new one from the venue join page.</p>
              <div className="flex flex-wrap items-center gap-2 rounded-md border border-base-300 bg-base-200 p-3">
                <span className="text-sm font-semibold">{venueDraft.title || "Untitled Venue"}</span>
                <span className="badge badge-sm">/{venueDraft.slug}</span>
                <span className="badge badge-sm badge-outline">ID: {venueDraft.entityId}</span>
                <div className="ml-auto" />
                <button
                  type="button"
                  className="btn btn-sm btn-error btn-outline"
                  disabled={deletingRegistrationKey === makeRegistrationKey("venue", venueDraft.entityId)}
                  onClick={() => deleteRegistration({
                    type: "venue",
                    entityId: venueDraft.entityId,
                    title: venueDraft.title || "Venue",
                  })}
                >
                  {deletingRegistrationKey === makeRegistrationKey("venue", venueDraft.entityId) ? "Deleting..." : "Delete"}
                </button>
                <Link
                  href={`/join/venue/${encodeURIComponent(venueDraft.slug)}?step=${venueDraft.nextStep}&id=${venueDraft.entityId}`}
                  className="btn btn-sm btn-warning"
                >
                  Continue Venue Step {venueDraft.nextStep}
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        {showOtherRegistrationsView && completedArtists.length > 0 && (
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body gap-2">
              <h2 className="card-title text-success text-base">Completed Artist Registrations</h2>
              <div className="flex flex-wrap gap-2">
                {completedArtists.map((artist) => (
                  <Link
                    key={`done-${artist.artistID || artist.slug}`}
                    href={`/portal/artist/${artist.slug}`}
                    className="btn btn-sm btn-success btn-outline"
                  >
                    {artist.title} — Open Portal
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSessionFromRequest(context)
  const sessionUserId = Number(session?.user?.id || 0)
  let userRegistrationComplete = false

  if (!Number.isFinite(sessionUserId) || sessionUserId <= 0) {
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${encodeURIComponent(context.resolvedUrl || "/join")}`,
        permanent: false,
      },
    }
  }

  try {
    const userDetailsRes = await fetch(`${apiUrl}user-details/${sessionUserId}/private?viewerUserId=${sessionUserId}`)
    if (userDetailsRes.ok) {
      const userData = await userDetailsRes.json()
      const username = String(userData?.username || userData?.Username || "").trim().toLowerCase()
      userRegistrationComplete = Boolean(username)
    }
  } catch {
    // Keep default false when user details cannot be resolved.
  }

  let linkedArtists = []

  try {
    const linkedResponse = await fetch(`${apiUrl}linker_usertoartist/byUserID/${sessionUserId}`)
    if (linkedResponse.ok) {
      const linkedData = await linkedResponse.json()
      linkedArtists = Array.isArray(linkedData) ? linkedData : []
    }
  } catch (error) {
    console.error("Unable to load linked artists on join page:", error.message)
  }

  const withReservedSlug = linkedArtists.filter((artist) => Boolean(normalizeArtistPath(artist)))

  const enrichedArtists = await Promise.all(
    withReservedSlug.map(async (artist) => {
      const artistID = normalizeArtistId(artist)
      if (!artistID) return artist

      let enriched = artist
      try {
        const response = await fetch(`/api/artist/byID/${artistID}`)
        if (response.ok) {
          enriched = await response.json()
        }
      } catch {
      }

      // Check if any contacts exist for step 4 progress detection
      let contactCount = 0
      try {
        const contactsRes = await fetch(`${apiUrl}contact/artist/${artistID}?includePrivate=true`)
        if (contactsRes.ok) {
          const contactsData = await contactsRes.json()
          const rows = Array.isArray(contactsData?.contacts) ? contactsData.contacts : []
          contactCount = rows.length
        }
      } catch {
      }

      return { ...enriched, contactCount }
    })
  )

  const unpublishedArtists = enrichedArtists.filter((artist) => !Boolean(artist?.isPublished || artist?.IsPublished))

  return {
    props: {
      artistProgressRows: unpublishedArtists.map(buildArtistProgress),
      sessionUserId,
      sessionUser: session?.user || null,
      userRegistrationComplete,
    },
  }
}
