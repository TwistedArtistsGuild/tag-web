import Link from "next/link"
import { getServerSession } from "next-auth/next"

import TagSEO from "@/components/TagSEO"
import getApiURL from "@/components/widgets/GetApiURL"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

const JOIN_SECTIONS = [
  {
    href: "/join/artist",
    title: "Artist",
    description: "Artist onboarding, registration forms, and creator application workflows.",
    countLabel: "Artist onboarding flow",
  },
  {
    href: "/join/user",
    title: "User",
    description: "General user onboarding and account-creation flows.",
    countLabel: "User onboarding flow",
  },
  {
    href: "/join/vendor",
    title: "Vendor",
    description: "Vendor onboarding and marketplace participation forms.",
    countLabel: "No forms published yet",
  },
]

const apiUrl = getApiURL()

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

function buildArtistProgress(artist) {
  const slug = normalizeArtistPath(artist)
  const artistID = normalizeArtistId(artist)
  const profilePicID = toPositiveNumber(artist?.profilePicID || artist?.ProfilePicID)
  const coverPicID = toPositiveNumber(artist?.coverPicID || artist?.CoverPicID)
  const contactCount = toPositiveNumber(artist?.contactCount || artist?.ContactCount)

  const hasProfilePacketData = Boolean(
    String(artist?.bio || artist?.Bio || "").trim() ||
    String(artist?.missionStatement || artist?.MissionStatement || "").trim() ||
    String(artist?.artistStatement || artist?.ArtistStatement || "").trim() ||
    String(artist?.legalEntityName || artist?.LegalEntityName || "").trim()
  )

  const steps = [
    { step: 1, label: "Slug reserved", done: Boolean(slug) },
    { step: 2, label: "Profile packets", done: hasProfilePacketData },
    { step: 3, label: "Media selected", done: Boolean(profilePicID || coverPicID) },
    { step: 4, label: "Contacts", done: Boolean(contactCount) },
  ]

  const completed = steps.filter((s) => s.done).length
  const allDone = completed === steps.length
  const nextIncompleteStep = steps.find((s) => !s.done)?.step || 1

  return {
    artistID,
    slug,
    title: getArtistDisplayTitle(artist),
    completed,
    total: steps.length,
    allDone,
    nextIncompleteStep,
    steps,
  }
}

export default function JoinIndexPage({ artistProgressRows = [] }) {
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

  const inProgressArtists = artistProgressRows.filter((a) => !a.allDone)
  const completedArtists = artistProgressRows.filter((a) => a.allDone)

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

        {inProgressArtists.length > 0 && (
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body gap-3">
              <h2 className="card-title text-warning">Artist Registrations In Progress</h2>
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
                    <Link
                      href={`/join/artist?step=${artist.nextIncompleteStep}&id=${artist.artistID}`}
                      className="btn btn-sm btn-warning whitespace-nowrap"
                    >
                      Continue Step {artist.nextIncompleteStep}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {JOIN_SECTIONS.map((section) => (
            <div key={section.href} className="card bg-base-100 shadow border border-base-300">
              <div className="card-body">
                <h2 className="card-title">{section.title}</h2>
                <p className="text-sm text-base-content/70">{section.description}</p>
                <div className="pt-2">
                  <Link href={section.href} className="btn btn-sm btn-outline">
                    {section.href === "/join/artist" ? "Register New Artist" : "Get Started"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {completedArtists.length > 0 && (
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
  const session = await getServerSession(context.req, context.res, authOptions)
  const sessionUserId = Number(session?.user?.id || 0)

  if (!Number.isFinite(sessionUserId) || sessionUserId <= 0) {
    return {
      props: {
        artistProgressRows: [],
      },
    }
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
        const response = await fetch(`${apiUrl}artist/byID/${artistID}`)
        if (response.ok) {
          enriched = await response.json()
        }
      } catch {
      }

      // Check if any contacts exist for step 4 progress detection
      let contactCount = 0
      try {
        const contactsRes = await fetch(`${apiUrl}contact/artist/${artistID}`)
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

  return {
    props: {
      artistProgressRows: enrichedArtists.map(buildArtistProgress),
    },
  }
}
