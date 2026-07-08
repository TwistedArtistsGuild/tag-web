/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import { useState } from "react"
import { getServerSession } from "next-auth/next"

import ArtistContextNav from "@/components/portal/ArtistContextNav"
import ArtistCard from "@/components/cards/card_artist"
import TagSEO from "@/components/TagSEO"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { isAdmin, isArtist, isStaff } from "@/utils/authHelpers"

function SectionHeading({ children }) {
	return <h2 className="text-xs font-semibold text-base-content/50 uppercase tracking-widest">{children}</h2>
}

const ARTIST_ACCENT_CLASSES = [
	"bg-primary/15 text-primary border-primary/30",
	"bg-secondary/15 text-secondary border-secondary/30",
	"bg-accent/15 text-accent border-accent/30",
	"bg-info/15 text-info border-info/30",
	"bg-success/15 text-success border-success/30",
	"bg-warning/15 text-warning border-warning/30",
]

function getArtistAccentClass(index) {
	return ARTIST_ACCENT_CLASSES[index % ARTIST_ACCENT_CLASSES.length]
}

function hasBusinessDetails(artist) {
	const city = String(artist?.city ?? artist?.City ?? "").trim()
	const region = String(artist?.stateOrProvince ?? artist?.StateOrProvince ?? "").trim()
	const postal = String(artist?.zipCode ?? artist?.ZipCode ?? artist?.postalCode ?? artist?.PostalCode ?? "").trim()
	const country = String(artist?.country ?? artist?.Country ?? "").trim()
	return Boolean(city && region && postal && country)
}

function getNextArtistJoinStep(artist, workflowSummary) {
	const steps = Array.isArray(workflowSummary?.steps) ? workflowSummary.steps : []
	const completed = new Set(
		steps
			.filter((step) => Boolean(step?.isCompleted))
			.map((step) => String(step?.stepKey || "").trim().toLowerCase()),
	)

	if (!completed.has("accepted_tc")) return 1
	if (!completed.has("reserved_slug")) return 2
	if (!completed.has("added_bio")) return 3
	if (!hasBusinessDetails(artist)) return 4
	if (!completed.has("uploaded_photos")) return 5
	if (!completed.has("private_contacts")) return 6
	if (!completed.has("added_contacts")) return 7
	return 8
}

function MyArtistsCard({ registeredArtists }) {
	const [artistCardSize, setArtistCardSize] = useState("medium")
	const showGalleryFocusedCard = artistCardSize !== "small"

	return (
		<div className="card bg-base-100 border border-base-300 shadow">
			<div className="card-body p-4 gap-3">
				<SectionHeading>Linked Artist Workspaces</SectionHeading>
				<div className="flex items-center justify-between gap-3 flex-wrap">
						<p className="text-sm text-base-content/70">Each linked artist gets its own portal page, public preview, and a single settings surface for edits.</p>
					<label className="form-control w-full sm:w-auto">
						<div className="label py-0">
							<span className="label-text text-xs text-base-content/60">Card Size</span>
						</div>
						<select
							className="select select-bordered select-xs"
							value={artistCardSize}
							onChange={(event) => setArtistCardSize(event.target.value)}
						>
							<option value="small">Small</option>
							<option value="medium">Medium</option>
							<option value="large">Large</option>
						</select>
					</label>
				</div>

				{registeredArtists.length === 0 ? (
					<div className="rounded-box border border-base-300 bg-base-200 p-3 text-sm text-base-content/70 flex items-center justify-between gap-3 flex-wrap">
						<span>No linked artist profiles yet.</span>
						<Link href="/join/artist" className="btn btn-sm btn-secondary">Register Artist</Link>
					</div>
				) : (
					
						<div className={artistCardSize === "small" ? "grid grid-cols-1 lg:grid-cols-2 gap-3" : artistCardSize === "medium" ? "grid grid-cols-1 xl:grid-cols-2 gap-3" : "space-y-3"}>
							{registeredArtists.map((artist) => (
								<div key={artist.artistID} className="space-y-2">
									{(() => {
										const artistPortalHref = artist.path ? `/portal/artist/${artist.path}` : "/portal/artist"
										const joinHref = artist.path
											? `/join/artist/${artist.path}?step=${artist.nextJoinStep || 3}`
											: `/join/artist?step=${artist.nextJoinStep || 3}`
										const primaryHref = artist.isPublished ? artistPortalHref : joinHref
										const primaryTitle = artist.isPublished ? "Open Artist Portal" : "Continue Registration"

										return (
									<div className="grid grid-cols-1 md:grid-cols-[12rem_1fr] gap-2 items-stretch">
										<Link
											href={primaryHref}
											className="rounded-box border border-primary/30 bg-primary/10 hover:bg-primary/15 transition-colors p-4 flex items-center justify-start min-h-24"
										>
											<div>
												<div className="text-xs uppercase tracking-wider text-primary/80">Workspace</div>
												<div className="font-semibold text-primary mt-1">{primaryTitle}</div>
											</div>
										</Link>
										<ArtistCard
											artist={{
												...artist,
												panelSize: showGalleryFocusedCard ? "full" : "third",
											}}
											compact={artistCardSize === "small"}
											showHeaderGallery={false}
											showContentGallery={showGalleryFocusedCard}
										/>
									</div>
										)
									})()}
									{artist.isPublished ? (
										<div className="badge badge-success gap-2">
											✓ Published
										</div>
									) : (
										<div className="badge badge-warning gap-2">
											⟳ Registration in Progress
										</div>
									)}
								</div>
							))}
						</div>
					
				)}
			</div>
		</div>
	)
}

export default function PortalArtistIndex({ sessionUser, registeredArtists }) {
	const pageMetaData = {
		title: "Artist Portal",
		description: "Artist workspace and dashboard access.",
		keywords: "artist, portal, dashboard, listings",
		robots: "noindex, nofollow",
		og: {
			title: "Artist Portal",
			description: "Artist workspace and dashboard access.",
		},
	}

	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="portal/artist" />
			<ArtistContextNav />

			<div className="max-w-6xl mx-auto space-y-6">
				<div className="card bg-base-100 shadow-lg border border-base-300">
					<div className="card-body gap-3">
						<p className="text-xs uppercase tracking-widest text-base-content/50">Portal Domain</p>
						<h1 className="text-3xl font-bold text-primary">Artist Portal</h1>
						<p className="text-base-content/70">
							Welcome back{sessionUser?.name ? `, ${sessionUser.name}` : ""}. Use this hub to jump into your linked artist workspaces, preview public pages, and enter artist-specific portal tools where listings are created for each artist.
						</p>
					</div>
				</div>
				<MyArtistsCard registeredArtists={registeredArtists} />

				<div className="card bg-base-100 border border-base-300 shadow">
					<div className="card-body p-4 gap-4">
						<SectionHeading>Reserved: Combined Artist Dashboard</SectionHeading>
						<p className="text-sm text-base-content/70">
							Reserved section for a unified dashboard that surfaces important metrics across all linked artists while keeping each artist visually separated by their own color channel.
						</p>

						{registeredArtists.length === 0 ? (
							<div className="rounded-box border border-base-300 bg-base-200 p-3 text-sm text-base-content/70">
								No linked artists yet. Combined dashboard widgets will appear here once artist profiles are linked.
							</div>
						) : (
							<div className="space-y-3">
								<div className="alert alert-info py-2">
									<span className="text-sm">Planned widgets: sales trend, shipping status, due dates, ad spend efficiency, and cross-artist risk flags.</span>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
									{registeredArtists.map((artist, index) => (
										<div key={artist.artistID || artist.path || artist.title || index} className={`rounded-box border p-2 ${getArtistAccentClass(index)}`}>
											<div className="text-xs uppercase tracking-wide opacity-80">Artist Color Channel</div>
											<div className="font-semibold mt-0.5">{artist.title || "Untitled Artist"}</div>
											<div className="text-xs opacity-75 mt-1">Reserved for combined metrics overlay.</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export async function getServerSideProps(context) {
	const session = await getServerSession(context.req, context.res, authOptions)

	if (!session?.user) {
		return {
			redirect: {
				destination: `/api/auth/signin?callbackUrl=${encodeURIComponent("/portal/artist")}`,
				permanent: false,
			},
		}
	}

	const userId = session.user.id || null
	let registeredArtists = []

	if (userId) {
		try {
			const response = await fetch(`/api/linker_usertoartist/byUserID/${userId}`)

			if (response.ok) {
				const artistData = await response.json()
				const linkedArtists = Array.isArray(artistData)
					? artistData.map((artist) => ({
						artistID: artist?.artistID ?? artist?.ArtistID ?? null,
						title: artist?.title ?? artist?.Title ?? null,
						path: artist?.path ?? artist?.Path ?? null,
						byline: artist?.byline ?? artist?.Byline ?? null,
						profilePic: artist?.profilePic ?? artist?.ProfilePic ?? null,
						linkRole: artist?.linkRole ?? artist?.LinkRole ?? null,
						isPublished: artist?.isPublished ?? artist?.IsPublished ?? false,
					}))
					: []

				registeredArtists = await Promise.all(
					linkedArtists.map(async (artist) => {
						const slug = String(artist?.path || "").trim().toLowerCase()
						if (!slug) {
							return artist
						}

						try {
							const [profileRes, detailRes] = await Promise.all([
								fetch(`/api/artist/${slug}/profile`),
								fetch(`/api/artist/${slug}`),
							])

							const profileData = profileRes.ok ? await profileRes.json() : null
							const detailData = detailRes.ok ? await detailRes.json() : null
							const profileArtist = profileData?.artist || {}

							return {
								...artist,
								artistID: artist.artistID ?? profileArtist?.artistID ?? profileArtist?.ArtistID ?? detailData?.artistID ?? detailData?.ArtistID ?? null,
								title: artist.title ?? profileArtist?.title ?? profileArtist?.Title ?? detailData?.title ?? detailData?.Title ?? null,
								path: artist.path ?? profileArtist?.path ?? profileArtist?.Path ?? slug,
								byline: artist.byline ?? profileArtist?.byline ?? profileArtist?.Byline ?? detailData?.byline ?? detailData?.Byline ?? null,
								profilePic: profileData?.profilePic ?? detailData?.profilePic ?? artist.profilePic ?? null,
								coverPic: profileData?.coverPic ?? detailData?.coverPic ?? null,
								gallery: detailData?.gallery ?? profileArtist?.gallery ?? null,
								images: Array.isArray(profileData?.images)
									? profileData.images
									: Array.isArray(profileArtist?.images)
										? profileArtist.images
										: Array.isArray(detailData?.images)
											? detailData.images
											: [],
							}
						} catch (error) {
							console.error(`Unable to hydrate artist ${slug} profile for portal card:`, error.message)
							return artist
						}
					}),
				)

				// Check for artists that should be auto-published
				for (const artist of registeredArtists) {
					if (artist.artistID && !artist.isPublished) {
						try {
							// Fetch workflow steps
							const workflowResponse = await fetch(
								`/api/workflows/artist/${artist.artistID}?workflowName=default`
							)

							if (workflowResponse.ok) {
								const workflowSummary = await workflowResponse.json()
								artist.nextJoinStep = getNextArtistJoinStep(artist, workflowSummary)
								const steps = Array.isArray(workflowSummary?.steps) ? workflowSummary.steps : []
								const requiredSteps = Array.isArray(workflowSummary?.requiredSteps)
									? workflowSummary.requiredSteps
									: []
								const completedSteps = steps.filter((s) => s.isCompleted).map((s) => s.stepKey)
								const allComplete = requiredSteps.every((step) => completedSteps.includes(step))

								if (allComplete) {
									// Auto-publish the artist
									const publishResponse = await fetch(`/api/artist/${artist.artistID}`, {
										method: "PUT",
										headers: { "Content-Type": "application/json" },
										body: JSON.stringify({ isPublished: true }),
									})

									if (publishResponse.ok) {
										artist.isPublished = true
										artist.nextJoinStep = 8
									}
								}
							} else {
								artist.nextJoinStep = getNextArtistJoinStep(artist, null)
							}
						} catch (error) {
							console.error(`Unable to check/publish artist ${artist.artistID}:`, error.message)
							artist.nextJoinStep = getNextArtistJoinStep(artist, null)
						}
					} else {
						artist.nextJoinStep = 8
					}
				}

				registeredArtists = registeredArtists
					.slice()
					.sort((a, b) => {
						if (Boolean(a.isPublished) !== Boolean(b.isPublished)) {
							return a.isPublished ? -1 : 1
						}
						const aTitle = String(a.title || "").trim().toLowerCase()
						const bTitle = String(b.title || "").trim().toLowerCase()
						return aTitle.localeCompare(bTitle)
					})
			}
		} catch (error) {
			console.error("Unable to load linked artists for artist portal:", error.message)
		}
	}

	const privilegedUser = isArtist(session) || isStaff(session) || isAdmin(session)
	if (!privilegedUser && registeredArtists.length === 0) {
		return {
			notFound: true,
		}
	}

	return {
		props: {
			sessionUser: session.user,
			registeredArtists,
		},
	}
}

