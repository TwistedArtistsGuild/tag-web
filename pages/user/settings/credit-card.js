/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import TagSEO from "@/components/TagSEO"

export default function CreditCardSettings() {
	const pageMetaData = {
		title: "Update Credit Card Info",
		description: "Update your credit card information",
		keywords: "settings, credit card, user, account",
		robots: "index, follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "Update Credit Card Info",
			description: "Update your credit card information",
		},
	}

	return (
		<>
			<TagSEO metadataProp={pageMetaData} canonicalSlug="user/settings/credit-card" />
			<main className="min-h-screen p-8 pb-24 bg-base-200">
				<section className="max-w-xl mx-auto space-y-8">
					<h1 className="text-3xl md:text-4xl font-extrabold text-primary">Update Credit Card Info</h1>
					<p className="text-lg leading-relaxed text-base-content">
						This page is under construction.
					</p>
				</section>
			</main>
		</>
	)
}
