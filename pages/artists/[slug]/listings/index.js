/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useRouter } from "next/router"
import Link from "next/link"
import { useState, useEffect } from "react"
import getApiURL from "@/components/widgets/GetApiURL"
import TagSEO from "@/components/TagSEO"
import ListingCard from "@/components/cards/card_listing"

const ArtistListings = ({ initialListings = [] }) => {
  const [listings, setListings] = useState(initialListings)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { slug } = router.query
  const canonicalSlug = slug ? `artists/${slug}/listings` : "artists"
  
  const pageMetaData = {
    title: "Artist Listings",
    description: "Browse listings published by this artist on Platform.",
    keywords: "artist listings, artist portfolio, TAG artists",
    og: {
      title: "Artist Listings",
      description: "Browse listings published by this artist on Platform.",
    },
  }

  useEffect(() => {
    const fetchListings = async () => {
      if (!slug) return

      try {
        const apiUrl = getApiURL()
        const response = await fetch(`${apiUrl}artist/${slug}/listings`)
        
        if (!response.ok) {
          console.error(`Error fetching artist listings: ${response.status}`)
          setLoading(false)
          return
        }
        
        const data = await response.json()
        setListings(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching listings:', error)
        setLoading(false)
      }
    }

    fetchListings()
  }, [slug])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <TagSEO metadataProp={pageMetaData} canonicalSlug={canonicalSlug} />
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <TagSEO metadataProp={pageMetaData} canonicalSlug={canonicalSlug} />
        <h2 className="text-2xl font-bold mb-4">No listings found for this artist</h2>
        <p>Check back later or explore other artists.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <TagSEO metadataProp={pageMetaData} canonicalSlug={canonicalSlug} />
      <h1 className="text-3xl font-bold mb-6">Artist Listings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map(listing => (
          <ListingCard
            key={listing.listingID}
            listing={listing}
            panelSize="third"
            showGalleryThumbnails={false}
            hideGallery={false}
            enableDynamicImpressions={true}
          />
        ))}
      </div>
    </div>
  )
}

ArtistListings.getInitialProps = async function (context) {
  const { slug } = context.query
  const apiUrl = getApiURL()

  // Only fetch on server-side to avoid duplicate requests
  if (!context.req) return { initialListings: [] }

  try {
    const res = await fetch(`${apiUrl}artist/${slug}/listings`)
    if (!res.ok) return { initialListings: [] }
    
    const data = await res.json()
    return { initialListings: data }
  } catch (error) {
    console.error('Error in getInitialProps:', error)
    return { initialListings: [] }
  }
}

export default ArtistListings

