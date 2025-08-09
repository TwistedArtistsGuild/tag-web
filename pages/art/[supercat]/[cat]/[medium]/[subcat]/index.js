/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import TagSEO from "@/components/TagSEO";
import CardFactory from "@/components/cards/CardFactory";
import { SocialRealtimeProvider } from "@/components/social/SocialRealtimeContext";

/**
 *
 * @param {*} props
 * @returns
 */
const Listings = (props) => {

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
  }

	return (
		<SocialRealtimeProvider>
			<div className="container mx-auto p-4">
				<TagSEO metadataProp={pageMetaData} canonicalSlug="listings" />

				<div className="mb-6">
					<h2 className="text-2xl font-bold text-center">{`Explore ${props.supercat || "Art"}`}</h2>
					<p className="text-center text-gray-600">{`Discover ${props.supercat || "art"} in the category of ${props.cat || "all categories"}.`}</p>
					<div className="text-center mt-2">
						<div className="badge badge-info">✨ Enhanced with Social Features</div>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{props.listings.map((listing) => {
						// Create a listing object with proper fallbacks for images
						const listingData = {
							...listing,
							// Ensure image URL with multiple fallback options
							url: listing.profilePic?.url || listing.url || listing.imageUrl || listing.picture?.url || `https://picsum.photos/seed/art-${listing.listingid}/600/400`,
							imageUrl: listing.profilePic?.url || listing.url || listing.imageUrl || listing.picture?.url || `https://picsum.photos/seed/art-${listing.listingid}/600/400`,
							// Add proper title
							title: listing.title || "Untitled Artwork",
							// Add proper description  
							description: listing.description || "Art piece description",
							// Ensure artist data structure
							artist: listing.artist || {
								title: listing.artistName || "Unknown Artist",
								path: listing.artistPath || listing.artistSlug || "#"
							}
						};

						return (
							<CardFactory
								key={listing.listingid}
								type="listing"
								variant="medium"
								data={listingData}
								showInteractions={true}
								orientation="vertical"
								className="w-full"
							/>
						);
					})}
				</div>
			</div>
		</SocialRealtimeProvider>
	);
};

Listings.getInitialProps = async (context) => {
  const api_url = process.env.NEXT_PUBLIC_TAG_API_URL
  const { supercat = "", cat = "", medium = "", subcat = "" } = context.query
  let data = []
  let status = 200

  if (process.env.DEBUG === "true") {
    console.log(
      `Listing data fetch starting for supercat: ${supercat}, cat: ${cat}, medium: ${medium}, subcat: ${subcat}`,
    )
  }

  try {
    const queryParams = new URLSearchParams({
      supercat,
      cat,
      medium,
      subcat,
      keyword: `${supercat} ${cat} ${medium} ${subcat}`,
    }).toString()
    const res = await fetch(`${api_url}listing/?${queryParams}`)
    status = res.status
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${status}`)
    }
    data = await res.json()
  } catch (error) {
    console.error("An error has occurred with your fetch request: ", error)
  }

  if (process.env.DEBUG === "true") {
    console.log(`Listing data fetched. Count: ${data.length}`)
  }

  return {
    listings: data,
    status: status,
    supercat,
    cat,
    medium,
    subcat,
  }
}

export default Listings

