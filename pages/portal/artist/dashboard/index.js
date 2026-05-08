/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"

import TagSEO from "@/components/TagSEO"

export default function ArtistDashboardIndex() {
	const pageMetaData = {
		title: "Artist Dashboard",
		description: "Artist dashboard landing page.",
		keywords: "artist, dashboard, portal",
		robots: "no-index, no-follow",
		og: {
			title: "Artist Dashboard",
			description: "Artist dashboard landing page.",
		},
	}

	return (
		<div className="p-4 bg-base-200 min-h-screen">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="portal/artist/dashboard" />
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="card bg-base-100 shadow border border-base-300">
					<div className="card-body">
						<div className="flex items-center justify-between gap-3 flex-wrap">
							<h1 className="text-3xl font-bold text-primary">Artist Dashboard</h1>
							<Link href="/portal/artist" className="btn btn-sm btn-ghost">Back to Artist Portal</Link>
						</div>
						<p className="text-base-content/70">
							Simple landing page for artist dashboard tools and future reporting widgets.
						</p>
					</div>
				</div>

				<div className="card bg-base-100 shadow border border-base-300">
					<div className="card-body">
						<h2 className="text-lg font-semibold text-base-content">Current Entry Points</h2>
						<div className="flex gap-2 flex-wrap">
							<Link href="/portal/artist/listing/create" className="btn btn-sm btn-primary">Create Listing</Link>
							<Link href="/portal/artist" className="btn btn-sm btn-outline">Artist Portal Home</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
