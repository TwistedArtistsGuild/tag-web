/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from 'next/link';
import Image from 'next/image';
import { EyeIcon, BookmarkIcon } from 'lucide-react';
import CardSocial from '@/components/cards/shared/CardSocial';

/**
 * ListingCardLarge - Detailed listing card with full artist information
 */
const ListingCardLarge = ({ 
    listing, 
    showInteractions = true,
    showFullDescription = true,
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
    const created = listing.Created || listing.created;
    
    // Listing URL data
    const listingPath = listing.Path || listing.path;
    
    // Artist data - could be embedded or referenced
    const artistData = listing.artist || {
        ArtistID: listing.ArtistID,
        Title: listing.artistName,
        Path: listing.artistPath || listing.artistSlug,
        Byline: listing.artistByline,
        ProfilePicID: listing.artistProfilePic,
        Since: listing.artistSince,
        Statement: listing.artistStatement,
    };
    
    // Construct proper listing URL: /artists/[artistSlug]/listings/[listingSlug]
    const artistPath = artistData.Path || artistData.path;
    const listingUrl = (artistPath && listingPath) 
        ? `/artists/${artistPath}/listings/${listingPath}`
        : `/art/${listingId}`; // Fallback to old pattern if data is missing

    return (
        <div className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 ${className}`}>
            {/* Main artwork image */}
            <figure className="relative overflow-hidden aspect-video">
                <Link href={listingUrl}>
                    <Image
                        src={thumbnailUrl || imageUrl}
                        alt={altText}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </Link>
            </figure>

            <div className="card-body p-6">
                {/* Title */}
                {title && (
                    <Link href={listingUrl}>
                        <h1 className="card-title text-2xl font-bold hover:text-primary transition-colors mb-3">
                            {title}
                        </h1>
                    </Link>
                )}

                {/* Artist card - expanded style */}
                {artistData && (
                    <div className="mb-6 p-4 bg-base-200 rounded-lg">
                        <Link 
                            href={`/artists/${artistData.Path || artistData.path || artistData.ArtistID}`}
                            className="flex items-start gap-4 hover:bg-base-300 p-2 rounded-lg transition-colors duration-200"
                        >
                            {/* Profile placeholder or image */}
                            <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center text-base-content/60 flex-shrink-0">
                                <span className="text-lg font-bold">
                                    {(artistData.Title || artistData.title || 'A').charAt(0).toUpperCase()}
                                </span>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-base-content mb-1">
                                    {artistData.Title || artistData.title || artistData.name || 'Unknown Artist'}
                                </h3>
                                
                                {artistData.Byline && (
                                    <p className="text-sm text-base-content/80 mb-2">
                                        {artistData.Byline}
                                    </p>
                                )}
                                
                                {artistData.Since && (
                                    <p className="text-xs text-base-content/60">
                                        Member since {new Date(artistData.Since).getFullYear()}
                                    </p>
                                )}
                                
                                {artistData.Statement && (
                                    <p className="text-sm text-base-content/70 mt-2 line-clamp-2">
                                        {artistData.Statement}
                                    </p>
                                )}
                            </div>
                        </Link>
                    </div>
                )}

                {/* Description */}
                {description && (
                    <div className="mb-4">
                        <p className={`text-base text-base-content/90 ${showFullDescription ? '' : 'line-clamp-4'}`}>
                            {description}
                        </p>
                    </div>
                )}

                {/* Context */}
                {context && (
                    <div className="mb-4 p-3 bg-base-200/50 rounded-lg border-l-4 border-primary">
                        <p className="text-sm text-base-content/80 italic">
                            {context}
                        </p>
                    </div>
                )}

                {/* Created date */}
                {created && (
                    <p className="text-xs text-base-content/60 mb-4">
                        Created {new Date(created).toLocaleDateString()}
                    </p>
                )}

                {/* Interaction buttons */}
                {showInteractions && (
                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-4">
                            <CardSocial 
                                targetType="listing"
                                targetId={listing.PictureID?.toString()}
                                className="flex-1"
                            />
                            
                            <div className="flex items-center gap-4">
                                <button className="btn btn-ghost btn-sm">
                                    <BookmarkIcon className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-1 text-base-content/40">
                                    <EyeIcon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{listing.views || 0}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex gap-2">
                            <Link href={`/art/${listingId}`} className="btn btn-primary flex-1">
                                View Full Size
                            </Link>
                            <Link href={`/artists/${artistData.Path || artistData.path || artistData.ArtistID}`} className="btn btn-outline">
                                Visit Artist
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListingCardLarge;
