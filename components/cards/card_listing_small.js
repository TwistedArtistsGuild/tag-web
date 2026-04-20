/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client" // This component now uses client-side state

import Link from "next/link"
import Image from "next/image"
import { HeartIcon, ThumbsUpIcon, UsersIcon, MessageCircleIcon, SmileIcon } from "lucide-react" // Import Lucide icons
import { useState } from "react" // Import useState

const ListingCardSmall = ({ listing }) => {
  // Initialize state for each counter with values from props
  const [loves, setLoves] = useState(listing.loves || 0)
  const [likes, setLikes] = useState(listing.likes || 0)
  const [followers, setFollowers] = useState(listing.followers || 0)
  const [showQuickReactions, setShowQuickReactions] = useState(false)
  const [reactionCounts, setReactionCounts] = useState({
    '❤️': Math.floor(Math.random() * 20) + 1,
    '👏': Math.floor(Math.random() * 15) + 1,
    '🔥': Math.floor(Math.random() * 10) + 1,
    '😍': Math.floor(Math.random() * 8) + 1,
  })

  // Function to handle quick reactions
  const handleQuickReaction = (emoji) => {
    setReactionCounts(prev => ({
      ...prev,
      [emoji]: prev[emoji] + 1
    }))
    console.log(`Quick reaction ${emoji} added to listing ${listing.listingid}`)
  }

  // Function to handle social icon clicks
  const handleSocialClick = async (type) => {
    // Optimistically update UI
    if (type === "loves") setLoves((prev) => prev + 1)
    if (type === "likes") setLikes((prev) => prev + 1)
    if (type === "followers") setFollowers((prev) => prev + 1)

    // Simulate API call (replace with actual API endpoint)
    try {
      // In a real app, you'd send a request to your backend here
      // const res = await fetch(`/api/listing/${listing.listingid}/${type}`, { method: "POST" });
      // if (!res.ok) {
      //   throw new Error(`Failed to update ${type}`);
      // }
      console.log(`Simulating update for listing ${listing.listingid}: ${type} increased!`)
    } catch (error) {
      console.error("Error sending social update:", error)
      // Revert UI update on error
      if (type === "loves") setLoves((prev) => prev - 1)
      if (type === "likes") setLikes((prev) => prev - 1)
      if (type === "followers") setFollowers((prev) => prev - 1)
    }
  }

  return (
    <div 
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out w-full rounded-box group"
      onMouseEnter={() => setShowQuickReactions(true)}
      onMouseLeave={() => setShowQuickReactions(false)}
    >
      <figure className="relative h-32 w-full overflow-hidden">
        <Link href={`/artists/${listing?.artist?.path}/listings/${listing?.path}`}>
          <Image
            src={listing?.profilePic?.url || "/blank_image.png"}
            alt={listing?.profilePic?.alttext || `${listing?.title || "Unknown"}'s picture`}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-t-box group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </figure>
      <div className="card-body p-3">
        <Link
          href={`/artists/${listing?.artist?.path}/listings/${listing?.path}`}
          className="card-title text-xl text-primary hover:underline"
        >
          {listing?.title || "Untitled"}
        </Link>
        <p className="text-lg text-neutral-content line-clamp-3">
          {listing?.description || "No description available"}
        </p>
        <p className="text-xs text-neutral-content mt-2">
          Listing created:{" "}
          {listing?.created ? new Date(listing.created).toLocaleDateString("en-US") : "No date available"}
        </p>
        <p className="text-xs text-neutral-content">Artist: {listing?.artist?.title || "No artist found"}</p>
        <p className="text-xs text-neutral-content">
          Category: {listing?.artCategory?.category || "No category found"}
        </p>       
      </div>
    </div>
  )
}

export default ListingCardSmall
