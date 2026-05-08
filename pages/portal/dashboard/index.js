/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"

import TagSEO from "@/components/TagSEO"

export default function PortalDashboardIndex() {
	const pageMetaData = {
		title: "Portal Dashboard",
		description: "Portal dashboard entry point.",
		keywords: "portal, dashboard, artist, staff",
		robots: "no-index, no-follow",
		og: {
			title: "Portal Dashboard",
			description: "Portal dashboard entry point.",
		},
	}

	return (
		<div className="p-4 bg-base-200 min-h-screen">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="portal/dashboard" />
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="card bg-base-100 shadow border border-base-300">
					<div className="card-body">
						<h1 className="text-3xl font-bold text-primary">Portal Dashboard</h1>
						<p className="text-base-content/70">
							Choose the dashboard scope that matches the work you need to do.
						</p>
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<Link href="/portal/artist/dashboard" className="card bg-base-100 shadow border border-base-300 hover:border-primary transition-all">
						<div className="card-body">
							<h2 className="card-title">Artist Dashboard</h2>
							<p className="text-sm text-base-content/70">Access artist-facing tools, listing workflows, and creator operations.</p>
						</div>
					</Link>
					<Link href="/portal/staff/dashboard" className="card bg-base-100 shadow border border-base-300 hover:border-primary transition-all">
						<div className="card-body">
							<h2 className="card-title">Staff Dashboard</h2>
							<p className="text-sm text-base-content/70">Open staff-facing reports, CRM tools, moderation, and operational views.</p>
						</div>
					</Link>
				</div>
			</div>
		</div>
	)
}
