/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

"use client"
import { useState } from "react"
import TagSEO from "@/components/TagSEO"
import ListingCard from "/components/card_listing"

/**
 *
 * @param {*} props
 * @returns
 */
const Listings = (props) => {
  const [open, setOpen] = useState(false) // This state is not used in the current JSX, but kept for consistency

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
    <div className="min-h-screen bg-gray-100 text-base-content py-8 px-4">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="listings" />
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {`Explore ${props.supercat || "Art"}`}
          </h1>
          <p className="text-xl md:text-2xl text-secondary">
            {`Discover ${props.supercat || "art"} in the category of ${props.cat || "all categories"}.`}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {props.listings.length > 0 ? (
            props.listings.map((listing, index) => {
              return (
                <ListingCard
                  key={listing.listingid || index}
                  listing={{
                    ...listing,
                    artist: { path: listing.artist?.path, title: listing.artist?.title }, // Ensure artist title is passed
                    path: listing.path,
                    // Add dummy social counters if not present in API data
                    loves: listing.loves || Math.floor(Math.random() * 1000) + 1,
                    likes: listing.likes || Math.floor(Math.random() * 1000) + 1,
                    followers: listing.followers || Math.floor(Math.random() * 1000) + 1,
                  }}
                />
              )
            })
          ) : (
            <div className="alert alert-info col-span-full">
              <span>No listings found in this category.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

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

