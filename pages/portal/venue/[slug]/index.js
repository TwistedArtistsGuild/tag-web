/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import { useRouter } from "next/router"
import TagSEO from "@/components/TagSEO"
import PhotoGallery from "@/components/cards/card_photoGallery"

export default function VenuePortalSlugIndex() {
	const router = useRouter()
	const { slug } = router.query
	const safeSlug = String(slug || "").trim()

	const pageMetaData = {
		title: "Venue Portal",
		description: "Venue workspace for managing events and information.",
		keywords: "venue, portal, events",
		robots: "no-index, no-follow",
	}

	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO metadataProp={pageMetaData} canonicalSlug={`portal/venue/${safeSlug}`} />

			<div className="mx-auto max-w-5xl space-y-6">
				<section className="card bg-base-100 border border-base-300 shadow">
					<div className="card-body gap-4">
						<div className="flex items-start justify-between gap-4 flex-wrap">
							<div>
								<div className="text-xs uppercase tracking-widest text-base-content/50">Venue Portal</div>
								<h1 className="text-3xl font-bold text-primary mt-1">{safeSlug}</h1>
								<p className="text-base-content/70 mt-2 max-w-3xl">
									This workspace is for the venue identified by the slug. Use it to manage venue information and events.
								</p>
							</div>
							<div className="flex gap-2 flex-wrap">
								{safeSlug ? <Link href={`/portal/venue/${safeSlug}/edit`} className="btn btn-sm btn-accent">Edit Profile</Link> : null}
								<Link href="/portal/venue" className="btn btn-sm btn-ghost">Back to Venue Portal</Link>
							</div>
						</div>

						<div className="alert alert-info">
							<span>Venue portal workspace ready. Edit your profile and manage venue details here.</span>
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}
