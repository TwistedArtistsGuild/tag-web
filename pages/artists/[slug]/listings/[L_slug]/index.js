/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import SocialComments from "@/components/social/Comments" // Import SocialComments component
import { SocialRealtimeProvider } from "@/components/social/SocialRealtimeContext"
import getApiURL from "@/components/widgets/GetApiURL"
import TagSEO from "@/components/TagSEO"
import ListingCard from "@/components/cards/card_listing"
import dynamic from "next/dynamic"
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react"
import { PERMISSIONS } from "@/utils/permissions";
import { hasPermission } from "@/utils/authHelpers";

const PhotoGallery = dynamic(() => import("@/components/cards/card_photoGallery"), { ssr: false })

const mapGalleryItemsToMedia = (entity) => {
  const items =
    (Array.isArray(entity?.gallery?.galleryItems) && entity.gallery.galleryItems) ||
    (Array.isArray(entity?.gallery?.GalleryItems) && entity.gallery.GalleryItems) ||
    (Array.isArray(entity?.gallery?.items) && entity.gallery.items) ||
    (Array.isArray(entity?.relatedGallery?.galleryItems) && entity.relatedGallery.galleryItems) ||
    (Array.isArray(entity?.relatedGallery?.GalleryItems) && entity.relatedGallery.GalleryItems) ||
    []
  if (items.length === 0) return []

  return items
    .slice()
    .sort((a, b) => (Number(a?.sortOrder) || 0) - (Number(b?.sortOrder) || 0))
    .map((item) => {
      const picture = item?.picture || item?.Picture
      const video = item?.video || item?.Video
      const pictureUrl =
        picture?.url ||
        picture?.URL ||
        picture?.path ||
        picture?.Path ||
        picture?.normalizedURL ||
        picture?.NormalizedURL ||
        picture?.contentUrl ||
        picture?.contentURL ||
        picture?.src ||
        item?.url ||
        item?.URL ||
        item?.path ||
        item?.Path ||
        item?.contentUrl ||
        item?.contentURL ||
        ""

      const pictureThumb =
        picture?.thumbnailURL ||
        picture?.thumbnailUrl ||
        picture?.ThumbnailURL ||
        picture?.thumbnail ||
        item?.thumbnailURL ||
        item?.thumbnailUrl ||
        item?.ThumbnailURL ||
        pictureUrl

      const videoThumb =
        video?.thumbnailURL ||
        video?.thumbnailUrl ||
        video?.ThumbnailURL ||
        video?.thumbnail ||
        item?.thumbnailURL ||
        item?.thumbnailUrl ||
        item?.ThumbnailURL ||
        "/blank_image.png"
      const url = picture ? pictureThumb : videoThumb

      if (!url) return null

      if (picture && !pictureUrl) return null

      if (!picture && !video) return null

      return {
        original: url,
        thumbnail: url,
        mediaType: picture ? "picture" : "video",
        sourceURL: picture ? pictureUrl : (video?.url || video?.URL || ""),
        embedURL: picture ? (picture?.embedURL || picture?.EmbedURL || "") : (video?.embedURL || video?.embedUrl || video?.EmbedURL || ""),
        description:
          item?.captionOverride ||
          item?.CaptionOverride ||
          picture?.description ||
          video?.description ||
          picture?.title ||
          video?.title ||
          "",
        byline: picture?.byline || video?.byline || "",
        altText: picture?.altText || picture?.alttext || "",
      }
    })
    .filter(Boolean)
}

const getListingGalleryImages = (listing) => {
  const galleryMedia = mapGalleryItemsToMedia(listing)
  if (galleryMedia.length > 0) {
    return galleryMedia
  }

  const metadataCollections = [
    listing?.pictureMetadata,
    listing?.imageMetadata,
    listing?.imagesMetadata,
    listing?.contentImages,
    listing?.content,
  ]

  const metadataUrls = metadataCollections
    .flatMap((collection) => (Array.isArray(collection) ? collection : []))
    .map((item) => {
      if (typeof item === "string") return item
      return item?.contentUrl || item?.contentURL || item?.url || item?.src || ""
    })
    .map((url) => String(url || "").trim())
    .filter(Boolean)

  if (metadataUrls.length > 0) {
    return metadataUrls
  }

  const dbImages = Array.isArray(listing?.images)
    ? listing.images
      .map((item) => {
        if (typeof item === "string") return item
        return item?.contentUrl || item?.contentURL || item?.url || item?.src || ""
      })
      .map((url) => String(url || "").trim())
      .filter(Boolean)
    : []

  if (dbImages.length > 0) {
    return dbImages
  }

  return []
}

const normalizeListingPayload = (payload) => {
  if (!payload) {
    return {}
  }

  if (Array.isArray(payload)) {
    return payload[0] || {}
  }

  return payload
}

const ListingDetails = ({ listing, slug }) => {
  const { data: session } = useSession();
  const canAddComment = hasPermission(session, PERMISSIONS.LISTING.COMMENT);
  const [blobGalleryResult, setBlobGalleryResult] = useState({ listingId: null, items: [] })

  const canonicalSlug = listing.seoCanonicalSlug
  const pageMetaData = {
    title: listing.seoTitle,
    description: listing.seoDescription,
    keywords: listing.seoKeywords,
    og: {
      title: listing.seoOgTitle,
      description: listing.seoOgDescription,
      image: listing.seoImage,
    },
  }

  const listingGalleryImages = getListingGalleryImages(listing)
  const listingId = useMemo(
    () => listing?.listingID || listing?.ListingID || listing?.listingid || listing?.listingId || listing?.ListingId || null,
    [listing],
  )

  useEffect(() => {
    if (!listingId) {
      return
    }

    const galleryPrefix = `platformpics/listing/${listingId}/gallery/`

    const fetchBlobGallery = async () => {
      try {
        const res = await fetch(`/api/image/list?container=tagpictures&startPrefix=${encodeURIComponent(galleryPrefix)}&prefix=${encodeURIComponent(galleryPrefix)}`)
        if (!res.ok) return

        const payload = await res.json()
        const files = Array.isArray(payload?.files) ? payload.files : []
        const mapped = files
          .filter((file) => {
            const ct = String(file?.contentType || "").toLowerCase()
            return ct.startsWith("image/") || !ct
          })
          .map((file) => ({
            original: file?.url,
            thumbnail: file?.url,
            mediaType: "picture",
            sourceURL: file?.url,
            embedURL: "",
            description: "",
            byline: "",
            altText: file?.name || "Gallery image",
          }))
          .filter((item) => Boolean(item?.original))

        setBlobGalleryResult({ listingId, items: mapped })
      } catch (error) {
        console.error("Error loading listing gallery blobs:", error)
      }
    }

    fetchBlobGallery()
  }, [listingId])

  const blobGalleryImages = useMemo(
    () => (blobGalleryResult.listingId === listingId ? blobGalleryResult.items : []),
    [blobGalleryResult, listingId],
  )
  const effectiveGalleryImages = useMemo(() => {
    const merged = [...listingGalleryImages, ...blobGalleryImages]
    const seen = new Set()

    return merged.filter((item) => {
      const key = String(item?.sourceURL || item?.original || "").trim().toLowerCase()
      if (!key) return false
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [listingGalleryImages, blobGalleryImages])
  const hasRealGalleryMedia = effectiveGalleryImages.length > 0

  const listingForCard = {
    ...listing,
    panelSize: "half",
    images: listingGalleryImages,
    path: listing?.path || "",
    artist: {
      ...(listing?.artist || {}),
      path: listing?.artist?.path || slug || "",
      title: listing?.artist?.title || listing?.artistTitle || "Artist",
      profilePic: listing?.artist?.profilePic || {},
    },
  }

  // Sample comments for the listing
  const sampleComments = [
    {
      id: 1,
      body: "<p>I love how this piece captures the essence of the subject. The use of light and shadow is masterful!</p>",
      authorId: "user1",
      author: "ArtCollector",
      authorDisplayName: "Art Collector",
      avatarUrl: "https://i.pravatar.cc/100?img=11",
      likes: 8,
      created: "2023-12-02T14:30:00Z",
      replies: [],
    },
    {
      id: 2,
      body: "<p>This would be a perfect centerpiece for our upcoming exhibition on contemporary expressions.</p>",
      authorId: "user2",
      author: "GalleryOwner",
      authorDisplayName: "Gallery Owner",
      avatarUrl: "https://i.pravatar.cc/100?img=12",
      likes: 5,
      created: "2023-11-28T09:45:00Z",
      replies: [
        {
          id: 21,
          body: "<p>Thank you for your interest! I'd be honored to have it featured in your exhibition. Let's discuss the details.</p>",
          authorId: "user3",
          author: "ArtistInStudio",
          authorDisplayName: "Artist In Studio",
          avatarUrl: "https://i.pravatar.cc/100?img=18",
          likes: 3,
          created: "2023-11-29T15:20:00Z",
        },
      ],
    },
    {
      id: 3,
      body: "<p>The technique here reminds me of early 20th century movements, but with a modern twist. Beautiful execution!</p>",
      authorId: "user4",
      author: "ArtHistory101",
      authorDisplayName: "Art History Professor",
      avatarUrl: "https://i.pravatar.cc/100?img=13",
      likes: 12,
      created: "2023-11-25T11:15:00Z",
      replies: [],
    },
    {
      id: 4,
      body: "<p>The composition is stunning. I'd love to know more about the inspiration behind this work.</p>",
      authorId: "user5",
      author: "DesignEnthusiast",
      authorDisplayName: "Design Enthusiast",
      avatarUrl: "https://i.pravatar.cc/100?img=14",
      likes: 4,
      created: "2023-11-20T16:40:00Z",
      replies: [
        {
          id: 41,
          body: "<p>I was thinking the same thing! The balance of elements is really striking - would make a great case study for our design students.</p>",
          authorId: "user6",
          author: "CreativeDirector",
          authorDisplayName: "Creative Director",
          avatarUrl: "https://i.pravatar.cc/100?img=19",
          likes: 2,
          created: "2023-11-21T10:05:00Z",
        },
        {
          id: 42,
          body: "<p>The artist mentioned in an interview that the coastal landscapes of their childhood were a major influence on this series.</p>",
          authorId: "user7",
          author: "ArtisticVision",
          authorDisplayName: "Art Curator",
          avatarUrl: "https://i.pravatar.cc/100?img=20",
          likes: 5,
          created: "2023-11-22T13:25:00Z",
        },
      ],
    },
  ]

  // Current user mock data for SocialComments component
  const currentUser = {
    id: "currentUser1",
    username: "currentUser",
    displayName: "Current User",
    avatarUrl: "https://i.pravatar.cc/100?img=7",
    isAdmin: false,
  }

  // Callback functions for SocialComments component
  const handleAddComment = (newComment, parentId = null) => {
    console.log("New comment added:", newComment, "Parent ID:", parentId)
    // In a real implementation, this would send data to the backend
  }

  const handleUpdateComment = (updatedComment, parentId = null) => {
    console.log("Comment updated:", updatedComment, "Parent ID:", parentId)
    // In a real implementation, this would update data on the backend
  }

  const handleLikeComment = (comment, parentId = null) => {
    console.log("Comment liked:", comment, "Parent ID:", parentId)
    // In a real implementation, this would update like count on the backend
  }

  return (
    <SocialRealtimeProvider>
      <div className="container mx-auto px-4 py-6 bg-base-200 text-base-content">
        <TagSEO metadataProp={pageMetaData} canonicalSlug={canonicalSlug} />
        <div className="mb-8">
          <div className="card bg-base-100 text-base-content border border-base-300 shadow-lg p-4 rounded-box">
            <div className="space-y-4">
              <h2 className="text-xl font-bold border-b pb-2 text-primary">Listing Gallery</h2>
              {hasRealGalleryMedia ? (
                <PhotoGallery
                  images={effectiveGalleryImages}
                  mode="standalone"
                  navigationMode="manual"
                  imageEffect="landscape"
                  showThumbnails={effectiveGalleryImages.length > 1}
                  showContentWarnings={false}
                />
              ) : (
                <div className="rounded-box border border-base-300 bg-base-200 p-4 text-sm text-base-content/70">
                  No gallery media is available for this listing yet.
                </div>
              )}
            </div>

            <ListingCard listing={listingForCard} panelSize="full" showGalleryThumbnails hideGallery />

          <div className="overflow-x-auto mt-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 text-primary">Artwork Details</h2>
            <table className="table w-full border border-base-300 bg-base-100 text-base-content">
              <tbody>
                <tr className="hover:bg-base-200">
                  <th className="bg-base-100 text-base-content font-medium">Category</th>
                  <td className="bg-base-100 text-base-content">{listing?.artCategory?.category || "N/A"}</td>
                  <th className="bg-base-100 text-base-content font-medium">Commission Inquiry</th>
                  <td className="bg-base-100 text-base-content">{listing.commissionInquiryWelcome ? "Yes" : "No"}</td>
                </tr>
                <tr className="hover:bg-base-200">
                  <th className="bg-base-100 text-base-content font-medium">Price</th>
                  <td className="bg-base-100 text-base-content">
                    {listing.price !== null ? `$${listing.price}` : "N/A"}
                  </td>
                  <th className="bg-base-100 text-base-content font-medium">Created</th>
                  <td className="bg-base-100 text-base-content">
                    {listing.created ? new Date(listing.created).toLocaleDateString("en-US") : "N/A"}
                  </td>
                </tr>
                <tr className="hover:bg-base-200">
                  <th className="bg-base-100 text-base-content font-medium">Credits</th>
                  <td className="bg-base-100 text-base-content">{listing.credits || "N/A"}</td>
                  <th className="bg-base-100 text-base-content font-medium">Culture</th>
                  <td className="bg-base-100 text-base-content">{listing.culture || "N/A"}</td>
                </tr>
                <tr className="hover:bg-base-200">
                  <th className="bg-base-100 text-base-content font-medium">Medium</th>
                  <td className="bg-base-100 text-base-content">{listing.medium || "N/A"}</td>
                  <th className="bg-base-100 text-base-content font-medium">Locale</th>
                  <td className="bg-base-100 text-base-content">{listing.locale || "N/A"}</td>
                </tr>
                <tr className="hover:bg-base-200">
                  <th className="bg-base-100 text-base-content font-medium">Date</th>
                  <td className="bg-base-100 text-base-content">{listing.date || "N/A"}</td>
                  <th className="bg-base-100 text-base-content font-medium">Department</th>
                  <td className="bg-base-100 text-base-content">{listing.department || "N/A"}</td>
                </tr>
                <tr className="hover:bg-base-200">
                  <th className="bg-base-100 text-base-content font-medium">Locus</th>
                  <td className="bg-base-100 text-base-content">{listing.locus || "N/A"}</td>
                  <th className="bg-base-100 text-base-content font-medium">Period</th>
                  <td className="bg-base-100 text-base-content">{listing.period || "N/A"}</td>
                </tr>
                <tr className="hover:bg-base-200">
                  <th className="bg-base-100 text-base-content font-medium">Repository</th>
                  <td className="bg-base-100 text-base-content">{listing.repository || "N/A"}</td>
                  <th className="bg-base-100 text-base-content font-medium">Rights</th>
                  <td className="bg-base-100 text-base-content">{listing.rights || "N/A"}</td>
                </tr>
                <tr className="hover:bg-base-200">
                  <th className="bg-base-100 text-base-content font-medium">Tax Jurisdiction</th>
                  <td className="bg-base-100 text-base-content">{listing.taxJurisdiction || "N/A"}</td>
                  <th className="bg-base-100 text-base-content font-medium">Work Dates</th>
                  <td className="bg-base-100 text-base-content">
                    {listing.work_BeginDate || "N/A"} - {listing.work_CompletionDate || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Comments Section - REPLACED WITH SocialComments COMPONENT */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 text-primary">Comments & Feedback</h2>
            <SocialComments
              initialComments={sampleComments}
              onAddComment={handleAddComment}
              onUpdateComment={handleUpdateComment}
              onLikeComment={handleLikeComment}
              contextId={`listing-${listing.listingID}`}
              currentUser={currentUser}
              allowMedia={true}
              readOnly={!canAddComment}
              className="bg-base-100 text-base-content"
            />
          </div>
        </div>
      </div>
    </div>
    </SocialRealtimeProvider>
  )
}

ListingDetails.getInitialProps = async (context) => {
  const { slug, L_slug } = context.query
  const api_url = getApiURL()
  let data = {}

  try {
    // Use the new endpoint that considers artist slug and listing slug together
    const res = await fetch(`${api_url}listing/artist/${slug}/listing/${L_slug}`)

    if (!res.ok) {
      console.error(`Error fetching listing details: ${res.status} ${res.statusText}`)
      return { listing: {} } // Return empty object on failure
    }

    data = normalizeListingPayload(await res.json())

    const listingId = data?.listingID || data?.ListingID || data?.listingid || data?.listingId || data?.ListingId || null
    const numericFromSlug = Number(L_slug)
    const fallbackListingId = Number.isInteger(numericFromSlug) && numericFromSlug > 0 ? numericFromSlug : null
    const resolvedListingId = listingId || fallbackListingId

    if (resolvedListingId) {
      const byIdRes = await fetch(`${api_url}listing/byID/${resolvedListingId}`)
      if (byIdRes.ok) {
        const byIdData = normalizeListingPayload(await byIdRes.json())
        data = {
          ...data,
          ...byIdData,
          artist: {
            ...(data?.artist || {}),
            ...(byIdData?.artist || {}),
          },
          gallery: byIdData?.gallery || data?.gallery || null,
          relatedGallery: byIdData?.relatedGallery || data?.relatedGallery || null,
        }
      }
    }
  } catch (error) {
    console.error("Error fetching listing details:", error)
  }

  return { listing: data, slug, L_slug }
}

export default ListingDetails
