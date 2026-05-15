/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { useState } from "react"

import TagSEO from "@/components/TagSEO"
import getApiURL from "@/components/widgets/GetApiURL"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { isAdmin } from "@/utils/authHelpers"
import { sanitizeDefaultHtml } from "@/components/security/sanitize"
import PictureExplorerCard from "@/components/PictureExplorerCard"

const UPCOMING_DATES = [
  {
    title: "Summer collection product shots",
    dueDate: "May 14",
    status: "Due this week",
    type: "Project",
  },
  {
    title: "Midnight Bloom print run",
    dueDate: "May 16",
    status: "Ship-by approaching",
    type: "Listing",
  },
  {
    title: "Festival booth banner refresh",
    dueDate: "May 22",
    status: "Planning",
    type: "Project",
  },
]

const TOP_LISTINGS = [
  { title: "Night Rivulet", views: 482, saves: 37, orders: 8 },
  { title: "Dustlight II", views: 351, saves: 26, orders: 5 },
  { title: "Alley Botanica", views: 290, saves: 19, orders: 4 },
]

const AD_SPEND_ROWS = [
  { channel: "Instagram boosted post", spend: "$84", returnLabel: "3 inquiries", status: "Promising" },
  { channel: "Event flyer print", spend: "$40", returnLabel: "1 booth signup", status: "Neutral" },
  { channel: "Google local ads", spend: "$120", returnLabel: "0 tracked sales", status: "Needs review" },
]

function DashboardCard({ title, badge, children }) {
  return (
    <section className="card bg-base-100 shadow border border-base-300">
      <div className="card-body gap-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-lg font-semibold text-base-content">{title}</h2>
          {badge ? <span className="badge badge-ghost">{badge}</span> : null}
        </div>
        {children}
      </div>
    </section>
  )
}

function PreviewMode({ artistProfile, slug, listingCount }) {
  return (
    <div className="space-y-4">
      <div className="alert alert-info shadow-sm">
        <div>
          <div className="font-semibold">Public Preview Mode</div>
          <div className="text-sm opacity-80">
            This is a lightweight preview of how the artist profile reads for public visitors. Open the public page for the full live experience.
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body gap-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-base-content">{artistProfile?.title || slug}</h2>
              <p className="text-base-content/70 mt-1">{artistProfile?.byline || "No byline set yet."}</p>
            </div>
            <Link href={`/artists/${slug}`} className="btn btn-sm btn-primary">
              Open Public Profile
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-box bg-base-200/60 border border-base-300 p-4">
              <div className="text-xs uppercase tracking-widest text-base-content/50">Applied</div>
              <div className="text-lg font-semibold text-base-content mt-1">{artistProfile?.applied ? new Date(artistProfile.applied).toLocaleDateString() : "Unknown"}</div>
            </div>
            <div className="rounded-box bg-base-200/60 border border-base-300 p-4">
              <div className="text-xs uppercase tracking-widest text-base-content/50">Listings</div>
              <div className="text-lg font-semibold text-base-content mt-1">{listingCount}</div>
            </div>
            <div className="rounded-box bg-base-200/60 border border-base-300 p-4">
              <div className="text-xs uppercase tracking-widest text-base-content/50">Public Path</div>
              <div className="text-lg font-semibold text-base-content mt-1">/{artistProfile?.path || slug}</div>
            </div>
          </div>

          <div className="prose max-w-none text-base-content">
            <h3>Statement Preview</h3>
            <div dangerouslySetInnerHTML={{ __html: sanitizeDefaultHtml(artistProfile?.statement || "<p>No statement available yet.</p>") }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function EditMode({ slug, artistId }) {
  return (
    <div className="space-y-4">
      <div className="alert alert-warning shadow-sm">
        <div>
          <div className="font-semibold">Edit Mode</div>
          <div className="text-sm opacity-80">
            Editing tools are staged here. Wire the specific forms and media upload flows into this mode as each subsystem is finalized.
          </div>
        </div>
      </div>

      {artistId && (
        <PictureExplorerCard
          useCase="artist-portal"
          startPrefix={`/platformpics/artist/${artistId}/`}
          allowContainerSwitch={false}
          preserveStartPrefixOnContainerSwitch={false}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardCard title="Profile Editing" badge="Ready for wiring">
          <p className="text-sm text-base-content/70">
            Update statement, biography, byline, SEO tags, and public path controls for this artist page.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button type="button" className="btn btn-sm btn-primary">Edit Artist Copy</button>
            <button type="button" className="btn btn-sm btn-outline">Manage Images</button>
          </div>
        </DashboardCard>

        <DashboardCard title="Listing Operations" badge="Current route available">
          <p className="text-sm text-base-content/70">
            Move into listing creation or targeted update flows tied to this artist workspace.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Link href="/portal/artist/listing/create" className="btn btn-sm btn-primary">Create Listing</Link>
            <Link href={`/artists/${slug}`} className="btn btn-sm btn-outline">Cross-check Public Page</Link>
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}

export default function ArtistSlugPortalPage({ slug, artistProfile, listings }) {
  const [mode, setMode] = useState("preview")
  const listingCount = Array.isArray(listings) ? listings.length : 0

  const pageMetaData = {
    title: `${artistProfile?.title || slug} Artist Portal`,
    description: "Artist-specific portal dashboard.",
    keywords: "artist, portal, dashboard, listings",
    robots: "no-index, no-follow",
    og: {
      title: `${artistProfile?.title || slug} Artist Portal`,
      description: "Artist-specific portal dashboard.",
    },
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <TagSEO metadataProp={pageMetaData} canonicalSlug={`portal/artist/${slug}`} />

      <div className="max-w-6xl mx-auto space-y-6">
        <section className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body gap-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-xs uppercase tracking-widest text-base-content/50">Artist Portal</div>
                <h1 className="text-3xl font-bold text-primary mt-1">{artistProfile?.title || slug}</h1>
                <p className="text-base-content/70 mt-2 max-w-3xl">
                  This workspace is for the artist identified by the slug. Use it to preview the public profile, step into edit mode, and review operational metrics.
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link href="/portal/artist" className="btn btn-sm btn-ghost">Back to Artist Portal</Link>
                <Link href={`/artists/${slug}`} className="btn btn-sm btn-outline">Public Profile</Link>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              <button
                type="button"
                className={`btn btn-sm ${mode === "preview" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setMode("preview")}
              >
                Preview as Public
              </button>
              <button
                type="button"
                className={`btn btn-sm ${mode === "edit" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setMode("edit")}
              >
                Enter Edit Mode
              </button>
              <span className="badge badge-ghost">Slug: {slug}</span>
            </div>
          </div>
        </section>

        {mode === "preview" ? (
          <PreviewMode artistProfile={artistProfile} slug={slug} listingCount={listingCount} />
        ) : (
          <EditMode slug={slug} artistId={artistProfile?.id || artistProfile?.artistID} />
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <DashboardCard title="Upcoming Project & Ship-By Dates" badge="Faked for now">
            <div className="space-y-2 text-sm">
              {UPCOMING_DATES.map((item) => (
                <div key={item.title} className="rounded-box border border-base-300 bg-base-200/60 p-3 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-medium text-base-content">{item.title}</div>
                    <div className="text-base-content/60 text-xs mt-1">{item.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-base-content">{item.dueDate}</div>
                    <div className="text-xs text-base-content/60">{item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Monthly Sales Tracker" badge="Faked for now">
            <div className="stats stats-vertical lg:stats-horizontal shadow-sm bg-base-200 w-full">
              <div className="stat px-3 py-2">
                <div className="stat-title text-xs">Gross Sales</div>
                <div className="stat-value text-2xl">$1,840</div>
              </div>
              <div className="stat px-3 py-2">
                <div className="stat-title text-xs">Orders</div>
                <div className="stat-value text-2xl">12</div>
              </div>
              <div className="stat px-3 py-2">
                <div className="stat-title text-xs">Avg. Order</div>
                <div className="stat-value text-2xl">$153</div>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Annual Profit Tracker" badge="Faked for now">
            <div className="space-y-3">
              <div className="text-4xl font-bold text-success">$14,250</div>
              <p className="text-sm text-base-content/70">
                Estimated annual profit after shipping, materials, and platform fees. This is currently placeholder planning data.
              </p>
              <progress className="progress progress-success w-full" value="68" max="100"></progress>
            </div>
          </DashboardCard>

          <DashboardCard title="Top Listings Activity" badge="Faked for now">
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Listing</th>
                    <th>Views</th>
                    <th>Saves</th>
                    <th>Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_LISTINGS.map((listing) => (
                    <tr key={listing.title}>
                      <td>{listing.title}</td>
                      <td>{listing.views}</td>
                      <td>{listing.saves}</td>
                      <td>{listing.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>

          <DashboardCard title="Ad Spend Effectiveness" badge="Faked for now">
            <div className="space-y-2 text-sm">
              {AD_SPEND_ROWS.map((row) => (
                <div key={row.channel} className="rounded-box border border-base-300 bg-base-200/60 p-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="font-medium text-base-content">{row.channel}</div>
                    <span className="badge badge-outline">{row.status}</span>
                  </div>
                  <div className="mt-2 flex gap-4 text-base-content/70 flex-wrap">
                    <span>Spend: {row.spend}</span>
                    <span>Return: {row.returnLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="GoHighLevel Whitelabel CRM Embed" badge="Planned">
            <p className="text-sm text-base-content/70">
              Reserve this area for the future GoHighLevel whitelabel CRM embed. Subscription is not active yet, so this stays as planning/UI placeholder for now.
            </p>
            <div className="alert alert-info mt-2">
              <span>Future embed target: contacts, pipeline, reminders, and artist-side lead follow-up.</span>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { slug } = context.params
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session?.user) {
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${encodeURIComponent(`/portal/artist/${slug}`)}`,
        permanent: false,
      },
    }
  }

  const userId = session.user.id || null
  const adminRole = isAdmin(session)

  if (!adminRole) {
    if (!userId) {
      return { notFound: true }
    }

    try {
      const apiUrl = getApiURL()
      const linkedArtistResponse = await fetch(`${apiUrl}linker_usertoartist/byUserID/${userId}`)

      if (!linkedArtistResponse.ok) {
        return { notFound: true }
      }

      const linkedArtists = await linkedArtistResponse.json()
      const normalizedSlug = String(slug).trim().toLowerCase()
      const canAccessSlug = Array.isArray(linkedArtists) && linkedArtists.some((artist) => {
        const artistPath = String(artist?.path ?? artist?.Path ?? "").trim().toLowerCase()
        const artistId = String(artist?.artistID ?? artist?.ArtistID ?? "").trim().toLowerCase()
        return artistPath === normalizedSlug || artistId === normalizedSlug
      })

      if (!canAccessSlug) {
        return { notFound: true }
      }
    } catch (error) {
      console.error(`Unable to verify artist ownership for ${slug}:`, error.message)
      return { notFound: true }
    }
  }

  const apiUrl = getApiURL()

  try {
    const response = await fetch(`${apiUrl}artist/${slug}/profile`)

    if (!response.ok) {
      return { notFound: true }
    }

    const data = await response.json()

    return {
      props: {
        slug,
        artistProfile: data?.artist || null,
        listings: data?.listings || [],
      },
    }
  } catch (error) {
    console.error(`Unable to load artist portal profile for ${slug}:`, error.message)

    return {
      props: {
        slug,
        artistProfile: null,
        listings: [],
      },
    }
  }
}

