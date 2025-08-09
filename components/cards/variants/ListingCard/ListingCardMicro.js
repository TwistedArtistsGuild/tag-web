/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * ListingCardMicro - Ultra-compact listing card for thumbnails and tight grids
 * Perfect for gallery overviews and search results
 */
const ListingCardMicro = ({ 
    listing, 
    showInteractions = false,
    className = '',
    onClick = null,
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
    
    const imageUrl = listing?.url || listing?.imageUrl || listing?.URL || listing?.profilePic?.url || listing?.picture?.url || `https://picsum.photos/seed/art-${listing?.PictureID || listing?.listingID}/120/120`;
    const title = listing?.Title || listing?.title || 'Untitled';
    const altText = listing?.AltText || listing?.altText || title;
    
    const cardContent = (
        <div 
            className={`
                card card-compact bg-base-100 shadow-sm hover:shadow-md transition-all duration-200
                cursor-pointer hover:scale-105 w-20 h-20 md:w-24 md:h-24
                ${className}
            `}
            onClick={onClick}
            {...otherProps}
        >
            <figure className="relative w-full h-full">
                {!imageError ? (
                    <Image
                        src={imageUrl}
                        alt={altText}
                        fill
                        sizes="(max-width: 768px) 80px, 96px"
                        className="object-cover rounded-lg"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-base-200 flex items-center justify-center rounded-lg">
                        <span className="text-xs text-base-content/60">🖼️</span>
                    </div>
                )}
                
                {/* Hover overlay with minimal info */}
                <div className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white p-1">
                        <h3 className="text-xs font-medium leading-tight line-clamp-2">
                            {title}
                        </h3>
                        {showInteractions && (
                            <div className="flex items-center justify-center gap-1 mt-1 text-xs">
                                <span>❤️ {listing?.hearts || listing?.likes || 0}</span>
                            </div>
                        )}
                    </div>
                </div>
            </figure>
        </div>
    );
    
    // Wrap with Link if we have a valid URL and no custom onClick
    if (!onClick && listingUrl) {
        return (
            <Link href={listingUrl} className="block">
                {cardContent}
            </Link>
        );
    }
    
    return cardContent;
};

export default ListingCardMicro;
