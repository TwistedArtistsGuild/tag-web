/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import { useState, useEffect } from "react"
import ImageGallery from "react-image-gallery"
import "react-image-gallery/styles/css/image-gallery.css"
import SocialComments from "@/components/social/Comments" // Import SocialComments component
import Image from "next/image"

const ListingDetails = ({ listing }) => {
  // Sample images for the slideshow
  const sampleImages = [
    {
      original: listing?.profilePic?.url || "https://picsum.photos/id/1015/1000/600",
      thumbnail: listing?.profilePic?.url || "https://picsum.photos/id/1015/250/150",
      description: listing?.title || "Artwork image",
    },
    {
      original: "https://picsum.photos/id/1019/1000/600",
      thumbnail: "https://picsum.photos/id/1019/250/150",
      description: "Additional view",
    },
    {
      original: "https://picsum.photos/id/1018/1000/600",
      thumbnail: "https://picsum.photos/id/1018/250/150",
      description: "Detail view",
    },
    {
      original: "https://picsum.photos/id/1022/1000/600",
      thumbnail: "https://picsum.photos/id/1022/250/150",
      description: "Alternate angle",
    },
    {
      original: "https://picsum.photos/id/1025/1000/600",
      thumbnail: "https://picsum.photos/id/1025/250/150",
      description: "Close-up detail",
    },
  ]

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

  const [likeCount, setLikeCount] = useState(24)
  const [liked, setLiked] = useState(false)

  // Current user mock data for SocialComments component
  const currentUser = {
    id: "currentUser1",
    username: "currentUser",
    displayName: "Current User",
    avatarUrl: "https://i.pravatar.cc/100?img=7",
    isAdmin: false,
  }

  // Handle like button click
  const handleLikeClick = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
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

  // Load theme from localStorage
  const [theme, setTheme] = useState("tag-theme")
  useEffect(() => {
    // Check if we're in the browser environment before accessing localStorage
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "tag-theme"
      setTheme(savedTheme)
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-6 bg-base-200 text-base-content">
      <div className="mb-8">
        <div className="card shadow-lg p-4 bg-base-100 rounded-box">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold mb-4 text-primary">{listing.title || "Untitled"}</h1>

              {/* Action buttons */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={handleLikeClick}
                  className={`btn btn-sm ${liked ? "btn-primary" : "btn-outline"}`}
                  aria-label="Like this artwork"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={liked ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="ml-2">{likeCount} Likes</span>
                </button>
                <button className="btn btn-sm btn-outline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  <span className="ml-2">Share</span>
                </button>
              </div>

              <p className="text-lg mb-6">
                <strong>Description:</strong> {listing.description || "No description available"}
              </p>
            </div>
            <div className="md:w-1/2">
              {/* Image Gallery */}
              <div className="rounded-box overflow-hidden shadow-md" style={{ maxHeight: "600px" }}>
                <ImageGallery
                  items={sampleImages}
                  showPlayButton={true}
                  showFullscreenButton={true}
                  showThumbnails={true}
                  showBullets={true}
                  showNav={true}
                  thumbnailPosition="bottom"
                  useBrowserFullscreen={true}
                  slideInterval={5000}
                  lazyLoad={true}
                  renderItem={(item) => (
                    <div className="image-gallery-image bg-base-100">
                      <Image
                        src={item.original || "/placeholder.svg"}
                        alt={item.description}
                        width={1000}
                        height={600}
                        style={{ objectFit: "contain", maxHeight: "500px", margin: "0 auto" }}
                        priority={true}
                      />
                      {item.description && <div className="image-gallery-description text-base-content/80 bg-base-200 px-2 py-1 rounded mt-2">{item.description}</div>}
                    </div>
                  )}
                  renderThumbInner={(item) => (
                    <div className="image-gallery-thumbnail-inner bg-base-200">
                      <Image
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.description}
                        width={250}
                        height={150}
                        className="image-gallery-thumbnail-image"
                        style={{ objectFit: "cover", height: "80px" }}
                        priority={false}
                      />
                      <div className="image-gallery-thumbnail-label text-xs text-base-content/70">{item.title}</div>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

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
              readOnly={false}
              theme={theme}
              className="bg-base-100 text-base-content"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

ListingDetails.getInitialProps = async (context) => {
  const { slug, L_slug } = context.query
  const api_url = process.env.NEXT_PUBLIC_TAG_API_URL
  let data = {}

  try {
    // Use the new endpoint that considers artist slug and listing slug together
    const res = await fetch(`${api_url}listing/artist/${slug}/listing/${L_slug}`)

    if (!res.ok) {
      console.error(`Error fetching listing details: ${res.status} ${res.statusText}`)
      return { listing: {} } // Return empty object on failure
    }

    data = await res.json()
  } catch (error) {
    console.error("Error fetching listing details:", error)
  }

  return { listing: data }
}

export default ListingDetails
