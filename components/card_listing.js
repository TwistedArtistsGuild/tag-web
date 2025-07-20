/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client" // This component now uses client-side state

import Link from "next/link"
import Image from "next/image"
import { HeartIcon, ThumbsUpIcon, UsersIcon } from "lucide-react" // Import Lucide icons
import { useState } from "react" // Import useState

const ListingCard = ({ listing }) => {
  // Initialize state for each counter with values from props
  const [loves, setLoves] = useState(listing.loves || 0)
  const [likes, setLikes] = useState(listing.likes || 0)
  const [followers, setFollowers] = useState(listing.followers || 0)

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
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out w-full rounded-box">
      <figure className="relative h-48 w-full overflow-hidden">
        {" "}
        {/* Reduced height to h-48 */}
        <Link href={`/artists/${listing?.artist?.path}/listings/${listing?.path}`}>
          <Image
            src={listing?.profilePic?.url || "/blank_image.png"}
            alt={listing?.profilePic?.alttext || `${listing?.title || "Unknown"}'s picture`}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-t-box"
          />
        </Link>
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

        {/* Social icons with numbers */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-base-200">
          <div className="flex items-center gap-1 text-error cursor-pointer" onClick={() => handleSocialClick("loves")}>
            <HeartIcon className="w-5 h-5" />
            <span className="ml-1">{loves} Loves</span>
          </div>
          <div className="flex items-center gap-1 text-info cursor-pointer" onClick={() => handleSocialClick("likes")}>
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
  )
}

export default ListingCard
