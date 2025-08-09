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
			<TagSEO metadataProp={pageMetaData} canonicalSlug="about/codeofconduct" />

			<h2 className="text-2xl font-bold mb-4">
				Information about the Twisted Artists&apos; Guild
			</h2>
			<div className="space-y-4">
				<div>
					<Link href="/about/codeofconduct/coc0" className="text-blue-500 hover:underline">
						Code of Conduct for All Parties
					</Link>
					<p>The basics to the code of conduct for any and everyone that we interact with.</p>
				</div>
				<div>
					<Link href="/about/codeofconduct/coc1" className="text-blue-500 hover:underline">
						Code of Conduct for Public Customers
					</Link>
					<p>The code of conduct for public website users who browse and buy art.</p>
				</div>
				<div>
					<Link href="/about/codeofconduct/coc2" className="text-blue-500 hover:underline">
						Code of Conduct for Investors
					</Link>
					<p>The code of conduct for investors to stay in good standing.</p>
				</div>
				<div>
					<Link href="/about/codeofconduct/coc3" className="text-blue-500 hover:underline">
						Code of Conduct for Artist Members
					</Link>
					<p>The code of conduct for artist members.</p>
				</div>
				<div>
					<Link href="/about/codeofconduct/coc4" className="text-blue-500 hover:underline">
						Code of Conduct for Guild Employees
					</Link>
					<p>The code of conduct for guild employees, staff, board, and vendors.</p>
				</div>
			</div>
		</div>
	)
}
