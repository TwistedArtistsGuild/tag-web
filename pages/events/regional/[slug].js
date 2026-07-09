/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Link from "next/link"
import TagSEO from "@/components/TagSEO"
import shortDateOptions from "@/utils/shortdateoptions"
import PhotoGallery from "@/components/cards/card_photoGallery"

/**
 * 
 * @param {*} props 
 * @returns 
 */
const Events = (props) => {
	const options = shortDateOptions
	const pageMetaData = {
		title: "Regional Events Main Page",
		description: "A list of regional events",
		keywords: "events, ticket, art, performances, classes, teaching",
		robots: "index, follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "Regional Events Main Page",
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
					<div key={event.eventnum} className="card bg-base-100 text-base-content border border-base-300 shadow-lg">
						<div className="card-body">
							<Link href={`/events/${event.path}`}>
								<a className="card-title text-primary">{event.title}</a>
							</Link>
							<p className="text-sm text-base-content/70">{event.byline}</p>
							<p className="text-sm">
								{new Date(event.applied).toLocaleDateString("en-US", options)}
							</p>
							<div className="mt-2">
								<PhotoGallery
									images={["/blank_image.png"]}
									mode="standalone"
									navigationMode="manual"
									imageEffect="landscape"
									showThumbnails={false}
									showContentWarnings={false}
								/>
							</div>
							<div className="text-xs text-base-content/60">Gallery placeholder deployed for this event.</div>
							<div className="mt-2">
								<Link href="/portal/event/create">
									<a className="btn btn-xs btn-outline">Event Gallery Management (Portal placeholder)</a>
								</Link>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

Events.getInitialProps = async function () {
	let data = []

	// If we are running in debug mode, log the active API URL
	if (process.env.DEBUG === "true") {
		console.log("regional event data fetch starting\n /api/artist/") //broke!
	} 
	const res = await fetch("/api/event")
		.then((res) => {
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
