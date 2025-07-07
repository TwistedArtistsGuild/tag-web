/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Link from "next/link"
import styles from "/styles/pages/artists.module.css"
import { useState } from "react"
import TagSEO from "@/components/TagSEO"
import shortDateOptions from "/utils/shortdateoptions"

/**
 * 
 * @param {*} props 
 * @returns 
 */
const Events = (props) => {
	const options = shortDateOptions
	const pageMetaData = {
		title: "TAG Regional Events Main Page",
		description: "A list of regional events",
		keywords: "events, ticket, art, performances, classes, teaching",
		robots: "index, follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "TAG Regional Events Main Page",
			description: "A list of regional events",
		},
	}

	return (
		<div className="p-4">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="regionalevents" />
			<div className="mb-4">
				<Link href="/portal/event/create">
					<a className="btn btn-primary">Create a new event</a>
				</Link>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{props.events.map((event) => (
					<div key={event.eventnum} className="card shadow-lg">
						<div className="card-body">
							<Link href={`/events/${event.path}`}>
								<a className="card-title text-primary">{event.title}</a>
							</Link>
							<p className="text-sm text-gray-500">{event.byline}</p>
							<p className="text-sm">
								{new Date(event.applied).toLocaleDateString("en-US", options)}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

Events.getInitialProps = async function () {
	let data = []
	let status = ""

	// Set the active API URL defaulting to prod
	var activeAPI_URL = process.env.NEXT_PUBLIC_TAG_API_URL

	// If we are running in debug mode, log the active API URL
	if (process.env.DEBUG === "true") {
		console.log("regional event data fetch starting\n " + activeAPI_URL + "artist/") //broke!
	} 
	const res = await fetch(activeAPI_URL + "event")
		.then((res) => {
			status = res.status
			return res.json()
		})
		.then((res) => (data = res))
		.catch((error) => {
			console.log("An error has occured with your fetch request.. ", error)
		})

	console.log(`event data fetched. Count: ${data.length}`)
	//console.log(data); // Print the contents of the data variable

	return {
		events: data,
		status: res.status,
	}
}

export default Events
