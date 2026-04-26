/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client" // This component now uses client-side state

import Link from "next/link"
import Image from "next/image"

const ListingCardSmall = ({ listing }) => {
  return (
    <div 
      className="card bg-base-100 text-base-content shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out w-full rounded-box group border border-base-300"
    >
      <figure className="relative h-32 w-full overflow-hidden">
        <Link href={`/artists/${listing?.artist?.path}/listings/${listing?.path}`} className="relative block h-full w-full">
          <Image
            src={listing?.profilePic?.url || "/blank_image.png"}
            alt={listing?.profilePic?.alttext || `${listing?.title || "Unknown"}'s picture`}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
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
        <p className="text-lg text-base-content/90 line-clamp-3">
          {listing?.description || "No description available"}
        </p>
        <p className="text-xs text-base-content/80 mt-2">
          Listing created:{" "}
          {listing?.created ? new Date(listing.created).toLocaleDateString("en-US") : "No date available"}
        </p>
        <p className="text-xs text-base-content/80">Artist: {listing?.artist?.title || "No artist found"}</p>
        <p className="text-xs text-base-content/80">
          Category: {listing?.artCategory?.category || "No category found"}
        </p>       
      </div>
    </div>
  )
}

export default ListingCardSmall
