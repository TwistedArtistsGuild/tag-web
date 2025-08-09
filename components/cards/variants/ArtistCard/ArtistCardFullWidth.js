/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Image from "next/image";
import { CardHeader } from '@/components/cards/shared/CardBase';
import CardSocial from '@/components/cards/shared/CardSocial';
import CardGallery from '@/components/cards/shared/CardGallery';
import { useCardData } from '@/components/cards/shared/hooks/useCardData';
import { getRandomStockPhotoByCategory } from '@/utils/stockPhotos';

/**
 * ArtistCardFullWidth - Hero-style full-width artist card with cover photo and advanced gallery
 */
const ArtistCardFullWidth = ({ 
    artist, 
    showSocials = true,
    showComments = true,
    className = ''
}) => {
    const artistData = useCardData(artist, 'artist');

    if (!artistData) return null;

    // Mock comment data for prototype using stock photos for avatars
    const mockComments = [
        {
            id: 'comment-1',
            userId: 'user-1',
            username: 'ArtLover23',
            userAvatar: getRandomStockPhotoByCategory('artist'),
            content: 'Amazing work! The detail in this piece is incredible.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            likes: 5,
            isLiked: false
        },
        {
            id: 'comment-2',
            userId: 'user-2',
            username: 'CreativeCollector',
            userAvatar: getRandomStockPhotoByCategory('artist'),
            content: 'Beautiful composition! How long did this take to create?',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            likes: 3,
            isLiked: true
        }
    ];

    const cardContent = (
        <div className="w-full">
            {/* Large Cover Photo with Overlaid Header */}
            <div className="relative h-64 lg:h-80 overflow-hidden">
                <Image
                    src={artistData.coverPic?.url || artistData.profilePic?.url || "/placeholder.svg"}
                    alt={artistData.coverPic?.alttext || "Artist cover"}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-300 group-hover:scale-105"
                />
                {/* Gradient overlay for text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                {/* Header content over cover photo */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="text-white text-shadow-lg">
                        <CardHeader
                            profilePic={artistData.profilePic}
                            title={artistData.title}
                            byline={artistData.byline}
                            size="fullwidth"
                            orientation="horizontal"
                            href={`/artists/${artistData.path}`}
                        />
                    </div>
                </div>
            </div>

            {/* Content section */}
            <div className="p-6 lg:p-8">
                {/* Metadata section */}
                {artistData.metadata && (
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-3 text-sm text-base-content/70">
                            {artistData.metadata.isVerified && (
                                <span className="badge badge-primary">✓ Verified Artist</span>
                            )}
                            {artistData.metadata.location && (
                                <span className="badge badge-ghost">{artistData.metadata.location}</span>
                            )}
                            {artistData.metadata.memberSince && (
                                <span className="badge badge-ghost">
                                    Member since {new Date(artistData.metadata.memberSince).getFullYear()}
                                </span>
                            )}
                        </div>
                        {artistData.metadata.specialties && artistData.metadata.specialties.length > 0 && (
                            <div className="mt-3">
                                <div className="flex flex-wrap gap-2">
                                    {artistData.metadata.specialties.map((specialty, index) => (
                                        <span key={index} className="badge badge-outline">
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Gallery section using new CardGallery component */}
                {artistData.gallery && artistData.gallery.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Featured Works</h3>
                        <CardGallery
                            images={artistData.gallery}
                            size="fullwidth"
                            className="w-full"
                        />
                    </div>
                )}

                {/* Comments section */}
                {showComments && mockComments.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Recent Comments</h3>
                        <div className="space-y-4">
                            {mockComments.map((comment) => (
                                <div key={comment.id} className="flex gap-3 p-4 bg-base-200 rounded-lg">
                                    <div className="avatar">
                                        <div className="w-10 h-10 rounded-full overflow-hidden">
                                            <Image 
                                                src={comment.userAvatar} 
                                                alt={comment.username}
                                                width={40}
                                                height={40}
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm">{comment.username}</span>
                                            <span className="text-xs text-base-content/60">
                                                {new Date(comment.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-base-content/80">{comment.content}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <button className="text-xs text-base-content/60 hover:text-primary">
                                                ❤️ {comment.likes} likes
                                            </button>
                                            <button className="text-xs text-base-content/60 hover:text-primary">
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button className="btn btn-outline btn-sm">View all comments</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Social actions at bottom */}
            {showSocials && (
                <div className="border-t border-base-300">
                    <CardSocial
                        targetId={artistData.id}
                        targetType="artist"
                        orientation="horizontal"
                        size="fullwidth"
                    />
                </div>
            )}
        </div>
    );

    return (
        <div className={`card bg-base-100 shadow-lg border border-base-300 w-full ${className}`}>
            {cardContent}
        </div>
    );
};

export default ArtistCardFullWidth;
