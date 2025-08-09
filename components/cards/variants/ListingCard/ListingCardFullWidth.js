/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CardSocial from '@/components/cards/shared/CardSocial';

/**
 * ListingCardFullWidth - Full-width listing card for hero sections and detailed displays
 * Features large image, comprehensive details, and embedded artist information
 */
const ListingCardFullWidth = ({ 
    listing, 
    showInteractions = true,
    orientation = 'horizontal',
    galleryType = 'featured',
    className = '',
    ...otherProps 
}) => {
    const [imageError, setImageError] = useState(false);
    
    // Extract listing path and artist path for URL construction
    const listingPath = listing?.Path || listing?.path;
    const artistPath = listing?.artist?.Path || listing?.artist?.path || listing?.artistPath;
    
    // Construct the proper URL if we have both paths
    let listingUrl = `/art/${listing?.PictureID || listing?.listingID || 'unknown'}`;
    if (artistPath && listingPath) {
        listingUrl = `/artists/${artistPath}/listings/${listingPath}`;
    }
    
    const imageUrl = listing?.url || listing?.imageUrl || listing?.URL || listing?.profilePic?.url || listing?.picture?.url || `https://picsum.photos/seed/art-${listing?.PictureID || listing?.listingID}/1200/600`;
    const title = listing?.Title || listing?.title || 'Untitled';
    const description = listing?.Description || listing?.description || '';
    const altText = listing?.AltText || listing?.altText || title;
    const created = listing?.Created || listing?.created;
    const artist = listing?.artist || {};
    
    // Format creation date
    const createdDate = created ? new Date(created).toLocaleDateString() : '';
    
    return (
        <div className={`card bg-base-100 shadow-xl w-full ${className}`} {...otherProps}>
            <div className={`
                ${orientation === 'vertical' ? 'flex flex-col' : 'lg:flex lg:flex-row'}
            `}>
                {/* Image Section */}
                <figure className={`
                    relative 
                    ${orientation === 'vertical' ? 'w-full h-80' : 'lg:w-2/3 w-full h-80 lg:h-96'}
                `}>
                    {!imageError ? (
                        <Image
                            src={imageUrl}
                            alt={altText}
                            fill
                            sizes="(max-width: 1024px) 100vw, 66vw"
                            className="object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full bg-base-200 flex items-center justify-center">
                            <span className="text-4xl text-base-content/60">🖼️</span>
                        </div>
                    )}
                    
                    {/* Overlay for category or featured badge */}
                    {galleryType === 'featured' && (
                        <div className="absolute top-4 left-4">
                            <div className="badge badge-primary badge-lg">Featured</div>
                        </div>
                    )}
                </figure>
                
                {/* Content Section */}
                <div className={`
                    card-body 
                    ${orientation === 'vertical' ? 'w-full' : 'lg:w-1/3 w-full'}
                `}>
                    {/* Title and Artist */}
                    <div className="mb-4">
                        <Link href={listingUrl}>
                            <h2 className="card-title text-2xl lg:text-3xl hover:text-primary transition-colors cursor-pointer">
                                {title}
                            </h2>
                        </Link>
                        
                        {artist.title && (
                            <Link href={`/artists/${artistPath || artist.artistid}`}>
                                <p className="text-lg text-base-content/80 hover:text-primary transition-colors cursor-pointer mt-1">
                                    by {artist.title}
                                </p>
                            </Link>
                        )}
                        
                        {createdDate && (
                            <p className="text-sm text-base-content/60 mt-1">
                                Created: {createdDate}
                            </p>
                        )}
                    </div>
                    
                    {/* Description */}
                    {description && (
                        <div className="mb-4">
                            <p className="text-base leading-relaxed line-clamp-4">
                                {description}
                            </p>
                        </div>
                    )}
                    
                    {/* Artist Info Section */}
                    {artist.byline && (
                        <div className="mb-4 p-4 bg-base-200 rounded-lg">
                            <h3 className="font-semibold text-sm text-base-content/80 mb-2">About the Artist</h3>
                            <p className="text-sm text-base-content/70 line-clamp-3">
                                {artist.byline}
                            </p>
                        </div>
                    )}
                    
                    {/* Social Interactions */}
                    {showInteractions && (
                        <div className="mb-4">
                            <CardSocial 
                                targetType="listing"
                                targetId={listing?.PictureID?.toString() || listing?.listingID?.toString()}
                                orientation="horizontal"
                                size="large"
                            />
                        </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="card-actions justify-end mt-auto">
                        <Link href={listingUrl}>
                            <button className="btn btn-primary btn-lg">
                                View Details
                            </button>
                        </Link>
                        {artist.title && (
                            <Link href={`/artists/${artistPath || artist.artistid}`}>
                                <button className="btn btn-outline btn-lg">
                                    View Artist
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingCardFullWidth;
