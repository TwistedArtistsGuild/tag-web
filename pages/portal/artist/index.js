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
import SocialComments from "@/components/social/Comments"
import { SocialRealtimeProvider } from "@/components/social/SocialRealtimeContext"
import TagSEO from "@/components/TagSEO"
import getApiURL from "@/components/widgets/GetApiURL"
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

function ConceptCard({ href, title, description, icon }) {
	return (
		<Link href={href} className="card bg-base-100 border border-base-300 hover:border-primary hover:shadow transition-all">
			<div className="card-body p-3 gap-0.5 sm:flex-row sm:items-center sm:justify-between">
				<h4 className="font-medium text-sm text-base-content sm:min-w-56">
					<span className="mr-2">{icon}</span>
					{title}
				</h4>
				<p className="text-xs text-base-content/65 flex-1">{description}</p>
			</div>
		</Link>
	)
}

function MyArtistsCard({ registeredArtists, sessionUser }) {
	const [artistCardSize, setArtistCardSize] = useState("large")
	const commentsUser = sessionUser
		? {
			id: sessionUser.id,
			username: sessionUser.email || sessionUser.name || "user",
			displayName: sessionUser.name || sessionUser.email || "User",
			avatarUrl: sessionUser.image || "/images/default-avatar.png",
			isAdmin: Array.isArray(sessionUser.roles) && sessionUser.roles.includes("admin"),
		}
		: null

	return (
		<div className="card bg-base-100 border border-base-300 shadow">
			<div className="card-body p-4 gap-3">
				<SectionHeading>Linked Artist Workspaces</SectionHeading>
				<div className="flex items-center justify-between gap-3 flex-wrap">
					<p className="text-sm text-base-content/70">Each linked artist gets its own portal page, public preview, and edit-mode workspace.</p>
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
					<SocialRealtimeProvider>
						<div className={artistCardSize === "medium" ? "grid grid-cols-1 xl:grid-cols-2 gap-3" : "space-y-3"}>
							{registeredArtists.map((artist) => (
								<div key={artist.artistID} className="space-y-2">
									<ArtistCard
										artist={{
											...artist,
											panelSize:
												artistCardSize === "large"
													? "full"
													: artistCardSize === "medium"
														? "half"
														: "third",
										}}
										compact={artistCardSize === "small"}
										showHeaderGallery={artistCardSize === "large"}
										showContentGallery={artistCardSize === "large"}
									/>
									{artist.isPublished ? (
										<div className="badge badge-success gap-2">
											✓ Published
										</div>
									) : (
										<div className="badge badge-warning gap-2">
											⟳ Registration in Progress
										</div>
									)}
									<div className="flex gap-2 flex-wrap justify-end">
										<Link href={artist.path ? `/artists/${artist.path}` : "/artists"} className="btn btn-xs btn-ghost">
											Public Profile
										</Link>
										<Link href={artist.path ? `/portal/artist/${artist.path}` : "/portal/artist"} className="btn btn-xs btn-outline">
											Artist Portal
										</Link>
										<Link
											href={artist.artistID ? `/portal/artist/manage-contacts?artistId=${artist.artistID}` : "/portal/artist/manage-contacts"}
											className="btn btn-xs btn-primary"
										>
											Manage Contacts
										</Link>
									</div>
									<div className="rounded-box border border-base-300 bg-base-100/70 p-3">
										<SocialComments
											contextId={`artist-card-${artist.artistID || artist.path || artist.title}`}
											currentUser={commentsUser}
											allowMedia={false}
										/>
									</div>
								</div>
							))}
						</div>
					</SocialRealtimeProvider>
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
				<MyArtistsCard registeredArtists={registeredArtists} sessionUser={sessionUser} />

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
			const apiUrl = getApiURL()
			const response = await fetch(`${apiUrl}linker_usertoartist/byUserID/${userId}`)

			if (response.ok) {
				const artistData = await response.json()
				registeredArtists = Array.isArray(artistData)
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

				// Check for artists that should be auto-published
				for (const artist of registeredArtists) {
					if (artist.artistID && !artist.isPublished) {
						try {
							// Fetch workflow steps
							const workflowResponse = await fetch(
								`${apiUrl}workflows/artist/${artist.artistID}?workflowName=default`
							)

							if (workflowResponse.ok) {
								const workflowSummary = await workflowResponse.json()
								const steps = Array.isArray(workflowSummary?.steps) ? workflowSummary.steps : []
								const requiredSteps = Array.isArray(workflowSummary?.requiredSteps)
									? workflowSummary.requiredSteps
									: []
								const completedSteps = steps.filter((s) => s.isCompleted).map((s) => s.stepKey)
								const allComplete = requiredSteps.every((step) => completedSteps.includes(step))

								if (allComplete) {
									// Auto-publish the artist
									const publishResponse = await fetch(`${apiUrl}artist/${artist.artistID}`, {
										method: "PUT",
										headers: { "Content-Type": "application/json" },
										body: JSON.stringify({ isPublished: true }),
									})

									if (publishResponse.ok) {
										artist.isPublished = true
									}
								}
							}
						} catch (error) {
							console.error(`Unable to check/publish artist ${artist.artistID}:`, error.message)
						}
					}
				}
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
