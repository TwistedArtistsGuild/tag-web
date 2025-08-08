/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client" // This component now uses client-side state

import Link from "next/link"
import Image from "next/image"
import { HeartIcon, ThumbsUpIcon, UsersIcon } from "lucide-react"
import { useState } from "react" // Import useState

/**
 * Card component for displaying artist information in landscape orientation
 * @param {Object} props - Component properties
 * @param {Object} props.artist - Artist data object with profilePic object and social counters
 * @returns {JSX.Element} - Artist card component
 */
const ArtistCard = ({ artist }) => {
  // Initialize state for each counter with values from props
  const [loves, setLoves] = useState(artist.loves)
  const [likes, setLikes] = useState(artist.likes)
  const [followers, setFollowers] = useState(artist.followers)

  // Function to handle social icon clicks
  const handleSocialClick = async (type) => {
    // Optimistically update UI
    if (type === "loves") setLoves((prev) => prev + 1)
    if (type === "likes") setLikes((prev) => prev + 1)
    if (type === "followers") setFollowers((prev) => prev + 1)

    // Send update to your API route
    try {
      const res = await fetch(`/api/artist/${artist.artistid}/${type}`, {
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
        console.error(`Failed to update ${type} for artist ${artist.artistid}`)
      }
    } catch (error) {
      console.error("Error sending social update:", error)
      // Revert UI update on network error
      if (type === "loves") setLoves((prev) => prev - 1)
      if (type === "likes") setLikes((prev) => prev - 1)
      if (type === "followers") setFollowers((prev) => prev - 1)
    }
  }

  return (
    <div className="card lg:card-side bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out w-full max-w-2xl border border-base-300 rounded-box">
      {/* Wrap the main content (excluding social icons) with Link */}
      <Link href={`/artists/${artist.path}`} passHref className="flex flex-grow cursor-pointer">
        <figure className="p-4 flex-shrink-0">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-base-300">
            <Image
              src={artist?.profilePic?.url || "/blank_image.png"}
              alt={artist?.profilePic?.alttext || `${artist?.title}'s profile picture`}
              layout="fill"
              style={{ objectFit: "cover" }}
              className="rounded-full"
            />
          </div>
        </figure>
        <div className="card-body p-4 flex-grow justify-center">
          <h2 className="card-title text-lg font-semibold text-primary">{artist.title}</h2>
          <p className="text-sm text-base-content/60">{artist.byline}</p>
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

export default ArtistCard
