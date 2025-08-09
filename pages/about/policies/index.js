/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import TagSEO from "@/components/TagSEO"
import Link from "next/link"

export default function About() {

	const pageMetaData = {
		title: "About the Twisted Artists Guild",
		description: "Information about our non-profit organization",
		keywords: "about, art, business, organizational charter, guild, sales, cloud platform",
		robots: "index, follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "About the Twisted Artists Guild",
			description: "Information about our organization",
		},
	}

	return (
		<div className="container mx-auto p-4">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="about/policies" />

			<h2 className="text-2xl font-bold mb-4">
        Information about the Twisted Artists&apos; Guild
			</h2>
			<div className="space-y-4">
				<div>
					<Link href="/about/policies/refunds" className="text-blue-500 hover:underline">
						Refund Policy
					</Link>
					<p>Our policy on refunds for purchases.</p>
				</div>
				<div>
					<Link href="/about/policies/pricing" className="text-blue-500 hover:underline">
						Pricing Policy
					</Link>
					<p>Our policy on pricing for products and services.</p>
				</div>
				<div>
					<Link href="/about/policies/dispute_resolution" className="text-blue-500 hover:underline">
						Dispute Resolution Policy
					</Link>
					<p>Our policy on resolving disputes.</p>
				</div>
				<div>
					<Link href="/about/policies/cybersecurity" className="text-blue-500 hover:underline">
						Cybersecurity Policy
					</Link>
					<p>Our policy on cybersecurity measures.</p>
				</div>
				<div>
					<Link href="/about/policies/copyrights" className="text-blue-500 hover:underline">
						Copyright Policy
					</Link>
					<p>Our policy on copyrights and intellectual property.</p>
				</div>
			</div>
		</div>
	)
}
