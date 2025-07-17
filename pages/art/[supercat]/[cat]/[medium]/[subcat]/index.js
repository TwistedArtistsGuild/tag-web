/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Link from "next/link";
import { useState } from "react";
import TagSEO from "@/components/TagSEO";
import ListingCard from "/components/card_listing";

/**
 * 
 * @param {*} props 
 * @returns 
 */
const Listings = (props) => {
	const [open, setOpen] = useState(false);

	const pageMetaData = {
		title: `TAG Art Listings - ${props.supercat || "Art"}`,
		description: `Explore ${props.supercat || "art"} in various categories`,
		keywords: `${props.supercat || "art"}, listing, sales, e-commerce`,
		robots: "index, follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: `TAG Art Listings - ${props.supercat || "Art"}`,
			description: `Explore ${props.supercat || "art"} in various categories`,
		},
	};

	return (
		<div className="container mx-auto p-4">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="listings" />

			<div className="mb-6">
				<h2 className="text-2xl font-bold text-center">{`Explore ${props.supercat || "Art"}`}</h2>
				<p className="text-center text-gray-600">{`Discover ${props.supercat || "art"} in the category of ${props.cat || "all categories"}.`}</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{props.listings.map((listing) => {
					return (
						<ListingCard
							key={listing.listingid}
							listing={{
								...listing,
								artist: { path: listing.artist?.path },
								path: listing.path,
							}}
						/>
					);
				})}
			</div>
		</div>
	);
};

Listings.getInitialProps = async function (context) {
	const api_url = process.env.NEXT_PUBLIC_TAG_API_URL;
	const { supercat = "", cat = "", medium = "", subcat = "" } = context.query;

	let data = [];
	let status = 200;

	if (process.env.DEBUG === "true") {
		console.log(`Listing data fetch starting for supercat: ${supercat}, cat: ${cat}, medium: ${medium}, subcat: ${subcat}`);
	}

	try {
		const queryParams = new URLSearchParams({
			supercat,
			cat,
			medium,
			subcat,
			keyword: `${supercat} ${cat} ${medium} ${subcat}`,
		}).toString();

		const res = await fetch(`${api_url}listing/?${queryParams}`);
		status = res.status;
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${status}`);
		}
		data = await res.json();
	} catch (error) {
		console.error("An error has occurred with your fetch request: ", error);
	}

	if (process.env.DEBUG === "true") {
		console.log(`Listing data fetched. Count: ${data.length}`);
	}

	return {
		listings: data,
		status: status,
		supercat,
		cat,
		medium,
		subcat,
	};
};

export default Listings;
