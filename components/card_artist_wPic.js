/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client" // This component uses client-side state

import Link from "next/link"
import Image from "next/image"
import { HeartIcon, ThumbsUpIcon, UsersIcon } from "lucide-react"
import { useState } from "react"

/**
 * Card component for displaying artist information with a picture slideshow
 * @param {Object} props - Component properties
 * @param {Object} props.artist - Artist data object with profilePic, images array, and social counters
 * @returns {JSX.Element} - Artist card component with slideshow
 */
const ArtistCardWithPic = ({ artist }) => {
  const [loves, setLoves] = useState(artist.loves)
  const [likes, setLikes] = useState(artist.likes)
  const [followers, setFollowers] = useState(artist.followers)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Function to handle social icon clicks (same as ArtistCard)
  const handleSocialClick = async (type) => {
    if (type === "loves") setLoves((prev) => prev + 1)
    if (type === "likes") setLikes((prev) => prev + 1)
    if (type === "followers") setFollowers((prev) => prev + 1)

    try {
      const res = await fetch(`/api/artist/${artist.artistid}/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        if (type === "loves") setLoves((prev) => prev - 1)
        if (type === "likes") setLikes((prev) => prev - 1)
        if (type === "followers") setFollowers((prev) => prev - 1)
        console.error(`Failed to update ${type} for artist ${artist.artistid}`)
      }
    } catch (error) {
      console.error("Error sending social update:", error)
      if (type === "loves") setLoves((prev) => prev - 1)
      if (type === "likes") setLikes((prev) => prev - 1)
      if (type === "followers") setFollowers((prev) => prev - 1)
    }
  }

  // Handle image navigation for slideshow
  const goToNextImage = (e) => {
    e.preventDefault() // Prevent link click
    setCurrentImageIndex((prevIndex) => (prevIndex === artist.images.length - 1 ? 0 : prevIndex + 1))
  }

  const goToPrevImage = (e) => {
    e.preventDefault() // Prevent link click
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? artist.images.length - 1 : prevIndex - 1))
  }

  return (
    <div className="card lg:card-side bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out w-full max-w-2xl border border-base-300">
      {/* Main content area, excluding social icons */}
      <Link href={`/artists/${artist.path}`} passHref className="flex flex-grow cursor-pointer">
        {/* Image Slideshow Section */}
        <figure className="p-4 flex-shrink-0 w-48 h-48 relative">
          <div className="carousel w-full h-full rounded-box overflow-hidden">
            {artist.images && artist.images.length > 0 ? (
              artist.images.map((image, index) => (
                <div
                  key={index}
                  id={`slide${index}`}
                  className={`carousel-item relative w-full h-full ${index === currentImageIndex ? "" : "hidden"}`}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt || `Artist image ${index + 1}`}
                    layout="fill"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                    <button onClick={goToPrevImage} className="btn btn-circle btn-sm">
                      ❮
                    </button>
                    <button onClick={goToNextImage} className="btn btn-circle btn-sm">
                      ❯
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="relative w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                <Image src="/blank_image.png" alt="No images available" layout="fill" objectFit="contain" />
              </div>
            )}
          </div>
        </figure>

        {/* Artist Details Section */}
        <div className="card-body p-4 flex-grow justify-center">
          <h2 className="card-title text-lg font-semibold">{artist.title}</h2>
          <p className="text-sm text-gray-500">{artist.byline}</p>
        </div>
      </Link>

      {/* Social icons with numbers, vertically stacked on the right, matching image */}
      <div className="flex flex-col items-center justify-center p-4 bg-base-200 rounded-r-box gap-2">
        <div className="flex flex-col items-center cursor-pointer" onClick={() => handleSocialClick("loves")}>
          <HeartIcon className="w-6 h-6 text-error" />
          <span className="font-bold text-sm text-error">{loves}</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer" onClick={() => handleSocialClick("likes")}>
          <ThumbsUpIcon className="w-6 h-6 text-info" />
          <span className="font-bold text-sm text-info">{likes}</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer" onClick={() => handleSocialClick("followers")}>
          <UsersIcon className="w-6 h-6 text-success" />
          <span className="font-bold text-sm text-success">{followers}</span>
        </div>
      </div>
    </div>
  )
}

export default ArtistCardWithPic

