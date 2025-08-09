/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from 'next/link';
import Image from 'next/image';

/**
 * Micro Artist Card - Badge-like component for inline use
 * Perfect for blog authors, comments, or other inline references
 */
const ArtistCardMicro = ({ artist, showBio = false, className = '' }) => {
    if (!artist) return null;
    
    // Handle different data structures for profile picture
    const profilePicture = artist.profile_picture_url || artist.profilePic?.url;
    const artistName = artist.display_name || artist.title || artist.name || `${artist.first_name} ${artist.last_name}`;
    
    return (
        <Link 
            href={`/artists/${artist.slug || artist.path || artist.id}`}
            className={`inline-flex items-center gap-2 px-3 py-1.5 bg-base-200 hover:bg-base-300 rounded-full transition-colors duration-200 text-sm ${className}`}
        >
            {/* Profile Picture */}
            {profilePicture && (
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                        src={profilePicture}
                        alt={`${artistName} profile picture`}
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            
            {/* Artist Name */}
            <span className="font-medium text-base-content truncate max-w-32">
                {artistName}
            </span>
            
            {/* Optional Bio Snippet */}
            {showBio && (artist.bio || artist.byline || artist.description) && (
                <span className="text-xs text-base-content/70 truncate max-w-24">
                    • {artist.bio || artist.byline || artist.description}
                </span>
            )}
        </Link>
    );
};

export default ArtistCardMicro;
