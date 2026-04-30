/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/





import TagSEO from "@/components/TagSEO"

export default function Portal_Artist() {
	const pageMetaData = {
		title: "Cart",
		description: "Review selected items and continue checkout on Platform.",
		keywords: "cart, checkout, art purchases",
		robots: "noindex, nofollow",
		og: {
			title: "Cart",
			description: "Review selected items and continue checkout on Platform.",
		},
	}

	return (
		<div className="p-4 bg-base-200">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="cart" />
			<h2 className="text-2xl font-bold text-primary">
        Landing page for Cart view
			</h2>
		</div>
	);
}
