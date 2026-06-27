"use client"

import Link from "next/link"
import { useState } from "react"

import ArtistCard from "@/components/cards/card_artist"
import SocialComments from "@/components/social/Comments"

function SectionHeading({ children }) {
	return <h2 className="text-xs font-semibold text-base-content/50 uppercase tracking-widest">{children}</h2>
}

function buildCommentsUser(sessionUser) {
	if (!sessionUser) {
		return null
	}

	return {
		id: sessionUser.id,
		username: sessionUser.email || sessionUser.name || "user",
		displayName: sessionUser.name || sessionUser.email || "User",
		avatarUrl: sessionUser.image || "/images/default-avatar.png",
		isAdmin: Array.isArray(sessionUser.roles) && sessionUser.roles.includes("admin"),
	}
}

export default function CardMyArtists({
	registeredArtists = [],
	sessionUser = null,
	title = "Linked Artist Workspaces",
	description = "Each linked artist gets its own portal page, public preview, and edit-mode workspace.",
	emptyMessage = "No linked artist profiles yet.",
	emptyCtaHref = "/join/artist",
	emptyCtaLabel = "Register Artist",
	emptyCtaClassName = "btn btn-sm btn-secondary",
	footerContent = null,
	renderArtistActions,
	showComments = false,
}) {
	const [artistCardSize, setArtistCardSize] = useState("medium")
	const commentsUser = buildCommentsUser(sessionUser)

	return (
		<div className="card bg-base-100 border border-base-300 shadow">
			<div className="card-body p-4 gap-3">
				<SectionHeading>{title}</SectionHeading>
				<div className="flex items-center justify-between gap-3 flex-wrap">
					<p className="text-sm text-base-content/70">{description}</p>
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
						<span>{emptyMessage}</span>
						<Link href={emptyCtaHref} className={emptyCtaClassName}>{emptyCtaLabel}</Link>
					</div>
				) : (
					
						<div className={artistCardSize === "medium" ? "grid grid-cols-1 xl:grid-cols-2 gap-3" : "space-y-3"}>
							{registeredArtists.map((artist) => (
								<div key={artist.artistID || artist.path || artist.title} className="space-y-2">
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
									{renderArtistActions ? renderArtistActions(artist) : null}
									{showComments ? (
										<div className="rounded-box border border-base-300 bg-base-100/70 p-3">
											<SocialComments
												contextId={`artist-card-${artist.artistID || artist.path || artist.title}`}
												currentUser={commentsUser}
												allowMedia={false}
											/>
										</div>
									) : null}
								</div>
							))}
							{footerContent ? <div className={artistCardSize === "medium" ? "pt-1 xl:col-span-2" : "pt-1"}>{footerContent}</div> : null}
						</div>
					
				)}
			</div>
		</div>
	)
}
