/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Image from "next/image";
import { CardBase, CardHeader } from '@/components/cards/shared/CardBase';
import CardSocial from '@/components/cards/shared/CardSocial';
import CardGallery from '@/components/cards/shared/CardGallery';
import { useCardData, useCardConfig } from '@/components/cards/shared/hooks/useCardData';

/**
 * ArtistCardLarge - Detailed artist card with cover photo and full gallery
 */
const ArtistCardLarge = ({ 
    artist, 
    orientation = 'vertical', // Large cards work best vertical with cover photo
    showSocials = true,
    showComments = true,
    className = ''
}) => {
    const artistData = useCardData(artist, 'artist');
    const config = useCardConfig('large');

    if (!artistData) return null;

    const cardContent = (
        <>
            {/* Cover Photo with Overlaid Header */}
            <div className="relative h-48 lg:h-64 overflow-hidden">
                <Image
                    src={artistData.coverPic?.url || artistData.profilePic?.url || "/placeholder.svg"}
                    alt={artistData.coverPic?.alttext || "Artist cover"}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-300 group-hover:scale-105"
                />
                {/* Gradient overlay for text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                {/* Header content over cover photo */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-white text-shadow-lg">
                        <CardHeader
                            profilePic={artistData.profilePic}
                            title={artistData.title}
                            byline={artistData.byline}
                            size="large"
                            orientation="horizontal"
                            href={`/artists/${artistData.path}`}
                        />
                    </div>
                </div>
            </div>

            <div className={`card-body ${config.bodyPadding} flex-grow`}>
                {/* Additional metadata for large cards */}
                {config.showMetadata && artistData.metadata && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2 text-xs text-base-content/60">
                            {artistData.metadata.isVerified && (
                                <span className="badge badge-primary badge-sm">✓ Verified</span>
                            )}
                            {artistData.metadata.location && (
                                <span className="badge badge-ghost badge-sm">{artistData.metadata.location}</span>
                            )}
                            {artistData.metadata.memberSince && (
                                <span className="badge badge-ghost badge-sm">
                                    Member since {new Date(artistData.metadata.memberSince).getFullYear()}
                                </span>
                            )}
                        </div>
                        {artistData.metadata.specialties && artistData.metadata.specialties.length > 0 && (
                            <div className="mt-2">
                                <div className="flex flex-wrap gap-1">
                                    {artistData.metadata.specialties.slice(0, 3).map((specialty, index) => (
                                        <span key={index} className="badge badge-outline badge-xs">
                                            {specialty}
                                        </span>
                                    ))}
                                    {artistData.metadata.specialties.length > 3 && (
                                        <span className="badge badge-outline badge-xs">
                                            +{artistData.metadata.specialties.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Gallery for large cards using new ArtworkGallery component */}
                {artistData.gallery && artistData.gallery.length > 0 && (
                    <div className="mt-4">
                        <CardGallery
                            images={artistData.gallery}
                            size="large"
                            className="w-full"
                        />
                    </div>
                )}

                {/* Comments preview for large cards */}
                {showComments && config.showComments && (
                    <div className="mt-4 p-4 bg-base-200 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">Recent Comments</h4>
                        <div className="space-y-2">
                            <div className="text-xs">
                                <span className="font-medium">ArtLover:</span>
                                <span className="text-base-content/70 ml-1">Amazing work! 🎨</span>
                            </div>
                            <div className="text-xs">
                                <span className="font-medium">Collector:</span>
                                <span className="text-base-content/70 ml-1">Love your style!</span>
                            </div>
                        </div>
                        <button className="btn btn-xs btn-ghost mt-2">View all comments</button>
                    </div>
                )}
            </div>

            {showSocials && (
                <CardSocial
                    targetId={artistData.id}
                    targetType="artist"
                    orientation="vertical"
                    size="large"
                />
            )}
        </>
    );

    return (
        <CardBase
            orientation="vertical"
            size="large"
            className={className}
        >
            {cardContent}
        </CardBase>
    );
};

export default ArtistCardLarge;
