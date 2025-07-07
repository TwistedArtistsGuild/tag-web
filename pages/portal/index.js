/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



import Link from "next/link";
import TagSEO from "@/components/TagSEO";

export default function Portal_Artist() {
	const pageMetaData = {
		title: "Portal Links",
		description: "Dashboard and Reports",
		keywords: "Artist, Dashboard, Reports",
		robots: "no-index, no-follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "Artist Portal",
			description: "Links to dashboards and reports for different scopes",
		},
	};

	return (
		<div className="p-4 bg-base-200">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="portal" />
			<h2 className="text-2xl font-bold text-primary">
        Links to Portal Resources
			</h2>

			<div>
				<Link href="/portal/logviewer" className="link link-primary">
          Logviewer
				</Link>
			</div>
			<div className="mt-2">
				<Link href="/portal/artist/" className="link link-primary">
					Artist&apos;s Portal
				</Link>
			</div>
			<div className="mt-2">
				<Link href="/portal/staff/" className="link link-primary">
          Staff Member&apos;s Portal
				</Link>
			</div>
			<div className="mt-2">
				<Link href="/portal/vendor/" className="link link-primary">
          Vendor&apos;s Portal
				</Link>
			</div>
		</div>
	);
}
