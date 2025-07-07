/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Head from "next/head"
import PropTypes from "prop-types"
import config from "@/config"

// Predefined SEO tags — prefilled with default values but you can customize them for each page
// This let you add default SEO tags to all pages, like /terms, /privacy, without rewrtting them all
const defaults = {
	title: "TAG Default Title",
	description: "Default description",
	keywords: "art, e-commerce, social media, project management, events, tickets",
	robots: "index, follow",
	author: "Bobb Shields",
	viewport: "width=device-width, initial-scale=1.0",
	canonical: "twistedartistsguild.com",
	icon: "/tag_logo.png",
	og: {
		title: "Twisted Artists Guild",
		description: "Default description",
		locale: "en_US",
		site_name: "Twisted Artists Guild",
		type: "website", // article, website, blog, book, game, movie, food, city, country, actor, politician, author, hotel
		image: "/tag_logo.png",
		url: "twistedartistsguild.com"
	},
}

// This components should be added to every pages you want to rank on Google (in /pages directory).
// It prefills data with default title/description/OG but you can cusotmize it for each page.
// REQUIRED: The canonicalSlug is required for each page (it's the slug of the page, without the domain name and without the trailing slash)
const TagSEO = ({
	children,
	metadataProp,
	canonicalSlug,
}) => {

	// Overwrite defaults with metadataProp if it exists
	const metadata = { ...defaults, ...metadataProp };

	return (
		<Head>
			{/* TITLE */}
			<title key="title">{metadata.title}</title>

			{/* METAS */}
			<meta
				name="description"
				key="description"
				content={metadata.description}
			/>
			<meta
				name="keywords"
				key="keywords"
				content={metadata.keywords}
			/>
			<meta
				name="robots"
				key="robots"
				content={metadata.robots}
			/>
			<meta
				name="author"
				key="author"
				content={metadata.author}
			/>
			<meta
				name="viewport"
				key="viewport"
				content={metadata.viewport}
			/>
			<link
				rel="icon"
				href={metadata.icon}
			/>

			{/* OG METAS */}
			<meta property="og:type" content={metadata.og.type} />
			<meta property="og:title" content={metadata.og.title} />
			<meta
				property="og:description"
				key="og:description"
				content={metadata.og.description}
			/>
			<meta
				property="og:image"
				key="og:image"
				content={metadata.og.image}
			/>
			<meta property="og:url" content={metadata.og.url} />
			<meta property="og:locale" content={metadata.og.locale} />
			<meta property="og:site_name" content={metadata.og.site_name} />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:creator" content="@marc_louvion" />

			{/* CANONICAL TAG */}
			<link
				rel="canonical"
				href={`https://${config.domainName}/${canonicalSlug}`}
			/>

			{/* CHILDREN TAGS */}
			{children}
		</Head>
	)
}

export default TagSEO

TagSEO.propTypes = {
	canonicalSlug: PropTypes.string.isRequired,
	metadataProp: PropTypes.object,
}
