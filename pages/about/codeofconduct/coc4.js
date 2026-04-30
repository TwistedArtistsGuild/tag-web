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
		title: "Code of Conduct - Guild Employees",
		description: "How we expect to interact with the world",
		keywords: "art, guild, rules, boundaries, code of conduct, acceptable behaviors, penalties",
		robots: "index, follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "Code of Conduct",
			description: "How we expect to interact with the world",
		},
	}

	return (
      <div className="container mx-auto p-4">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="about/codeofconduct/coc4" />
			<div className="prose">
				<h2 className="text-2xl font-bold mb-4">
          The code of conduct for guild employees, staff, board, and vendors: 
				</h2>
				<div dangerouslySetInnerHTML={{ __html: content }} />
			</div>
			<footer className="mt-8 text-center text-base-content/60">
			</footer>
		</div>
	)
}

export async function getStaticProps() {
	const content = await getMarkdownContent("content/coc4.md")
	return {
		props: {
			content,
		},
	}
}



