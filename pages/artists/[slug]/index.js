/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

//Imports
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import TagSEO from "@/components/TagSEO"
import CardFactory from "@/components/cards/CardFactory"
import longDateOptions from "/utils/longdateoptions"
import { useAppContext } from "/components/Context"
import ImageGallery from "react-image-gallery" // Keep this for the main gallery
import "react-image-gallery/styles/css/image-gallery.css" // Import gallery styles
import {
  HeartIcon,
  ThumbsUpIcon,
  UsersIcon,
  MailIcon,
  CalendarIcon,
  MapPinIcon,
  SearchIcon,
  ReplyIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  PinIcon as PinterestIcon,
} from "lucide-react" // Import Lucide icons

/**
 * @desc Displays an individual artist's details by the shortname, passed by POST
 * @param {object} props - Component props containing artist data and related information
 * @returns {JSX.Element} - Individual artist page
 */
const Artist = (props) => {
  const options = longDateOptions
  const { setPageSections } = useAppContext() // Get access to context to set sections

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState("")

  // State for social counters (if not coming from props or to allow local interaction)
  const [loves, setLoves] = useState(props.artist?.loves || 0)
  const [likes, setLikes] = useState(props.artist?.likes || 0)
  const [followers, setFollowers] = useState(props.artist?.followers || 0)

  // State for comment form
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentText, setCommentText] = useState("")

  // Navigation sections for quick jump
  const sections = [
    { id: "profile", label: "Profile" },
    { id: "artwork", label: "Featured Artwork" },
    { id: "events", label: "Events & Exhibitions" },
    { id: "listings", label: "Art Listings" },
    { id: "comments", label: "Comments & Feedback" },
  ]

  // Set page sections in context when component mounts
  useEffect(() => {
    setPageSections(sections)

    // Clean up when component unmounts
    return () => {
      setPageSections([])
    }
  }, [setPageSections])

  const pageMetaData = {
    title: `TAG Artist Member - ${props.artist?.title || "Unknown Artist"}`,
    description: props.artist?.byline || "Artist details unavailable.",
    keywords: props.artist?.seoTags || "",
    robots: "index, follow",
    author: props.artist?.title || "Unknown",
    viewport: "width=device-width, initial-scale=1.0",
    og: {
      title: props.artist?.title || "Unknown Artist",
      description: props.artist?.byline || "Artist details unavailable.",
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
  const sampleComments = [
    {
      id: 1,
      author: "ArtEnthusiast42",
      avatar: "https://i.pravatar.cc/100?img=1",
      date: "2023-11-15",
      content:
        "Your use of color in the landscape series is absolutely breathtaking! I'd love to see your work in person someday.",
      likes: 7,
      replies: [],
    },
    {
      id: 2,
      author: "GalleryOwner",
      avatar: "https://i.pravatar.cc/100?img=2",
      date: "2023-11-10",
      content:
        "We featured your work in our downtown exhibition last month and received incredible feedback. Looking forward to collaborating again!",
      likes: 12,
      replies: [
        {
          id: 21,
          author: "ArtistInResidence",
          avatar: "https://i.pravatar.cc/100?img=8",
          date: "2023-11-11",
          content: "Thank you for the opportunity! It was an honor to be featured alongside such talented artists.",
          likes: 3,
        },
      ],
    },
    {
      id: 3,
      author: "ArtStudent22",
      avatar: "https://i.pravatar.cc/100?img=3",
      date: "2023-11-05",
      content:
        "Your technique is inspiring! I've been studying your brush work and it's helping me develop my own style. Thank you for sharing your journey!",
      likes: 5,
      replies: [
        {
          id: 31,
          author: "MasterPainter",
          avatar: "https://i.pravatar.cc/100?img=9",
          date: "2023-11-06",
          content: "As a fellow artist, I agree completely. The texture work is particularly noteworthy!",
          likes: 2,
        },
      ],
    },
    {
      id: 4,
      author: "LocalCollector",
      avatar: "https://i.pravatar.cc/100?img=4",
      date: "2023-10-28",
      content:
        "I purchased one of your pieces last year and it's still my favorite item in my collection. The way it captures light is magical.",
      likes: 9,
      replies: [],
    },
    {
      id: 5,
      author: "CreativeMind",
      avatar: "https://i.pravatar.cc/100?img=5",
      date: "2023-10-20",
      content:
        "The evolution of your style over the years has been fascinating to watch. Each new series brings something fresh while maintaining your unique perspective.",
      likes: 14,
      replies: [],
    },
  ]

  // Handle social icon clicks (similar to ArtistCard)
  const handleSocialClick = async (type) => {
    // Optimistically update UI
    if (type === "loves") setLoves((prev) => prev + 1)
    if (type === "likes") setLikes((prev) => prev + 1)
    if (type === "followers") setFollowers((prev) => prev + 1)

    // Send update to your API route
    try {
      const res = await fetch(`/api/artist/${props.artist.artistid}/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        // If API call fails, revert the UI update (optional, but good practice)
        if (type === "loves") setLoves((prev) => prev - 1)
        if (type === "likes") setLikes((prev) => prev - 1)
        if (type === "followers") setFollowers((prev) => prev - 1)
        console.error(`Failed to update ${type} for artist ${props.artist.artistid}`)
      }
    } catch (error) {
      console.error("Error sending social update:", error)
      // Revert UI update on network error
      if (type === "loves") setLoves((prev) => prev - 1)
      if (type === "likes") setLikes((prev) => prev - 1)
      if (type === "followers") setFollowers((prev) => prev - 1)
    }
  }

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (commentText.trim()) {
      alert("Comment feature coming soon! Your comment would be: " + commentText)
      setCommentText("")
      setShowCommentForm(false)
    }
  }

  const listings = props.listings || []
  const links = props.links || []

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
  const socialLinks = [
    { icon: "facebook", url: "#", label: "Facebook" },
    { icon: "instagram", url: "#", label: "Instagram" },
    { icon: "twitter", url: "#", label: "Twitter" },
    { icon: "pinterest", url: "#", label: "Pinterest" },
  ]

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Handle contact button click
  const handleContactClick = () => {
    alert("Contact functionality coming soon!")
  }

  useEffect(() => {
    if (!props.artist) {
      console.warn("Artist data failed to load.")
    }
  }, [props.artist])

  // Scroll to section function
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="mx-auto p-4 relative max-w-6xl bg-gray-100 text-base-content">
      <TagSEO metadataProp={pageMetaData} canonicalSlug={`artists/${props.slug}`} />

      {/* Cover Picture */}
      <div className="relative w-full h-60 md:h-96 overflow-hidden rounded-lg shadow-lg">
        <Image
          src={props.coverPic?.url || "/blank_image.png"}
          alt={props.coverPic?.altText || "Cover Picture"}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Loading Message */}
      {!props.artist && <p className="text-center text-gray-500 mt-4">Loading artist details... Please wait.</p>}

      {/* Artist Details */}
      {props.artist && (
        <>
          <div id="profile" className="card lg:card-side bg-base-100 shadow-xl mt-8">
            <figure className="p-4 flex-shrink-0">
              <div className="relative w-64 h-64 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
                {" "}
                {/* Larger profile pic container */}
                <Image
                  src={props.profilePic?.url || "/blank_image.png"}
                  alt={`Profile picture of ${props.artist.title}`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-xl"
                />
              </div>
            </figure>
            <div className="card-body p-6 flex-grow">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h1 className="card-title text-3xl font-bold text-primary mb-1">
                    {props.artist.title || "Unknown Artist"}
                  </h1>
                  <p className="text-xl italic text-secondary mb-2">
                    {props.artist.byline || "Artist at Twisted Artists Guild"}
                  </p>
                  <div className="badge badge-accent mt-2">TAG Member</div>
                  <div className="mt-4">
                    <p className="text-lg">
                      <span className="font-semibold">Artist Since:</span>{" "}
                      {new Date(props.artist.applied).toLocaleDateString("en-US", options)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-2 lg:mt-0">
                  <button onClick={handleContactClick} className="btn btn-primary">
                    <MailIcon className="w-6 h-6 mr-1" />
                    Contact Me
                  </button>
                  <div className="flex gap-2 justify-end">
                    {socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-sm btn-outline"
                        aria-label={link.label}
                      >
                        {/* Using Lucide React icons directly */}
                        {link.icon === "facebook" && <FacebookIcon className="w-5 h-5" />}
                        {link.icon === "instagram" && <InstagramIcon className="w-5 h-5" />}
                        {link.icon === "twitter" && <TwitterIcon className="w-5 h-5" />}
                        {link.icon === "pinterest" && <PinterestIcon className="w-5 h-5" />}
                        {/* Fallback for other icons if any */}
                        {!["facebook", "instagram", "twitter", "pinterest"].includes(link.icon) &&
                          link.icon.charAt(0).toUpperCase()}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div
                  className="flex items-center gap-1 text-error cursor-pointer"
                  onClick={() => handleSocialClick("loves")}
                >
                  <HeartIcon className="w-5 h-5" />
                  <span className="ml-1">{loves} Loves</span>
                </div>
                <div
                  className="flex items-center gap-1 text-info cursor-pointer"
                  onClick={() => handleSocialClick("likes")}
                >
                  <ThumbsUpIcon className="w-5 h-5" />
                  <span className="ml-1">{likes} Likes</span>
                </div>
                <div
                  className="flex items-center gap-1 text-success cursor-pointer"
                  onClick={() => handleSocialClick("followers")}
                >
                  <UsersIcon className="w-5 h-5" />
                  <span className="ml-1">{followers} Followers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Artist Statement Section */}
          <div id="statement" className="mt-12 prose max-w-none bg-base-100 p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">Artist Statement</h2>
            <div dangerouslySetInnerHTML={{ __html: props.artist.statement || "No statement available." }} />
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
                        <img
                          src={item.original || "/placeholder.svg"}
                          alt={item.description}
                          style={{ objectFit: "contain", maxHeight: "500px", margin: "0 auto" }}
                        />
                        {item.description && <div className="image-gallery-description">{item.description}</div>}
                      </div>
                    )}
                    renderThumbInner={(item) => (
                      <div className="image-gallery-thumbnail-inner">
                        <img
                          src={item.thumbnail || "/placeholder.svg"}
                          alt={item.description}
                          className="image-gallery-thumbnail-image"
                          style={{ objectFit: "cover", height: "80px" }}
                        />
                        <div className="image-gallery-thumbnail-label">{item.title}</div>
                      </div>
                    )}
                  />
                </div>
              ) : (
                <div className="text-center text-gray-500 p-4">
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
                      <div className="flex items-center text-sm mb-1 text-gray-600">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center text-sm mb-3 text-gray-600">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {event.location}
                      </div>
                      <p className="text-sm text-gray-700">{event.description}</p>
                      <div className="card-actions justify-end mt-2">
                        <button className="btn btn-sm btn-outline btn-primary">Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming events for this artist.</p>
            )}
          </div>

          {/* Listings Section */}
          <div id="listings" className="mt-12">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">Art Listings</h2>
            {listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <CardFactory 
                    key={listing.listingID || listing.PictureID}
                    type="listing" 
                    variant="medium" 
                    data={{
                      ...listing,
                      // Ensure we have artist data for the embedded artist card
                      artist: listing.artist || {
                        ArtistID: props.artist?.artistid,
                        Title: props.artist?.title,
                        Path: props.slug,
                        ProfilePicID: props.profilePic?.picturenum,
                        Byline: props.artist?.byline
                      }
                    }}
                    showInteractions={true}
                    orientation="vertical"
                    className="w-full"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No listings available for this artist yet.</p>
                <p className="text-sm text-gray-400">Check back soon for new artwork!</p>
              </div>
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
                <span className="text-sm font-medium mr-2 text-gray-700">Quick Filters:</span>
                <button className="btn btn-sm btn-outline">Paintings</button>
                <button className="btn btn-sm btn-outline">Digital Art</button>
                <button className="btn btn-sm btn-outline">Sculptures</button>
                <button className="btn btn-sm btn-outline">Photography</button>
                <button className="btn btn-sm btn-outline">Recent Works</button>
              </div>
              <div className="bg-base-200 p-4 rounded-lg text-center text-gray-700">
                <p>Enter search terms above to find works by this artist</p>
                <p className="text-sm text-gray-500 mt-1">Advanced search options coming soon!</p>
              </div>
            </div>
          </div>

          {/* Comments & Feedback Section */}
          <div id="comments" className="mt-12 mb-8">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">Comments & Feedback</h2>
            <div className="card bg-base-100 shadow-lg p-6">
              {/* Comments Section */}
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-primary">Recent Comments ({sampleComments.length})</h3>
                  <button onClick={() => setShowCommentForm(!showCommentForm)} className="btn btn-primary btn-sm">
                    {showCommentForm ? "Cancel" : "Add Comment"}
                  </button>
                </div>

                {/* Comment Form */}
                {showCommentForm && (
                  <form onSubmit={handleCommentSubmit} className="card bg-base-200 p-4 mb-6">
                    <div className="form-control mb-3">
                      <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Share your thoughts about this artist's work..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows="3"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="btn btn-primary">
                        Submit Comment
                      </button>
                    </div>
                  </form>
                )}

                {/* Comment List */}
                {sampleComments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex gap-4">
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img src={comment.avatar || "/placeholder.svg"} alt={`${comment.author}'s avatar`} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-primary">{comment.author}</h3>
                          <span className="text-sm text-gray-500">{comment.date}</span>
                        </div>
                        <p className="mt-1 text-gray-800">{comment.content}</p>
                        <div className="mt-2 flex items-center gap-4">
                          <button className="text-sm flex items-center gap-1 text-gray-500 hover:text-primary">
                            <HeartIcon className="w-4 h-4" />
                            {comment.likes} likes
                          </button>
                          <button className="text-sm flex items-center gap-1 text-gray-500 hover:text-primary">
                            <ReplyIcon className="w-4 h-4" />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 space-y-4 pl-8 ml-12 border-l-2 border-gray-200">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-4">
                            <div className="avatar">
                              <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img src={reply.avatar || "/placeholder.svg"} alt={`${reply.author}'s avatar`} />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-primary">{reply.author}</h4>
                                <span className="text-sm text-gray-500">{reply.date}</span>
                              </div>
                              <p className="mt-1 text-gray-800">{reply.content}</p>
                              <div className="mt-2 flex items-center gap-4">
                                <button className="text-sm flex items-center gap-1 text-gray-500 hover:text-primary">
                                  <HeartIcon className="w-4 h-4" />
                                  {reply.likes} likes
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Update Link */}
          <div className="mt-8 text-center">
            <Link href={`/artists/${props.slug}/update`} className="btn btn-primary">
              Update this artist page
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

/**
 * Fetches artist data from the API during server-side rendering
 * @param {object} context - Next.js context object containing query parameters
 * @returns {object} - Props to be passed to the Artist component
 */
Artist.getInitialProps = async (context) => {
  const { slug } = context.query
  const api_url = process.env.NEXT_PUBLIC_TAG_API_URL
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
