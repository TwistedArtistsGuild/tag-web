/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



import TagSEO from "@/components/TagSEO";

export default function Portal_Staff() {
	const pageMetaData = {
		title: "Staff Portal",
		description: "Dashboard and Reports",
		keywords: "Staff, Dashboard, Reports",
		robots: "no-index, no-follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "Staff Portal",
			description: "Dashboard and Reports",
		},
	};

	return (
		<div className="p-4 bg-base-200">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="portal/staff" />
			<h2 className="text-2xl font-bold text-primary">
        Landing page for Staff Portal
			</h2>
			<p className="mt-3 text-base-content/80 max-w-2xl">
				GoHighLevel Staff Workspace provides TAG staff with a unified view of contacts,
				membership-drive funnel progress, form responses, and CRM messaging channels.
			</p>
			<div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-6xl">
				<div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">CRM Index</p>
					<h3 className="mt-2 text-xl font-bold text-base-content">GoHighLevel CRM Dashboard</h3>
					<p className="mt-2 text-sm text-base-content/70">
						Review contacts, membership funnel progress, and form-response intake.
					</p>
					<a className="link link-primary text-base font-semibold mt-4 inline-block" href="/portal/staff/ghl-index">
						Open CRM Index
					</a>
				</div>
							<div className="rounded-xl border border-success/20 bg-base-100 p-5 shadow-sm">
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-success">Storage</p>
								<h3 className="mt-2 text-xl font-bold text-base-content">Blob Storage Usage Report</h3>
								<p className="mt-2 text-sm text-base-content/70">
									Analyze Azure Blob Storage usage by folder to identify high-usage artists and optimize storage costs.
								</p>
								<a className="link link-success text-base font-semibold mt-4 inline-block" href="/portal/staff/blob-usage">
									View Storage Report
								</a>
							</div>
				<div className="rounded-xl border border-primary/20 bg-base-100 p-5 shadow-sm">
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Social Messaging</p>
					<h3 className="mt-2 text-xl font-bold text-base-content">GoHighLevel Chat Interface</h3>
					<p className="mt-2 text-sm text-base-content/70">
						Use our company GoHighLevel chat interface to manage conversations connected to our social media and CRM messaging channels.
					</p>
					<a className="link link-primary text-base font-semibold mt-4 inline-block" href="/portal/staff/ghl-chat">
						Open GHL Chat
					</a>
				</div>
			</div>
		</div>
	);
}
