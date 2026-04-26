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
			<TagSEO metadataProp={pageMetaData} canonicalSlug="about/codeofconduct" />

			<h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-center">
				Information about the Twisted Artists&apos; Guild
			</h1>
			<div className="space-y-4">
				<div className="card bg-base-100 border border-base-300 shadow-sm">
					<div className="card-body">
					<Link href="/about/codeofconduct/coc0" className="link link-primary font-medium">
						Code of Conduct for All Parties
					</Link>
					<p className="text-base-content/80">The basics to the code of conduct for any and everyone that we interact with.</p>
					</div>
				</div>
				<div className="card bg-base-100 border border-base-300 shadow-sm">
					<div className="card-body">
					<Link href="/about/codeofconduct/coc1" className="link link-primary font-medium">
						Code of Conduct for Public Customers
					</Link>
					<p className="text-base-content/80">The code of conduct for public website users who browse and buy art.</p>
					</div>
				</div>
				<div className="card bg-base-100 border border-base-300 shadow-sm">
					<div className="card-body">
					<Link href="/about/codeofconduct/coc2" className="link link-primary font-medium">
						Code of Conduct for Investors
					</Link>
					<p className="text-base-content/80">The code of conduct for investors to stay in good standing.</p>
					</div>
				</div>
				<div className="card bg-base-100 border border-base-300 shadow-sm">
					<div className="card-body">
					<Link href="/about/codeofconduct/coc3" className="link link-primary font-medium">
						Code of Conduct for Artist Members
					</Link>
					<p className="text-base-content/80">The code of conduct for artist members.</p>
					</div>
				</div>
				<div className="card bg-base-100 border border-base-300 shadow-sm">
					<div className="card-body">
					<Link href="/about/codeofconduct/coc4" className="link link-primary font-medium">
						Code of Conduct for Guild Employees
					</Link>
					<p className="text-base-content/80">The code of conduct for guild employees, staff, board, and vendors.</p>
					</div>
				</div>
			</div>
		</div>
	)
}
