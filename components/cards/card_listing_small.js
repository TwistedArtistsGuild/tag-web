/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client" // This component now uses client-side state

import Link from "next/link"
import Image from "next/image"
import ContentTags, { hasExplicitWarning, extractContentWarnings } from "@/components/social/ContentTags"

const ListingCardSmall = ({ listing }) => {
  const contentWarnings = extractContentWarnings(listing)
  const hideImage = hasExplicitWarning(contentWarnings)

  return (
    <div 
      className="card bg-base-100 text-base-content shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out w-full rounded-box group border border-base-300"
    >
      <figure className="relative h-32 w-full overflow-hidden">
        {contentWarnings.length > 0 && (
          <div className="absolute left-0 right-0 top-0 z-10">
            <ContentTags
              warnings={contentWarnings.slice(0, 2)}
              size="sm"
              showTitle={false}
              className="rounded-none border-0 bg-base-100/92 px-2 py-1"
            />
          </div>
        )}

        {hideImage ? (
          <div className="flex h-full w-full items-center justify-center bg-base-200 text-center">
            <div className="space-y-1 px-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-error">18+ Explicit</p>
              <p className="text-[10px] text-base-content/70">Preview hidden</p>
            </div>
          </div>
        ) : (
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
        )}
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
