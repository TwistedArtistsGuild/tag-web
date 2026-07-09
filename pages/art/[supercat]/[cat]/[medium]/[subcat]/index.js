/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import TagSEO from "@/components/TagSEO";
import ListingCard from "@/components/cards/card_listing";
import { getPanelClass } from "@/components/cards/sizes/panel-layout";

/**
 *
 * @param {*} props
 * @returns
 */
const Listings = (props) => {

  const canonicalSlug = `art/${props.supercat}/${props.cat}/${props.medium}/${props.subcat}`

  const pageMetaData = {
    title: `${props.supercat} Listings`,
    description: `Explore ${props.supercat} listings across ${props.cat} (${props.subcat}).`,
    keywords: `${props.supercat}, ${props.cat}, ${props.medium}, ${props.subcat}, listing, gallery`,
    robots: "index, follow",
    author: "Bobb Shields",
    viewport: "width=device-width, initial-scale=1.0",
    og: {
      title: `${props.supercat} Listings`,
      description: `Explore ${props.supercat} listings across ${props.cat} (${props.subcat}).`,
    },
  }

  return (
    
      <div className="container mx-auto p-4">
        <TagSEO metadataProp={pageMetaData} canonicalSlug={canonicalSlug} />

				<div className="mb-6">
					<h2 className="text-2xl font-bold text-center">{`Explore ${props.supercat || "Art"}`}</h2>
					<p className="text-center text-base-content/70">{`Discover ${props.supercat || "art"} in the category of ${props.cat || "all categories"}.`}</p>
					<div className="text-center mt-2">
						<div className="badge badge-info">✨ Enhanced with Social Features</div>
					</div>
				</div>
        <div className="grid grid-cols-1 items-start md:grid-cols-6 lg:grid-cols-12 gap-6">
          {props.listings.map((listing, index) => (
            <div
              key={listing.path || listing.listingid || `${listing.title || "listing"}-${index}`}
              className={`${getPanelClass(listing.panelSize)} self-start`}
            >
              <ListingCard listing={listing} panelSize={listing.panelSize} textRenderMode="html" />
            </div>
          ))}
        </div>
      </div>
    
  );
};

Listings.getInitialProps = async (context) => {
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
    const res = await fetch(`/api/listing/?${queryParams}`)
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

  const listings = (Array.isArray(data) ? data : []).map((listing) => ({
    ...listing,
    panelSize: "half",
  }))

  return {
    listings,
    status: status,
    supercat,
    cat,
    medium,
    subcat,
  }
}

export default Listings


