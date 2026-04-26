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
		title: "About the Platform",
		description: "Information about our non-profit organization",
		keywords: "about, art, business, organizational charter, guild, sales, cloud platform",
		robots: "index, follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "About the Platform",
			description: "Information about our organization",
		},
	}

	return (
		<div className="container mx-auto max-w-5xl p-4 md:p-6">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="about/policies" />

			<h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-center">
        Information about the Twisted Artists&apos; Guild
			</h1>
			<div className="space-y-4">
				<div className="card bg-base-100 border border-base-300 shadow-sm">
					<div className="card-body">
					<Link href="/about/policies/refunds" className="link link-primary font-medium">
						Refund Policy
					</Link>
					<p className="text-base-content/80">Our policy on refunds for purchases.</p>
					</div>
				</div>
				<div className="card bg-base-100 border border-base-300 shadow-sm">
					<div className="card-body">
					<Link href="/about/policies/pricing" className="link link-primary font-medium">
						Pricing Policy
					</Link>
					<p className="text-base-content/80">Our policy on pricing for products and services.</p>
					</div>
				</div>
				<div className="card bg-base-100 border border-base-300 shadow-sm">
					<div className="card-body">
					<Link href="/about/policies/dispute_resolution" className="link link-primary font-medium">
						Dispute Resolution Policy
					</Link>
					<p className="text-base-content/80">Our policy on resolving disputes.</p>
					</div>
				</div>
				<div className="card bg-base-100 border border-base-300 shadow-sm">
					<div className="card-body">
					<Link href="/about/policies/cybersecurity" className="link link-primary font-medium">
						Cybersecurity Policy
					</Link>
					<p className="text-base-content/80">Our policy on cybersecurity measures.</p>
					</div>
				</div>
				<div className="card bg-base-100 border border-base-300 shadow-sm">
					<div className="card-body">
					<Link href="/about/policies/copyrights" className="link link-primary font-medium">
						Copyright Policy
					</Link>
					<p className="text-base-content/80">Our policy on copyrights and intellectual property.</p>
					</div>
				</div>
			</div>
		</div>
	)
}
