/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import { getMarkdownContent } from "@/components/widgets/markdown"
import TagSEO from "@/components/TagSEO"

export default function CodeOfConduct({ content }) {
	const pageMetaData = {
		title: "Terms of Service",
		description: "Read the Platform terms of service and platform usage expectations.",
		keywords: "terms of service, platform rules, usage terms",
		og: {
			title: "Terms of Service",
			description: "Read the Platform terms of service and platform usage expectations.",
		},
	}

	return (
		<div className="container mx-auto max-w-5xl p-4 md:p-6">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="about/termsofservice" />
			<div className="prose prose-base-content max-w-none lg:prose-xl">
				<h1 className="text-4xl md:text-5xl font-bold text-primary text-center my-6">
					Our website&apos;s terms of service
				</h1>
				<div dangerouslySetInnerHTML={{ __html: content }} />
			</div>
		</div>
	)
}

export async function getStaticProps() {
	const content = await getMarkdownContent("content/tos.md")
	return {
		props: {
			content,
		},
	}
}


