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
 * ListingCardMedium - Standard listing card with embedded artist small card
 */
const ListingCardMedium = ({ 
    listing, 
    orientation = 'horizontal',
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
    const context = listing.Context || listing.context;
    
    // Listing URL data
    const listingPath = listing.Path || listing.path;
    
    // Artist data - could be embedded or referenced
    const artistData = listing.artist || {
        ArtistID: listing.ArtistID,
        Title: listing.artistName,
        Path: listing.artistPath || listing.artistSlug,
        Byline: listing.artistByline,
        ProfilePicID: listing.artistProfilePic,
    };
    
    // Construct proper listing URL: /artists/[artistSlug]/listings/[listingSlug]
    const artistPath = artistData.Path || artistData.path;
    const listingUrl = (artistPath && listingPath) 
        ? `/artists/${artistPath}/listings/${listingPath}`
        : `/art/${listingId}`; // Fallback to old pattern if data is missing

    const isHorizontal = orientation === 'horizontal';

    return (
        <div className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 ${isHorizontal ? 'card-side' : ''} ${className}`}>
            {/* Main artwork image */}
            <figure className={`relative overflow-hidden ${isHorizontal ? 'w-1/2' : 'aspect-video'}`}>
                <Link href={listingUrl}>
                    <Image
                        src={thumbnailUrl || imageUrl}
                        alt={altText}
                        width={isHorizontal ? 400 : 600}
                        height={isHorizontal ? 300 : 400}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </Link>
            </figure>

            <div className={`card-body ${isHorizontal ? 'w-1/2' : ''} p-6`}>
                {/* Title */}
                {title && (
                    <Link href={listingUrl}>
                        <h2 className="card-title text-lg font-bold hover:text-primary transition-colors line-clamp-2 mb-2">
                            {title}
                        </h2>
                    </Link>
                )}

                {/* Artist card - small inline style */}
                {artistData && (
                    <div className="mb-4">
                        <Link 
                            href={`/artists/${artistData.Path || artistData.path || artistData.ArtistID}`}
                            className="flex items-center gap-3 p-2 bg-base-200 hover:bg-base-300 rounded-lg transition-colors duration-200"
                        >
                            {/* Profile placeholder or image */}
                            <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-base-content/60">
                                <span className="text-sm font-semibold">
                                    {(artistData.Title || artistData.title || 'A').charAt(0).toUpperCase()}
                                </span>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-base-content truncate">
                                    {artistData.Title || artistData.title || artistData.name || 'Unknown Artist'}
                                </p>
                                {artistData.Byline && (
                                    <p className="text-xs text-base-content/60 truncate">
                                        {artistData.Byline}
                                    </p>
                                )}
                            </div>
                        </Link>
                    </div>
                )}

                {/* Description */}
                {description && (
                    <p className="text-sm text-base-content/80 line-clamp-3 mb-4">
                        {description}
                    </p>
                )}

                {/* Context */}
                {context && (
                    <p className="text-xs text-base-content/60 italic mb-4">
                        {context}
                    </p>
                )}

                {/* Interaction buttons */}
                {showInteractions && (
                    <div className="flex items-center justify-between">
                        <CardSocial 
                            targetType="listing"
                            targetId={listing.PictureID?.toString()}
                            className="flex-1"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListingCardMedium;
