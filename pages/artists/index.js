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
		<main className="flex flex-col min-h-screen w-full bg-base-100">
			<div className="w-full max-w-5xl mx-auto flex flex-col items-center px-4 py-8">
				<TagSEO metadataProp={pageMetaData} canonicalSlug="artists" />

				{/* Introductory Section */}
				<section className="w-full mb-8 bg-base-200 rounded-xl shadow p-6 text-center">
					<h1 className="text-3xl md:text-4xl font-extrabold mb-2 font-josefin-sans">Artist Portfolios</h1>
					<p className="text-lg md:text-xl text-base-content/90 mb-2">
						Discover the creative energy of Twisted Artists Guild members. Each portfolio showcases the artist’s unique voice, featured works, and ways to connect or support them.
					</p>
					<ul className="list-disc list-inside text-base-content/80 text-left max-w-2xl mx-auto mb-2">
						<li>Artist statement & philosophy</li>
						<li>Carousel of featured works</li>
						<li>Tags for genre, technique, or theme</li>
						<li>Timeline of recent projects</li>
						<li>Links to social, shops, or commissions</li>
					</ul>
					<p className="text-base-content/80">Explore by style, medium, or vibe.</p>
				</section>

				{/* Future: Filters/Featured/Sections */}
				<section className="w-full mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
					{/* Placeholder for filters, featured artists, etc. */}
					<div className="flex-1" />
					<Link href="/portal/artist/create" className="btn btn-primary">Create a new artist</Link>
				</section>

				{/* Main Artist Card Grid */}
				<section className="w-full flex-1 min-h-[400px] flex flex-col justify-stretch">
					{props.artists && props.artists.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
							{props.artists.map((artist) => (
								<div key={artist.artistid} className="h-[75%] min-h-[300px] flex items-stretch">
									<ArtistCard artist={artist} className="flex-1 h-full" />
								</div>
							))}
						</div>
					) : (
						<div className="alert alert-info w-full flex justify-center">
							<span>No artists found. Be the first to create an artist profile!</span>
						</div>
					)}
				</section>

				{/* Future: Additional content sections (interviews, timelines, etc.) */}
			</div>
		</main>
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

