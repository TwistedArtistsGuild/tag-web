/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client" // This component now uses client-side state

import Link from "next/link"
import Image from "next/image"
import { HeartIcon, ThumbsUpIcon, UsersIcon, MessageCircleIcon, SmileIcon } from "lucide-react"
import { useState } from "react"

const getSeededCount = (seed, max, min = 1, salt = "") => {
  const base = `${seed || "artist"}-${salt}`
  const hash = base.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return (hash % max) + min
}

/**
 * Card component for displaying artist information in landscape orientation
 * @param {Object} props - Component properties
 * @param {Object} props.artist - Artist data object with profilePic object and social counters
 * @returns {JSX.Element} - Artist card component
 */
const ArtistCardSmall = ({ artist }) => {
  const artistSeed = artist?.artistid || artist?.path || artist?.title

  // Initialize state for each counter with values from props
  const [loves, setLoves] = useState(artist.loves)
  const [likes, setLikes] = useState(artist.likes)
  const [followers, setFollowers] = useState(artist.followers)
  const [showQuickReactions, setShowQuickReactions] = useState(false)
  const [reactionCounts, setReactionCounts] = useState({
    '❤️': artist.reactions?.heart ?? getSeededCount(artistSeed, 50, 1, "heart"),
    '👏': artist.reactions?.clap ?? getSeededCount(artistSeed, 30, 1, "clap"),
    '🎨': artist.reactions?.art ?? getSeededCount(artistSeed, 25, 1, "art"),
    '🔥': artist.reactions?.fire ?? getSeededCount(artistSeed, 20, 1, "fire"),
  })

  // Function to handle quick reactions
  const handleQuickReaction = (emoji) => {
    setReactionCounts(prev => ({
      ...prev,
      [emoji]: prev[emoji] + 1
    }))
    console.log(`Quick reaction ${emoji} added to artist ${artist.artistid}`)
  }

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
    <div 
      className="card lg:card-side bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out w-full max-w-2xl border border-base-300 rounded-box group"
      onMouseEnter={() => setShowQuickReactions(true)}
      onMouseLeave={() => setShowQuickReactions(false)}
    >
      {/* Wrap the main content (excluding social icons) with Link */}
      <Link href={`/artists/${artist.path}`} passHref className="flex flex-grow cursor-pointer relative">
        <figure className="p-1 flex-shrink-0 relative">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-base-300">
            <Image
              src={artist?.profilePic?.url || "/blank_image.png"}
              alt={artist?.profilePic?.alttext || `${artist?.title}'s profile picture`}
              layout="fill"
              style={{ objectFit: "cover" }}
              className="rounded-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </figure>
        <div className="card-body p-4 flex-grow justify-center">
          <h2 className="card-title text-lg font-semibold text-primary">{artist.title}</h2>
          <p className="text-sm text-base-content/60">{artist.byline}</p>
        </div>
      </Link>
    </div>
  )
}

export default ArtistCardSmall
