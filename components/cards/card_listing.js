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

const ListingCard = ({ listing }) => {
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
      <figure className="relative h-48 w-full overflow-hidden">
        <Link href={`/artists/${listing?.artist?.path}/listings/${listing?.path}`}>
          <Image
            src={listing?.profilePic?.url || "/blank_image.png"}
            alt={listing?.profilePic?.alttext || `${listing?.title || "Unknown"}'s picture`}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-t-box group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Quick Reactions Overlay */}
        {showQuickReactions && (
          <div className="absolute top-2 right-2 flex gap-1 bg-base-100/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            {Object.entries(reactionCounts).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={(e) => {
                  e.preventDefault()
                  handleQuickReaction(emoji)
                }}
                className="hover:scale-125 transition-transform duration-200 text-lg"
                title={`${count} reactions`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </figure>
      <div className="card-body p-6">
        <Link
          href={`/artists/${listing?.artist?.path}/listings/${listing?.path}`}
          className="card-title text-2xl text-primary hover:underline"
        >
          {listing?.title || "Untitled"}
        </Link>
        <p className="text-lg text-neutral-content line-clamp-3">
          {listing?.description || "No description available"}
        </p>
        <p className="text-sm text-neutral-content mt-2">
          Listing created:{" "}
          {listing?.created ? new Date(listing.created).toLocaleDateString("en-US") : "No date available"}
        </p>
        <p className="text-sm text-neutral-content">Artist: {listing?.artist?.title || "No artist found"}</p>
        <p className="text-sm text-neutral-content">
          Category: {listing?.artCategory?.category || "No category found"}
        </p>

        {/* Enhanced Social Section */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-base-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-error cursor-pointer hover:text-error/80 transition-colors" onClick={() => handleSocialClick("loves")}>
              <HeartIcon className="w-5 h-5" />
              <span className="ml-1">{loves}</span>
            </div>
            <div className="flex items-center gap-1 text-info cursor-pointer hover:text-info/80 transition-colors" onClick={() => handleSocialClick("likes")}>
              <ThumbsUpIcon className="w-5 h-5" />
              <span className="ml-1">{likes}</span>
            </div>
            <div className="flex items-center gap-1 text-success cursor-pointer hover:text-success/80 transition-colors" onClick={() => handleSocialClick("followers")}>
              <UsersIcon className="w-5 h-5" />
              <span className="ml-1">{followers}</span>
            </div>
          </div>
          
          {/* Reaction Preview */}
          <div className="flex items-center gap-1">
            <SmileIcon className="w-4 h-4 text-base-content/60" />
            <span className="text-sm text-base-content/60">
              {Object.values(reactionCounts).reduce((a, b) => a + b, 0)} reactions
            </span>
            <MessageCircleIcon className="w-4 h-4 text-base-content/60 ml-2" />
            <span className="text-sm text-base-content/60">
              {Math.floor(Math.random() * 15) + 1} comments
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListingCard
