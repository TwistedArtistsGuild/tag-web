/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



import TagSEO from "@/components/TagSEO";

export default function Portal_Vendor() {
	const pageMetaData = {
		title: "Vendor Portal",
		description: "Dashboard and Reports",
		keywords: "Vendor, Dashboard, Reports",
		robots: "no-index, no-follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "Vendor Portal",
			description: "Dashboard and Reports",
		},
	};

	return (
		<div className="p-4 bg-base-200">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="portal/vendor" />
			<h2 className="text-2xl font-bold text-primary">
				Landing page for Vendor Portal
			</h2>
		</div>
	);
}
