/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import Link from "next/link"

import TagSEO from "@/components/TagSEO"
import BugReportControl from "@/components/forms/bug-report"

export default function Custom404() {
	return (
      <section className="relative bg-base-100 text-base-content w-full p-10 flex flex-col items-center gap-6">
      <TagSEO metadataProp={{ title: "Page Not Found", description: "The requested page could not be found on Platform.", keywords: "artists, art community, marketplace", robots: "noindex, nofollow", og: { title: "Page Not Found", description: "The requested page could not be found on Platform." } }} canonicalSlug="404" />
			<p className="text-xl md:text-2xl font-medium">
				This page doesn&apos;t exist or has been moved.
			</p>

			<Link href="/" className="btn btn-primary flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					className="w-5 h-5"
				>
					<path
						fillRule="evenodd"
						d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
						clipRule="evenodd"
					/>
				</svg>
				Home
			</Link>

			<div className="w-full max-w-3xl">
				<BugReportControl
					isEmbedded
					defaultShortDescription="404 page not found issue"
					defaultExpectedBehavior="I expected this URL to resolve to a valid page."
				/>
			</div>
		</section>
	)
}
