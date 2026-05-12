/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

//Imports
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react"
import TagSEO from "@/components/TagSEO"
import getApiURL from "@/components/widgets/GetApiURL"
import { useAppContext } from "@/components/Context"
import ImageGallery from "react-image-gallery"
import "react-image-gallery/styles/image-gallery.css"
import { CalendarIcon, MapPinIcon, SearchIcon } from "lucide-react"
import ArtistCard from "@/components/cards/card_artist"
import ListingCardSmall from "@/components/cards/card_listing_small"
import ContactCard, { DEFAULT_STORES } from "@/components/cards/card_contactList"
import SocialComments from "@/components/social/Comments"
import { SocialRealtimeProvider } from "@/components/social/SocialRealtimeContext"
import { isArtist, isStaff, isAdmin } from "@/utils/authHelpers";
import { sanitizeDefaultHtml } from "@/components/security/sanitize";

const artistSections = [
  { id: "profile", label: "Profile" },
  { id: "artwork", label: "Featured Artwork" },
  { id: "events", label: "Events & Exhibitions" },
  { id: "listings", label: "Art Listings" },
  { id: "comments", label: "Comments & Feedback" },
]

/**
 * @desc Displays an individual artist's details by the shortname, passed by POST
 * @param {object} props - Component props containing artist data and related information
 * @returns {JSX.Element} - Individual artist page
 */
const Artist = (props) => {
  const { data: session } = useSession();
  const { setPageSections } = useAppContext();

  const isArtistOnly = isArtist(session) && !isStaff(session) && !isAdmin(session);   
  // Artists can update their own page, staff and admins can update any artist page
  const canUpdate = (isArtistOnly && props.artist.userId == session?.user?.id) || (isStaff(session) || isAdmin(session));

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState("")

  // Navigation sections for quick jump
  // Set page sections in context when component mounts
  useEffect(() => {
    setPageSections(artistSections)

    // Clean up when component unmounts
    return () => {
      setPageSections([])
    }
  }, [setPageSections])

  const pageMetaData = {
    title: `${props.artist.title}`,
    description: props.artist.byline,
    keywords: props.artist.seoTags,
    robots: "index, follow",
    author: props.artist.title,
    viewport: "width=device-width, initial-scale=1.0",
    og: {
      title: props.artist.title,
      description: props.artist.byline,
    },
  }

  // Sample artwork data for slideshow (using ImageGallery format) with provided URLs
  const sampleArtworks = [
    {
      original: "https://tagstatic.blob.core.windows.net/pexels/pexels-valeriiamiller-3547625-artistpainting.jpg",
      thumbnail: "https://tagstatic.blob.core.windows.net/pexels/pexels-valeriiamiller-3547625-artistpainting.jpg",
      description: "Artist at work on a canvas",
      title: "Creative Process",
    },
    {
      original: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1340502-artistpaintingmural.jpg",
      thumbnail: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1340502-artistpaintingmural.jpg",
      description: "Artist painting a vibrant mural",
      title: "Mural Art",
    },
    {
      original: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg",
      thumbnail: "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg",
      description: "Another perspective of mural painting",
      title: "Urban Canvas",
    },
    {
      original: "https://tagstatic.blob.core.windows.net/pexels/pexels-daiangan-102127-paintpallette.jpg",
      thumbnail: "https://tagstatic.blob.core.windows.net/pexels/pexels-daiangan-102127-paintpallette.jpg",
      description: "Artist's paint palette with various colors",
      title: "Palette of Colors",
    },
    {
      original: "https://tagstatic.blob.core.windows.net/pexels/pexels-pixabay-262034-brushes.jpg",
      thumbnail: "https://tagstatic.blob.core.windows.net/pexels/pexels-pixabay-262034-brushes.jpg",
      description: "Art brushes ready for use",
      title: "Tools of the Trade",
    },
  ]

  // Sample comments
  const listings = (props.listings || []).map((l) => ({
    ...l,
    artist: { ...(l.artist || {}), path: l.artist?.path || props.slug },
  }))
  // Dummy events data
  const events = [
    {
      id: 1,
      title: "Gallery Opening",
      date: "2023-12-15",
      location: "Downtown Art Gallery",
      description: "Come see the latest collection of works in this exclusive gallery opening.",
    },
    {
      id: 2,
      title: "Art Workshop",
      date: "2024-01-10",
      location: "Community Center",
      description: "Learn techniques and tips in this hands-on workshop for artists of all levels.",
    },
    {
      id: 3,
      title: "Virtual Exhibition",
      date: "2024-01-25",
      location: "Online",
      description: "Join us online for a virtual tour of the newest artistic creations.",
    },
  ]

  // Dummy social links (for external links, not the internal counters)
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  useEffect(() => {
    if (!props.artist) {
      console.warn("Artist data failed to load.")
    }
  }, [props.artist])

  return (
    <SocialRealtimeProvider>
      <div className="mx-auto p-4 relative max-w-6xl bg-base-200 text-base-content">
        <TagSEO metadataProp={pageMetaData} canonicalSlug={`artists/${props.slug}`} />

      {/* Cover Picture */}
      <div className="relative w-full h-60 md:h-96 overflow-hidden rounded-lg shadow-lg">
        <Image
          src={props.coverPic?.url || "/blank_image.png"}
          alt={props.coverPic?.altText || "Cover Picture"}
          layout="fill"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

        {/* Loading Message */}
        {!props.artist && <p className="text-center text-base-content/60 mt-4">Loading artist details... Please wait.</p>}

        {/* Artist Details */}
        {props.artist && (
          <>
          {/* Artist Profile Card */}
          <div id="profile" className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
            <div className="xl:col-span-2">
              <ArtistCard
                showHeaderGallery={false}
                showContentGallery={false}
                artist={{
                  ...props.artist,
                  profilePic: props.profilePic,
                  images: props.profilePic?.url ? [props.profilePic.url] : [],
                  path: props.slug,
                  since: props.artist?.applied,
                  panelSize: "full",
                }}
              />
            </div>

            <div id="social" className="xl:col-span-1">
              <ContactCard
                displayName={props.artist?.title || "Artist"}
                compact={true}
                stores={DEFAULT_STORES}
                contactInfo={{
                  email: "satarah@example.com",
                  location: "Multnomah County, Oregon",
                  customUrls: [
                    {
                      label: "Portfolio",
                      url: "https://satarah-portfolio.com",
                      purpose: "Full collection & commissions",
                    },
                  ],
                }}
              />
            </div>
          </div>

          {/* Artist Statement Section */}
          <div id="statement" className="mt-12 prose max-w-none bg-base-100 p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">Artist Statement</h2>
            <div dangerouslySetInnerHTML={{ __html: sanitizeDefaultHtml(props.artist.statement || "No statement available.") }} />
          </div>

          {/* Featured Artwork Gallery */}
          <div id="artwork" className="mt-12">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">Featured Artwork</h2>
            <div className="card bg-base-100 shadow-lg p-4">
              {sampleArtworks.length > 0 ? (
                <div className="rounded-lg overflow-hidden" style={{ maxHeight: "600px" }}>
                  <ImageGallery
                    items={sampleArtworks}
                    showPlayButton={true}
                    showFullscreenButton={true}
                    showThumbnails={true}
                    showBullets={true}
                    showNav={true}
                    thumbnailPosition="bottom"
                    additionalClass="artwork-gallery"
                    useBrowserFullscreen={true}
                    slideInterval={5000}
                    lazyLoad={true}
                    renderItem={(item) => (
                      <div className="image-gallery-image">
                        <div className="relative mx-auto h-[500px] w-full max-w-4xl">
                          <Image
                            src={item.original || "/placeholder.svg"}
                            alt={item.description || item.title || "Featured artwork"}
                            fill
                            unoptimized
                            sizes="(max-width: 1024px) 100vw, 896px"
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                        {item.description && <div className="image-gallery-description">{item.description}</div>}
                      </div>
                    )}
                    renderThumbInner={(item) => (
                      <div className="image-gallery-thumbnail-inner">
                        <Image
                          src={item.thumbnail || "/placeholder.svg"}
                          alt={item.description || item.title || "Artwork thumbnail"}
                          className="image-gallery-thumbnail-image"
                          width={120}
                          height={80}
                          unoptimized
                          style={{ objectFit: "cover", height: "80px" }}
                        />
                        <div className="image-gallery-thumbnail-label">{item.title}</div>
                      </div>
                    )}
                  />
                </div>
              ) : (
                <div className="text-center text-base-content/60 p-4">
                  <p>No featured artwork available for this artist yet.</p>
                  <p className="text-sm mt-1">Check back soon for updates!</p>
                </div>
              )}
              <div className="mt-4 flex justify-between items-center">
                <p className="text-lg font-medium">Browse the artist&apos;s featured collection</p>
                <button className="btn btn-primary btn-sm">View All Works</button>
              </div>
            </div>
          </div>

          {/* Events Section */}
          <div id="events" className="mt-12">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">Upcoming Events</h2>
            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event) => (
                  <div key={event.id} className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow">
                    <div className="card-body p-4">
                      <h3 className="card-title text-primary text-lg">{event.title}</h3>
                      <div className="flex items-center text-sm mb-1 text-base-content/70">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center text-sm mb-3 text-base-content/70">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {event.location}
                      </div>
                      <p className="text-sm text-base-content/80">{event.description}</p>
                      <div className="card-actions justify-end mt-2">
                        <button className="btn btn-sm btn-outline btn-primary">Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-base-content/60">No upcoming events for this artist.</p>
            )}
          </div>

          {/* Listings Section */}
          <div id="listings" className="mt-12">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">Top Listings</h2>
            {listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((listing) => (
                  <ListingCardSmall key={listing.listingID || listing.listingid || listing.path} listing={listing} />
                ))}
              </div>
            ) : (
              <p className="text-base-content/60">No listings available for this artist.</p>
            )}
          </div>

          {/* Search Section */}
          <div id="search" className="mt-12">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">Search Works</h2>
            <div className="card bg-base-100 shadow-lg p-6">
              <div className="form-control mb-4">
                <div className="input-group w-full">
                  <input
                    type="text"
                    placeholder="Search by title, medium, or style..."
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    aria-label="Search for artist's works"
                  />
                  <button className="btn btn-primary">
                    <SearchIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="text-sm font-medium mr-2 text-base-content/80">Quick Filters:</span>
                <button className="btn btn-sm btn-outline">Paintings</button>
                <button className="btn btn-sm btn-outline">Digital Art</button>
                <button className="btn btn-sm btn-outline">Sculptures</button>
                <button className="btn btn-sm btn-outline">Photography</button>
                <button className="btn btn-sm btn-outline">Recent Works</button>
              </div>
              <div className="bg-base-200 p-4 rounded-lg text-center text-base-content/80">
                <p>Enter search terms above to find works by this artist</p>
                <p className="text-sm text-base-content/60 mt-1">Advanced search options coming soon!</p>
              </div>
            </div>
          </div>

          {/* Comments & Feedback Section */}
          <div id="comments" className="mt-12 mb-8">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">Comments & Feedback</h2>
            <div className="card bg-base-100 shadow-lg p-6">
              <SocialComments
                contextId={`artist-${props.artist?.artistid || props.slug}`}
                initialComments={[]}
                readOnly={false}
              />
            </div>
          </div>

          {/* Update Link */}
          {canUpdate && (
          <div className="mt-8 text-center">
            <Link href={`/artists/${props.slug}/update`} className="btn btn-primary">
              Update this artist page
            </Link>
           </div>
           )}

          </>
        )}
      </div>
    </SocialRealtimeProvider>
  )
}

/**
 * Fetches artist data from the API during server-side rendering
 * @param {object} context - Next.js context object containing query parameters
 * @returns {object} - Props to be passed to the Artist component
 */
Artist.getInitialProps = async (context) => {
  const { slug } = context.query
  const api_url = getApiURL()
  const defaultPic = {
    picturenum: 1,
    context: "artists",
    slug: "default",
    metadata: "default",
    title: "default",
    alttext: "default",
    url: "/blank_image.png",
  }

  // Function to generate a random number for social counters
  const getRandomCount = () => Math.floor(Math.random() * 1000) + 1 // Random number between 1 and 1000

  // Debug startup info
  if (process.env.DEBUG === "true") {
    console.group(`Artist Slug Page (${slug}) - Data Fetch`)
    console.log("API URL for profile:", `${api_url}artist/${slug}/profile`)
  }
  const fetchData = async (url, defaultData) => {
    try {
      const res = await fetch(url)

      if (process.env.DEBUG === "true") {
        console.log(`Fetch response for ${url}:`, {
          status: res.status,
          ok: res.ok,
          statusText: res.statusText,
        })
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()

      if (process.env.DEBUG === "true") {
        console.log("Response data structure:", Object.keys(data))
      }

      return data
    } catch (error) {
      console.error(`Error fetching ${url}:`, error)
      return defaultData
    }
  }
  // Fetch artist profile data
  const artistData = await fetchData(`${api_url}artist/${slug}/profile`, {
    artist: null,
    profilePic: defaultPic,
    coverPic: defaultPic,
    listings: [],
    links: [],
  })

  // Add random social counters to the artist data if they don't exist
  if (artistData.artist) {
    artistData.artist = {
      ...artistData.artist,
      loves: artistData.artist.loves || getRandomCount(),
      likes: artistData.artist.likes || getRandomCount(),
      followers: artistData.artist.followers || getRandomCount(),
    }
  }

  // Debug logs for troubleshooting
  if (process.env.DEBUG === "true") {
    console.log("Artist object structure:", artistData.artist ? Object.keys(artistData.artist) : "No artist data")

    if (artistData.artist) {
      console.log("Artist profilePic ID:", artistData.artist.profilePicID)
      console.log("Artist profilePic object:", artistData.artist.profilePic)
    }

    console.log("Separate profilePic from API:", artistData.profilePic)

    // Check if profilePic paths match what's expected
    if (artistData.artist?.profilePic && artistData.profilePic) {
      const artistPicUrl = artistData.artist.profilePic.url
      const separatePicUrl = artistData.profilePic.url
      console.log("Artist's embedded profilePic URL:", artistPicUrl)
      console.log("Separate profilePic URL:", separatePicUrl)
      console.log("URLs match:", artistPicUrl === separatePicUrl)
    }

    console.groupEnd()
  }

  return {
    artist: artistData.artist,
    slug: slug,
    profilePic: artistData.profilePic,
    coverPic: artistData.coverPic,
    listings: artistData.listings,
    links: artistData.links,
  }
}

export default Artist

