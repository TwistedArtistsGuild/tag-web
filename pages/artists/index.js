/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Link from "next/link"
import styles from "/styles/pages/artists.module.css"
import Sidebar from "/components/Sidebar"
import { useState } from "react"
import TagSEO from "@/components/TagSEO"
import ArtistCard from "/components/card_artist"

/**
 * Artists page component that displays list of artist members
 * @param {Object} props - Component props containing artists data
 * @returns {JSX.Element} - Artists page component
 */
const Artists = (props) => {
	const [open, setOpen] = useState(false)

	const pageMetaData = {
		title: "TAG Artists Links",
		description: "A list of our artist members",
		keywords: "art, artist member, sales, portfolio",
		robots: "index, follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "TAG Artists Links",
			description: "A list of our artist members",
		},
	}

	return (
		<main className="flex flex-col min-h-screen">
			<div className={styles.container}>
				<TagSEO metadataProp={pageMetaData} canonicalSlug="artists" />

				<div className="flex-1 flex flex-col items-center py-4 w-full">
					<Link
						href="/portal/artist/create"
						className="btn btn-primary mb-4">
						{"Create a new artist"}
					</Link>
					<div className="flex flex-col items-center w-full flex-grow">
						{props.artists && props.artists.length > 0 ? (
							props.artists.map((artist) => (
								<ArtistCard key={artist.artistid} artist={artist} />
							))
						) : (
							<div className="alert alert-info">
								<span>No artists found. Be the first to create an artist profile!</span>
							</div>
						)}
					</div>
				</div>
				<Sidebar open={open} setOpen={setOpen} artists={props.artists} />
			</div>
		</main>
	)
}

Artists.getInitialProps = async function () {
	const api_url = process.env.NEXT_PUBLIC_TAG_API_URL

	let data = []
	let status = 200

	// If we are running in debug mode, log the active API URL
	if (process.env.DEBUG === "true") {
		console.log("Artist data fetch starting via API: \n " + api_url + "artist/")
	}

	try {
		// Fetch the artist data
		const res = await fetch(api_url + "artist/")
		status = res.status
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${status}`)
		}
		data = await res.json()
	} catch (error) {
		console.error("An error has occurred with your artist fetch request: ", error)
	}

	// If we are running in debug mode, log the artist data
	if (process.env.DEBUG === "true") {
		console.log(`Artist data fetched. Count: ${data.length}`)
	}

	// Return the artist data and status
	return {
		artists: data,
		status: status,
		sidebarProps: { card_listings: data }
	}
}

export default Artists
