/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Head from "next/head"
import { getMarkdownContent } from "/components/widgets/markdown"

export default function CodeOfConduct({ content }) {
	return (
		<div className="container mx-auto p-4">
			<Head>
				<title>TAG Code of Conduct - All Parties</title>
				<meta name="description" content="How we expect to interact with the world" key="desc" />
				<meta name="keywords" content="art, guild, rules, boundaries, code of conduct, acceptable behaviors, penalties" />
				<meta name="robots" content="index, follow" />
				<meta name="author" content="Bobb Shields" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta property="og:title" content="TAG Code of Conduct" />
				<meta property="og:description" content="How we expect to interact with the world" />
			</Head>
			<div className="prose">
				<h2 className="text-2xl font-bold mb-4">
          The basics to the code of conduct for any and everyone that we interact with: 
				</h2>
				<div dangerouslySetInnerHTML={{ __html: content }} />
			</div>
			<footer className="mt-8 text-center text-gray-500">
			</footer>
		</div>
	)
}

export async function getStaticProps() {
	const content = await getMarkdownContent("content/policy_copyrights.md")
	return {
		props: {
			content,
		},
	}
}

