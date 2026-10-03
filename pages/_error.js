/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"

import TagSEO from "@/components/TagSEO"
import BugReportControl from "@/components/forms/bug-report"

function getErrorCopy(statusCode) {
	if (statusCode === 404) {
		return {
			title: "Page Not Found",
			message: "This page does not exist or has been moved.",
			short: "Unexpected 404",
			expected: "I expected this URL to resolve to a valid page.",
		}
	}

	if (statusCode === 500) {
		return {
			title: "Server Error",
			message: "Something went wrong on our side.",
			short: "Unexpected 500 server error",
			expected: "I expected this action to complete without a server error.",
		}
	}

	return {
		title: "Application Error",
		message: "An unexpected error occurred.",
		short: `Unexpected error (${statusCode || "unknown"})`,
		expected: "I expected this page to render normally.",
	}
}

export default function CustomError({ statusCode }) {
	const copy = getErrorCopy(statusCode)

	return (
		<section className="relative bg-base-100 text-base-content min-h-screen w-full flex flex-col items-center gap-6 p-10">
			<TagSEO
				metadataProp={{
					title: copy.title,
					description: copy.message,
					keywords: "artists, art community, marketplace",
					robots: "noindex, nofollow",
					og: { title: copy.title, description: copy.message },
				}}
				canonicalSlug="_error"
			/>

			<p className="text-xl md:text-2xl font-medium">{copy.message}</p>

			<Link href="/" className="btn btn-primary">
				Home
			</Link>

			<div className="w-full max-w-3xl">
				<BugReportControl
					isEmbedded
					defaultShortDescription={copy.short}
					defaultExpectedBehavior={copy.expected}
				/>
			</div>
		</section>
	)
}

CustomError.getInitialProps = ({ res, err }) => {
	const statusCode = res?.statusCode || err?.statusCode || 500
	return { statusCode }
}
