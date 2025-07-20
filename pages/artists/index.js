/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import Link from "next/link"
import { useState } from "react"
import TagSEO from "@/components/TagSEO"
import ArtistCard from "@/components/card_artist"
import ArtistCardWithPic from "@/components/card_artist_wPic" // Import the new component

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
		<div className="min-h-screen flex flex-col bg-base-100 text-base-content">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="artists" />
			{/* Hero Section */}
			<section className="text-center py-12">
				<h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-primary">
					Artist Portfolios
				</h1>
				<p className="text-xl md:text-2xl text-secondary mb-6">
					Discover the creative energy of Twisted Artists Guild members. Each portfolio showcases the artist’s unique voice, featured works, and ways to connect or support them.
				</p>
				<p className="text-lg text-base-content max-w-3xl mx-auto mb-4">
					Explore by style, medium, or vibe.
				</p>
			</section>
			<main className="container mx-auto px-4 py-8 flex-1 w-full">
				{/* Call to Action */}
				<div className="flex justify-end mb-8">
					<Link href="/portal/artist/create" className="btn btn-primary">Create a new artist</Link>
				</div>
				{/* Main Artist Card Grid */}
				<section className="w-full flex-1 min-h-[400px] flex flex-col justify-stretch">
					{props.artists && props.artists.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{props.artists.map((artist) => (
								<div key={artist.artistid} className="flex items-stretch">
									<div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out w-full">
										<ArtistCard artist={artist} className="flex-1 h-full" />
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="alert alert-info w-full flex justify-center">
							<span>No artists found. Be the first to create an artist profile!</span>
						</div>
					)}
				</section>
			</main>
		</div>
	)
}

Artists.getInitialProps = async () => {
  const api_url = process.env.NEXT_PUBLIC_TAG_API_URL
  let data = []
  let status = 200

  // Function to generate a random number for social counters
  const getRandomCount = () => Math.floor(Math.random() * 1000) + 1 // Random number between 1 and 1000

  // Function to generate random placeholder images for slideshow
  const getRandomImages = (count = 3) => {
    const images = []
    for (let i = 0; i < count; i++) {
      images.push({
        url: `/placeholder.svg?height=200&width=300&text=Art+${Math.floor(Math.random() * 100)}`,
        alt: `Artist artwork ${i + 1}`,
      })
    }
    return images
  }

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

    // Add random social counters and images to each artist after fetching
    data = data.map((artist, index) => ({
      ...artist,
      loves: getRandomCount(),
      likes: getRandomCount(),
      followers: getRandomCount(),
      // Add images to some artists for demonstration
      images: index % 2 === 0 ? getRandomImages(Math.floor(Math.random() * 3) + 2) : [], // 2-4 images for every other artist
    }))
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
    sidebarProps: { card_listings: data },
  }
}

export default Artists

