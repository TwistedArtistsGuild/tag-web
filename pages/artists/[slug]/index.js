/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { SearchIcon } from "lucide-react"

import TagSEO from "@/components/TagSEO"
import getApiURL from "@/components/widgets/GetApiURL"
import { useAppContext } from "@/components/Context"
import ArtistCard from "@/components/cards/card_artist"
import ListingCardSmall from "@/components/cards/card_listing_small"
import ContactCard from "@/components/cards/card_contactList"
import SocialComments from "@/components/social/Comments"
import { SocialRealtimeProvider } from "@/components/social/SocialRealtimeContext"
import ArtistEventsSection from "@/components/artist/ArtistEventsSection"
import { isArtist, isStaff, isAdmin } from "@/utils/authHelpers"
import { sanitizeDefaultHtml } from "@/components/security/sanitize"
import { pickContactCardData } from "@/utils/artistContactUtils"

const PhotoGallery = dynamic(() => import("@/components/cards/card_photoGallery"), { ssr: false })

const artistSections = [
  { id: "profile", label: "Profile" },
  { id: "gallery", label: "Gallery" },
  { id: "events", label: "Events & Exhibitions" },
  { id: "listings", label: "Art Listings" },
  { id: "comments", label: "Comments & Feedback" },
]

const Artist = (props) => {
  const { data: session } = useSession()
  const { setPageSections } = useAppContext()

  const isArtistOnly = isArtist(session) && !isStaff(session) && !isAdmin(session)
  const canUpdate =
    (isArtistOnly && props.artist.userId == session?.user?.id) ||
    isStaff(session) ||
    isAdmin(session)

  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    setPageSections(artistSections)
    return () => setPageSections([])
  }, [setPageSections])

  useEffect(() => {
    if (!props.artist) console.warn("Artist data failed to load.")
  }, [props.artist])

  const pageMetaData = {
    title: props.artist.title,
    description: props.artist.byline,
    keywords: props.artist.seoTags,
    robots: "index, follow",
    author: props.artist.title,
    viewport: "width=device-width, initial-scale=1.0",
    og: { title: props.artist.title, description: props.artist.byline },
  }

  const listings = (props.listings || []).map((l) => ({
    ...l,
    artist: { ...(l.artist || {}), path: l.artist?.path || props.slug },
  }))

  const galleryItems =
    props.artist?.gallery?.galleryItems ||
    props.artist?.gallery?.items ||
    props.artist?.relatedGallery?.galleryItems ||
    []

  const relatedGalleryImages = galleryItems
    .map((item, index) => {
      const pictureUrl = item?.picture?.url || item?.picture?.URL
      const pictureThumbUrl = item?.picture?.thumbnailURL || item?.picture?.thumbnailUrl || item?.picture?.ThumbnailURL || pictureUrl
      const videoThumbUrl = item?.video?.thumbnailURL || item?.video?.thumbnailUrl || item?.video?.ThumbnailURL || item?.video?.url || item?.video?.URL
      const videoPlaybackUrl = item?.video?.url || item?.video?.URL || ""
      const videoEmbedUrl = item?.video?.embedURL || item?.video?.embedUrl || item?.video?.EmbedURL || ""

      if (pictureUrl) {
        return {
          key: `gallery-picture-${item?.galleryItemID || index}`,
          original: pictureThumbUrl,
          thumbnail: pictureThumbUrl,
          mediaType: "picture",
          sourceURL: pictureUrl,
          embedURL: item?.picture?.embedURL || item?.picture?.embedUrl || item?.picture?.EmbedURL || "",
          description: item?.captionOverride || item?.picture?.description || item?.picture?.title || "",
          byline: item?.picture?.byline || "",
          altText: item?.picture?.altText || item?.picture?.alttext || "",
        }
      }

      if (videoThumbUrl || videoEmbedUrl) {
        return {
          key: `gallery-video-${item?.galleryItemID || index}`,
          original: videoThumbUrl,
          thumbnail: videoThumbUrl,
          mediaType: "video",
          sourceURL: videoPlaybackUrl,
          linkUrl: videoEmbedUrl || videoPlaybackUrl || null,
          embedURL: videoEmbedUrl,
          description: item?.captionOverride || item?.video?.description || item?.video?.title || "",
          byline: item?.video?.byline || "",
          altText: item?.captionOverride || item?.video?.title || "Gallery video",
        }
      }

      return null
    })
    .filter(Boolean)

  const hasGalleryItemsButNoMedia = galleryItems.length > 0 && relatedGalleryImages.length === 0

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

        {!props.artist && (
          <p className="text-center text-base-content/60 mt-4">Loading artist details... Please wait.</p>
        )}

        {props.artist && (
          <>
            {/* Profile + Contact */}
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
                  socials={props.contactCardData?.socials || []}
                  stores={props.contactCardData?.stores || []}
                  contactInfo={props.contactCardData?.contactInfo || {}}
                  contactsHref={`/artists/${props.slug}/contacts`}
                />
              </div>
            </div>

            {/* Gallery */}
            <div id="gallery" className="mt-12">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">Gallery</h2>
              {relatedGalleryImages.length > 0 ? (
                <div className="w-full">
                  <PhotoGallery
                    images={relatedGalleryImages}
                    mode="standalone"
                    navigationMode="manual"
                    imageEffect="landscape"
                    showThumbnails={relatedGalleryImages.length > 1}
                    showContentWarnings={false}
                  />
                </div>
              ) : (
                <div className="rounded-box border border-base-300 bg-base-100 min-h-65 p-6 flex flex-col justify-center">
                  <h3 className="text-base font-semibold text-base-content">Gallery unavailable</h3>
                  <p className="text-sm text-base-content/70 mt-2">
                    {hasGalleryItemsButNoMedia
                      ? "Gallery items were found, but none include renderable image/video URLs."
                      : "No gallery media is available for this artist yet."}
                  </p>
                </div>
              )}
            </div>

            {/* Artist Statement */}
            <div id="statement" className="mt-12 prose max-w-none bg-base-100 p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">Artist Statement</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeDefaultHtml(props.artist.statement || "No statement available."),
                }}
              />
            </div>
            <ArtistEventsSection />

            {/* Listings */}
            <div id="listings" className="mt-12">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">Top Listings</h2>
              {listings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {listings.map((listing) => (
                    <ListingCardSmall
                      key={listing.listingID || listing.listingid || listing.path}
                      listing={listing}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-base-content/60">No listings available for this artist.</p>
              )}
            </div>

            {/* Search */}
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
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label="Search for artist's works"
                    />
                    <button className="btn btn-primary">
                      <SearchIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="text-sm font-medium mr-2 text-base-content/80">Quick Filters:</span>
                  {["Paintings", "Digital Art", "Sculptures", "Photography", "Recent Works"].map((f) => (
                    <button key={f} className="btn btn-sm btn-outline">{f}</button>
                  ))}
                </div>
                <div className="bg-base-200 p-4 rounded-lg text-center text-base-content/80">
                  <p>Enter search terms above to find works by this artist</p>
                  <p className="text-sm text-base-content/60 mt-1">Advanced search options coming soon!</p>
                </div>
              </div>
            </div>

            {/* Comments */}
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
  const getRandomCount = () => Math.floor(Math.random() * 1000) + 1

  if (process.env.DEBUG === "true") {
    console.group(`Artist Slug Page (${slug}) - Data Fetch`)
    console.log("API URL for profile:", `${api_url}artist/${slug}/profile`)
  }

  const fetchData = async (url, defaultData) => {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      if (process.env.DEBUG === "true") console.log("Response data structure:", Object.keys(data))
      return data
    } catch (error) {
      console.error(`Error fetching ${url}:`, error)
      return defaultData
    }
  }

  const artistData = await fetchData(`${api_url}artist/${slug}/profile`, {
    artist: null,
    profilePic: defaultPic,
    coverPic: defaultPic,
    listings: [],
    links: [],
  })

  const artistGalleryData = await fetchData(`${api_url}artist/${slug}`, null)
  if (artistData?.artist && artistGalleryData?.gallery) {
    artistData.artist.gallery = artistGalleryData.gallery
  }

  let contactCardData = { socials: [], stores: [], contactInfo: {} }
  const artistID = Number(artistData?.artist?.artistID || artistData?.artist?.ArtistID || 0)
  if (artistID > 0) {
    try {
      const contactsRes = await fetch(`${api_url}contact/artist/${artistID}`)
      if (contactsRes.ok) {
        const contactsData = await contactsRes.json()
        const rows = Array.isArray(contactsData?.contacts) ? contactsData.contacts : []
        contactCardData = pickContactCardData(
          rows,
          contactsData?.primaryPhone || null,
          contactsData?.primaryAddress || null
        )
      }
    } catch (error) {
      console.error(`Error fetching contacts for artist ${artistID}:`, error)
    }
  }

  if (artistData.artist) {
    artistData.artist = {
      ...artistData.artist,
      loves: artistData.artist.loves || getRandomCount(),
      likes: artistData.artist.likes || getRandomCount(),
      followers: artistData.artist.followers || getRandomCount(),
    }
  }

  if (process.env.DEBUG === "true") console.groupEnd()

  return {
    artist: artistData.artist,
    slug,
    profilePic: artistData.profilePic,
    coverPic: artistData.coverPic,
    listings: artistData.listings,
    links: artistData.links,
    contactCardData,
  }
}

export default Artist
