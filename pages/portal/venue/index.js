/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import { getServerSession } from "next-auth/next"
import TagSEO from "@/components/TagSEO"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import getApiURL from "@/components/widgets/GetApiURL"

export default function VenuePortalIndex({ venues }) {
	const pageMetaData = {
		title: "Venue Portal",
		description: "Manage your venues and events.",
		keywords: "venue, portal, events",
		robots: "noindex, nofollow",
		og: { title: "Venue Portal", description: "Manage your venues and events." },
	}

	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="portal/venue" />

			<div className="mx-auto max-w-5xl space-y-6">
				<section className="card bg-base-100 shadow-lg border border-base-300">
					<div className="card-body gap-3">
						<div className="flex items-center justify-between gap-3 flex-wrap">
							<div>
								<h1 className="text-3xl font-bold text-primary">Venue Portal</h1>
								<p className="text-base-content/70 mt-2">Manage your venues and events</p>
							</div>
							<Link href="/portal" className="btn btn-sm btn-ghost">Back to Portal</Link>
						</div>
					</div>
				</section>

				{Array.isArray(venues) && venues.length > 0 ? (
					<section className="card bg-base-100 shadow border border-base-300">
						<div className="card-body gap-4">
							<h2 className="card-title">Your Venues</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{venues.map((venue) => (
									<div key={venue.id || venue.ID} className="card bg-base-200 border border-base-300">
										<div className="card-body gap-2">
											<h3 className="card-title text-lg">{venue.name || venue.Name || venue.slug || "Unnamed Venue"}</h3>
											<p className="text-sm text-base-content/70">{venue.slug || ""}</p>
											<div className="card-actions justify-end gap-2 mt-2">
												<Link
													href={`/portal/venue/${venue.slug || venue.path || ""}`}
													className="btn btn-sm btn-primary"
												>
													View
												</Link>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</section>
				) : (
					<section className="card bg-base-100 shadow border border-base-300">
						<div className="card-body gap-4">
							<p className="text-base-content/70">You don&apos;t have any venues yet.</p>
							<Link href="/join/venue" className="btn btn-primary">
								Register as a Venue
							</Link>
						</div>
					</section>
				)}
			</div>
		</div>
	)
}

export async function getServerSideProps(context) {
	const session = await getServerSession(context.req, context.res, authOptions)

	if (!session?.user) {
		return {
			redirect: {
				destination: `/api/auth/signin?callbackUrl=${encodeURIComponent("/portal/venue")}`,
				permanent: false,
			},
		}
	}

	const userId = session.user.id

	if (!userId) {
		return { props: { venues: [] } }
	}

	try {
		const apiUrl = getApiURL()
		const response = await fetch(`${apiUrl}linker_usertovenue/byUserID/${userId}`)

		if (response.ok) {
			const venues = await response.json()
			return {
				props: {
					venues: Array.isArray(venues) ? venues : [],
				},
			}
		}
	} catch (error) {
		console.error("Error fetching venues:", error)
	}

	return { props: { venues: [] } }
}
