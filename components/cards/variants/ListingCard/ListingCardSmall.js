/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from 'next/link';
import Image from 'next/image';
import CardSocial from '@/components/cards/shared/CardSocial';

/**
 * ListingCardSmall - Compact listing card for grid layouts
 * Includes embedded artist micro card
 */
const ListingCardSmall = ({ 
    listing, 
    showInteractions = true,
    className = ''
}) => {
    if (!listing) return null;

    // Extract listing data based on data dictionary
    const listingId = listing.PictureID || listing.listingId || listing.id;
    const title = listing.Title || listing.title;
    const description = listing.Description || listing.description;
    const imageUrl = listing.url || listing.imageUrl || listing.URL || listing.profilePic?.url || listing.picture?.url || `https://picsum.photos/seed/art-${listingId}/600/400`;
    const thumbnailUrl = listing.thumbnailUrl || listing.ThumbnailURL || imageUrl;
    const altText = listing.AltText || listing.altText || title;
    
    // Listing URL data
    const listingPath = listing.Path || listing.path;
    
    // Artist data - could be embedded or referenced
    const artistData = listing.artist || {
        ArtistID: listing.ArtistID,
        Title: listing.artistName,
        Path: listing.artistPath || listing.artistSlug,
        // Add other artist fields as needed
    };
    
    // Construct proper listing URL: /artists/[artistSlug]/listings/[listingSlug]
    const artistPath = artistData.Path || artistData.path;
    const listingUrl = (artistPath && listingPath) 
        ? `/artists/${artistPath}/listings/${listingPath}`
        : `/art/${listingId}`; // Fallback to old pattern if data is missing

    return (
        <div className={`card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300 ${className}`}>
            {/* Main artwork image */}
            <figure className="relative aspect-square overflow-hidden">
                <Link href={listingUrl}>
                    <Image
                        src={thumbnailUrl || imageUrl}
                        alt={altText}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </Link>
            </figure>

            <div className="card-body p-4">
                {/* Title */}
                {title && (
                    <Link href={listingUrl}>
                        <h3 className="card-title text-sm font-semibold hover:text-primary transition-colors line-clamp-2">
                            {title}
                        </h3>
                    </Link>
                )}

                {/* Description snippet */}
                {description && (
                    <p className="text-xs text-base-content/70 line-clamp-2 mb-2">
                        {description}
                    </p>
                )}

                {/* Artist card - inline micro style */}
                {artistData && (
                    <div className="mb-3">
                        <Link 
                            href={`/artists/${artistData.Path || artistData.path || artistData.ArtistID}`}
                            className="inline-flex items-center gap-2 px-2 py-1 bg-base-200 hover:bg-base-300 rounded-full transition-colors duration-200 text-xs"
                        >
                            {/* Artist Name */}
                            <span className="font-medium text-base-content truncate max-w-24">
                                {artistData.Title || artistData.title || artistData.name || 'Unknown Artist'}
                            </span>
                        </Link>
                    </div>
                )}

                {/* Social interactions */}
                {showInteractions && (
                    <CardSocial
                        targetId={listingId}
                        targetType="listing"
                        orientation="horizontal"
                        size="small"
                    />
                )}
            </div>
        </div>
    );
};

export default ListingCardSmall;
